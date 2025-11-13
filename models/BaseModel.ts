import { DatabaseHelper } from '~/utils/database'

export abstract class BaseModel {
  protected db: DatabaseHelper
  protected tableName: string

  constructor(database?: any) {
    this.db = new DatabaseHelper(database)
    this.tableName = this.getTableName()
  }

  abstract getTableName(): string

  // Generic CRUD operations
  async findById(id: string) {
    return await this.db.findById(this.tableName, id)
  }

  async findByField(field: string, value: any) {
    return await this.db.findByField(this.tableName, field, value)
  }

  async findAll(where?: object) {
    return await this.db.findAll(this.tableName, where)
  }

  async create(data: object) {
    return await this.db.create(this.tableName, data)
  }

  async update(id: string, data: object) {
    return await this.db.update(this.tableName, id, data)
  }

  async delete(id: string) {
    return await this.db.delete(this.tableName, id)
  }

  // Pagination helper
  async paginate(page: number = 1, limit: number = 10, where?: object) {
    const offset = (page - 1) * limit
    let query = this.db.db(this.tableName)
    
    if (where) {
      query = query.where(where)
    }

    const [data, totalResult] = await Promise.all([
      query.clone().limit(limit).offset(offset).select('*'),
      query.clone().count('* as count').first()
    ])

    const total = parseInt(totalResult.count as string)
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Search helper
  async search(searchFields: string[], searchTerm: string, where?: object) {
    let query = this.db.db(this.tableName)
    
    if (where) {
      query = query.where(where)
    }

    // Add search conditions
    query = query.where((builder: any) => {
      searchFields.forEach((field, index) => {
        if (index === 0) {
          builder.where(field, 'ILIKE', `%${searchTerm}%`)
        } else {
          builder.orWhere(field, 'ILIKE', `%${searchTerm}%`)
        }
      })
    })

    return await query.select('*')
  }

  // Validation helpers
  protected validateRequired(data: any, requiredFields: string[]) {
    const missing = requiredFields.filter(field => !data[field])
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
  }

  protected validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
  }

  protected validatePhone(phone: string) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone format')
    }
  }

  // Date helpers
  protected formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date
    }
    return date.toISOString()
  }

  protected parseDate(dateString: string): Date {
    return new Date(dateString)
  }

  // Close database connection
  async close() {
    await this.db.close()
  }
}
