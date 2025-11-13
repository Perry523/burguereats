import { BaseModel } from './BaseModel'
import type { Company, CreateCompanyData } from '~/types/database'

export class CompanyModel extends BaseModel {
  getTableName(): string {
    return 'companies'
  }

  // Find company by slug
  async findBySlug(slug: string): Promise<Company | null> {
    return await this.findByField('slug', slug)
  }

  // Create new company
  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    this.validateRequired(companyData, ['name', 'slug'])

    // Check if slug already exists
    const existingCompany = await this.findBySlug(companyData.slug)
    if (existingCompany) {
      throw new Error('Company with this slug already exists')
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(companyData.slug)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens')
    }

    return await this.create({
      ...companyData,
      tryal_phase: true,
      solo_professional: true,
      instagram_enabled: false,
      facebook_enabled: false
    })
  }

  // Update company profile
  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    // If slug is being updated, validate it
    if (data.slug) {
      const slugRegex = /^[a-z0-9-]+$/
      if (!slugRegex.test(data.slug)) {
        throw new Error('Slug must contain only lowercase letters, numbers, and hyphens')
      }

      // Check if new slug is already taken
      const existingCompany = await this.findBySlug(data.slug)
      if (existingCompany && existingCompany.id !== id) {
        throw new Error('Slug already taken')
      }
    }

    return await this.update(id, data)
  }

  // Get company working hours for a specific day
  getWorkingHours(company: Company, dayOfWeek: string): string | null {
    const timeField = `${dayOfWeek.toLowerCase()}_time` as keyof Company
    return company[timeField] as string | null
  }

  // Get company pause hours for a specific day
  getPauseHours(company: Company, dayOfWeek: string): string | null {
    const pauseField = `${dayOfWeek.toLowerCase()}_pause` as keyof Company
    return company[pauseField] as string | null
  }

  // Update working hours
  async updateWorkingHours(id: string, schedule: Record<string, string>) {
    const updateData: any = {}
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    days.forEach(day => {
      if (schedule[`${day}_time`]) {
        updateData[`${day}_time`] = schedule[`${day}_time`]
      }
      if (schedule[`${day}_pause`]) {
        updateData[`${day}_pause`] = schedule[`${day}_pause`]
      }
    })

    return await this.update(id, updateData)
  }

  // Get company clients
  async getCompanyClients(companyId: string) {
    return await this.db.findCompanyClients(companyId)
  }

  // Get company professionals
  async getCompanyProfessionals(companyId: string) {
    return await this.db.findCompanyProfessionals(companyId)
  }

  // Get company services
  async getCompanyServices(companyId: string) {
    return await this.db.findCompanyServices(companyId)
  }

  // Get company products
  async getCompanyProducts(companyId: string) {
    return await this.db.findCompanyProducts(companyId)
  }

  // Add user as client
  async addClient(companyId: string, userId: string) {
    // Check if relationship already exists
    const existing = await this.db.db('company_users')
      .where({ company_id: companyId, user_id: userId })
      .first()

    if (existing) {
      throw new Error('User is already a client of this company')
    }

    return await this.db.create('company_users', {
      company_id: companyId,
      user_id: userId,
      total_spent: 0,
      total_scheduled: 0
    })
  }

  // Add user as professional
  async addProfessional(companyId: string, userId: string, role?: string, commission: number = 100) {
    // Check if relationship already exists
    const existing = await this.db.db('company_professionals')
      .where({ company_id: companyId, user_id: userId })
      .first()

    if (existing) {
      throw new Error('User is already a professional of this company')
    }

    return await this.db.create('company_professionals', {
      company_id: companyId,
      user_id: userId,
      role,
      commission,
      status: 'active'
    })
  }

  // Remove professional
  async removeProfessional(companyId: string, professionalId: string) {
    return await this.db.db('company_professionals')
      .where({ company_id: companyId, id: professionalId })
      .update({ status: 'inactive' })
  }

  // Update company colors
  async updateColors(id: string, colors: {
    buttons_color?: string
    background_color?: string
    cards_color?: string
  }) {
    return await this.update(id, colors)
  }

  // Update social media settings
  async updateSocialMediaSettings(id: string, settings: {
    instagram_enabled?: boolean
    facebook_enabled?: boolean
    instagram_app_id?: string
    instagram_app_secret?: string
    instagram_redirect_uri?: string
    facebook_app_id?: string
    facebook_app_secret?: string
    facebook_redirect_uri?: string
  }) {
    return await this.update(id, settings)
  }

  // Get company statistics
  async getCompanyStats(companyId: string) {
    const [
      clientsCount,
      professionalsCount,
      servicesCount,
      productsCount,
      appointmentsCount,
      ordersCount
    ] = await Promise.all([
      this.db.db('company_users').where('company_id', companyId).count('* as count').first(),
      this.db.db('company_professionals').where('company_id', companyId).where('status', 'active').count('* as count').first(),
      this.db.db('services').where('company_id', companyId).where('status', 'active').count('* as count').first(),
      this.db.db('products').where('company_id', companyId).where('status', 'active').count('* as count').first(),
      this.db.db('appointments').where('company_id', companyId).where('status', 'active').count('* as count').first(),
      this.db.db('orders').where('company_id', companyId).where('status', 'active').count('* as count').first()
    ])

    return {
      clients: parseInt(clientsCount.count as string),
      professionals: parseInt(professionalsCount.count as string),
      services: parseInt(servicesCount.count as string),
      products: parseInt(productsCount.count as string),
      appointments: parseInt(appointmentsCount.count as string),
      orders: parseInt(ordersCount.count as string)
    }
  }

  // Search companies
  async searchCompanies(searchTerm: string) {
    return await this.search(['name', 'slug', 'description'], searchTerm)
  }
}
