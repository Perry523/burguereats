import { BaseModel } from './BaseModel'

export interface Product {
  id: string
  company_id: string
  category_id: string | null
  name: string
  description: string | null
  buy_price: number
  sell_price: number
  quantity: number
  image: string | null
  is_active: boolean
  variants: any[]
  created_at: Date
  updated_at: Date
}

export class ProductModel extends BaseModel {
  getTableName(): string {
    return 'products'
  }

  async findByCompany(companyId: string) {
    return await this.db.db(this.tableName)
      .where('company_id', companyId)
      .orderBy('created_at', 'desc')
  }

  async findActiveByCompany(companyId: string) {
    return await this.db.db(this.tableName)
      .where('company_id', companyId)
      .where('is_active', true)
      .orderBy('created_at', 'desc')
  }

  async updateStock(id: string, quantity: number) {
    return await this.update(id, { quantity })
  }

  async toggleActive(id: string, isActive: boolean) {
    return await this.update(id, { is_active: isActive })
  }
}
