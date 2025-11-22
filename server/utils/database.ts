import knex from "knex";

// Helper function to get database connection in server routes
export const getDatabase = () => {
  const runtimeConfig = useRuntimeConfig();

  // Parse connection string and configure SSL properly
  const connectionString = runtimeConfig.databaseUrl;
  console.log("connectionString", connectionString);
  // For PostgreSQL connections, we need to handle SSL explicitly
  // Remove any sslmode parameters from the connection string
  const cleanConnectionString =
    connectionString?.replace(/[?&]sslmode=[^&]*/g, "") || "";

  return knex({
    client: "pg",
    connection: {
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
  });
};

// Database helper functions
export class DatabaseHelper {
  public db: any;

  constructor(database?: any) {
    this.db = database || getDatabase();
  }

  // Generic CRUD operations
  async findById(table: string, id: string | number) {
    return await this.db(table).where("id", id).first();
  }

  async findByField(table: string, field: string, value: any) {
    return await this.db(table).where(field, value).first();
  }

  async findAll(table: string, where?: object) {
    let query = this.db(table);
    if (where) {
      query = query.where(where);
    }
    return await query.select("*");
  }

  async create(table: string, data: object) {
    const now = new Date();
    const dataWithTimestamps = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const [result] = await this.db(table)
      .insert(dataWithTimestamps)
      .returning("*");
    return result;
  }

  async update(table: string, id: string | number, data: object) {
    const [result] = await this.db(table)
      .where("id", id)
      .update({ ...data, updatedAt: new Date() })
      .returning("*");
    return result;
  }

  async delete(table: string, id: string | number) {
    return await this.db(table).where("id", id).del();
  }

  // Company-specific helpers
  async findCompanyBySlug(slug: string) {
    return await this.db("companies").where("slug", slug).first();
  }

  async findUserByEmail(email: string) {
    return await this.db("users").where("email", email).first();
  }

  async findUserByPhone(phone: string) {
    return await this.db("users").where("phone", phone).first();
  }

  // Professional helpers
  async findCompanyProfessionals(companyId: string) {
    return await this.db("company_professionals")
      .join("users", "company_professionals.user_id", "users.id")
      .where("company_professionals.company_id", companyId)
      .where("company_professionals.status", "active")
      .select(
        "company_professionals.*",
        "users.name",
        "users.email",
        "users.phone"
      );
  }

  // Client helpers
  async findCompanyClients(companyId: string) {
    return await this.db("company_users")
      .join("users", "company_users.user_id", "users.id")
      .where("company_users.company_id", companyId)
      .select("company_users.*", "users.name", "users.email", "users.phone");
  }

  // Service helpers
  async findCompanyServices(companyId: string) {
    return await this.db("services").where("company_id", companyId);
  }

  // Product helpers
  async findCompanyProducts(companyId: string) {
    return await this.db("products").where("company_id", companyId);
  }

  // Appointment helpers
  async findAppointmentsByDate(
    companyId: string,
    date: string,
    professionalId?: string
  ) {
    let query = this.db("appointments")
      .where("company_id", companyId)
      .whereRaw("DATE(start_date) = ?", [date])
      .where("status", "active");

    if (professionalId) {
      query = query.where("company_professional_id", professionalId);
    }

    return await query.select("*");
  }

  // Order helpers
  async findCompanyOrders(companyId: string, status?: string) {
    let query = this.db("orders")
      .join("company_users", "orders.company_user_id", "company_users.id")
      .join("users", "company_users.user_id", "users.id")
      .where("orders.company_id", companyId);

    if (status) {
      query = query.where("orders.status", status);
    }

    return await query.select(
      "orders.*",
      "users.name as client_name",
      "users.email as client_email",
      "users.phone as client_phone"
    );
  }

  // Movement helpers
  async findCompanyMovements(companyId: string, category?: string) {
    let query = this.db("movements").where("company_id", companyId);

    if (category) {
      query = query.where("category", category);
    }

    return await query.select("*").orderBy("created_at", "desc");
  }

  // Close connection
  async close() {
    await this.db.destroy();
  }
}
