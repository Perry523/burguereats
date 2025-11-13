import { BaseModel } from './BaseModel'
import type { Service, CreateServiceData } from '~/types/database'

export class ServiceModel extends BaseModel {
  getTableName(): string {
    return 'services'
  }

  // Create new service
  async createService(serviceData: CreateServiceData): Promise<Service> {
    this.validateRequired(serviceData, ['company_id', 'name', 'price', 'duration'])

    if (serviceData.price < 0) {
      throw new Error('Price must be a positive number')
    }

    if (serviceData.duration <= 0) {
      throw new Error('Duration must be greater than 0')
    }

    return await this.create({
      ...serviceData,
      status: 'active'
    })
  }

  // Get services by company
  async getByCompany(companyId: string, status?: 'active' | 'inactive') {
    const where: any = { company_id: companyId }
    if (status) {
      where.status = status
    }
    return await this.findAll(where)
  }

  // Update service
  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price must be a positive number')
    }

    if (data.duration !== undefined && data.duration <= 0) {
      throw new Error('Duration must be greater than 0')
    }

    return await this.update(id, data)
  }

  // Activate/Deactivate service
  async toggleStatus(id: string): Promise<Service> {
    const service = await this.findById(id)
    if (!service) {
      throw new Error('Service not found')
    }

    const newStatus = service.status === 'active' ? 'inactive' : 'active'
    return await this.update(id, { status: newStatus })
  }

  // Get most scheduled services for a company
  async getMostScheduled(companyId: string, limit: number = 5) {
    return await this.db.db('services')
      .leftJoin('appointments', 'services.id', 'appointments.service_id')
      .where('services.company_id', companyId)
      .where('services.status', 'active')
      .groupBy('services.id')
      .orderBy('appointment_count', 'desc')
      .limit(limit)
      .select(
        'services.*',
        this.db.db.raw('COUNT(appointments.id) as appointment_count')
      )
  }

  // Search services
  async searchServices(companyId: string, searchTerm: string) {
    return await this.db.db(this.tableName)
      .where('company_id', companyId)
      .where((builder: any) => {
        builder
          .where('name', 'ILIKE', `%${searchTerm}%`)
          .orWhere('description', 'ILIKE', `%${searchTerm}%`)
      })
      .select('*')
  }

  // Get service with associated products
  async getServiceWithProducts(id: string) {
    const service = await this.findById(id)
    if (!service) {
      return null
    }

    const products = await this.db.db('product_service')
      .join('products', 'product_service.product_id', 'products.id')
      .where('product_service.service_id', id)
      .select('products.*')

    return {
      ...service,
      products
    }
  }

  // Associate product with service
  async associateProduct(serviceId: string, productId: string) {
    // Check if association already exists
    const existing = await this.db.db('product_service')
      .where({ service_id: serviceId, product_id: productId })
      .first()

    if (existing) {
      throw new Error('Product is already associated with this service')
    }

    return await this.db.create('product_service', {
      service_id: serviceId,
      product_id: productId
    })
  }

  // Remove product association
  async removeProductAssociation(serviceId: string, productId: string) {
    return await this.db.db('product_service')
      .where({ service_id: serviceId, product_id: productId })
      .del()
  }

  // Get service statistics
  async getServiceStats(serviceId: string) {
    const [
      appointmentsCount,
      totalRevenue,
      avgRating
    ] = await Promise.all([
      this.db.db('appointments')
        .where('service_id', serviceId)
        .where('status', 'finished')
        .count('* as count')
        .first(),
      this.db.db('order_items')
        .join('appointments', 'order_items.service_id', 'appointments.service_id')
        .where('order_items.service_id', serviceId)
        .where('appointments.status', 'finished')
        .sum('order_items.total as total')
        .first(),
      // Placeholder for rating system (to be implemented)
      Promise.resolve({ avg: 0 })
    ])

    return {
      appointments: parseInt(appointmentsCount.count as string),
      revenue: parseFloat(totalRevenue.total as string) || 0,
      averageRating: parseFloat(avgRating.avg as string) || 0
    }
  }
}
