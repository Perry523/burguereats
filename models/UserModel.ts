import { BaseModel } from './BaseModel'
import type { User, CreateUserData } from '~/types/database'
import bcrypt from 'bcrypt'

export class UserModel extends BaseModel {
  getTableName(): string {
    return 'users'
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.findByField('email', email)
  }

  // Find user by phone
  async findByPhone(phone: string): Promise<User | null> {
    return await this.findByField('phone', phone)
  }

  // Create new user with password hashing
  async createUser(userData: CreateUserData): Promise<User> {
    this.validateRequired(userData, ['name', 'email', 'phone', 'password'])
    this.validateEmail(userData.email)
    this.validatePhone(userData.phone)

    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user = await this.create({
      ...userData,
      password: hashedPassword,
      type: userData.type || 'client',
      finished_register: false
    })

    // Remove password from response
    delete user.password
    return user
  }

  // Verify password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.db.db(this.tableName)
      .where('email', email)
      .first()

    if (!user) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return null
    }

    // Remove password from response
    delete user.password
    return user
  }

  // Update user profile
  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, ...updateData } = data

    if (email && email !== (await this.findById(id))?.email) {
      this.validateEmail(email)
      // Check if new email is already taken
      const existingUser = await this.findByEmail(email)
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already taken')
      }
      updateData.email = email
    }

    return await this.update(id, updateData)
  }

  // Update password
  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.db.db(this.tableName)
      .where('id', id)
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await this.update(id, { password: hashedPassword })
    return true
  }

  // Search users by name, email, or phone
  async searchUsers(searchTerm: string, companyId?: string) {
    let query = this.db.db(this.tableName)
      .where((builder: any) => {
        builder
          .where('name', 'ILIKE', `%${searchTerm}%`)
          .orWhere('email', 'ILIKE', `%${searchTerm}%`)
          .orWhere('phone', 'ILIKE', `%${searchTerm}%`)
      })
      .select('id', 'name', 'email', 'phone', 'type', 'profile_photo_path')

    // If companyId is provided, exclude users already associated with the company
    if (companyId) {
      const existingUserIds = await this.db.db('company_users')
        .where('company_id', companyId)
        .pluck('user_id')

      if (existingUserIds.length > 0) {
        query = query.whereNotIn('id', existingUserIds)
      }
    }

    return await query
  }

  // Get user's companies
  async getUserCompanies(userId: string) {
    return await this.db.db('company_users')
      .join('companies', 'company_users.company_id', 'companies.id')
      .where('company_users.user_id', userId)
      .select(
        'companies.*',
        'company_users.total_spent',
        'company_users.total_scheduled'
      )
  }

  // Get user's professional associations
  async getUserProfessionalAssociations(userId: string) {
    return await this.db.db('company_professionals')
      .join('companies', 'company_professionals.company_id', 'companies.id')
      .where('company_professionals.user_id', userId)
      .where('company_professionals.status', 'active')
      .select(
        'companies.*',
        'company_professionals.role',
        'company_professionals.commission',
        'company_professionals.status'
      )
  }

  // Complete user registration
  async completeRegistration(id: string): Promise<User> {
    return await this.update(id, { finished_register: true })
  }

  // Get users by type
  async getUsersByType(type: 'client' | 'professional' | 'admin') {
    return await this.findAll({ type })
  }

  // Soft delete user (mark as inactive instead of deleting)
  async deactivateUser(id: string): Promise<User> {
    return await this.update(id, { type: 'inactive' })
  }
}
