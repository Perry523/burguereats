// Export all models for easy importing
export { BaseModel } from './BaseModel'
export { UserModel } from './UserModel'
export { CompanyModel } from './CompanyModel'
export { ServiceModel } from './ServiceModel'

// Model factory for dependency injection
export class ModelFactory {
  private database: any

  constructor(database?: any) {
    this.database = database
  }

  user() {
    return new UserModel(this.database)
  }

  company() {
    return new CompanyModel(this.database)
  }

  service() {
    return new ServiceModel(this.database)
  }

  // Add more models as they are created
  // product() {
  //   return new ProductModel(this.database)
  // }

  // appointment() {
  //   return new AppointmentModel(this.database)
  // }

  // order() {
  //   return new OrderModel(this.database)
  // }
}

// Helper function to create models with database connection
export function createModels(database?: any) {
  return new ModelFactory(database)
}
