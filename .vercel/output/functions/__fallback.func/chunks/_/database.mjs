import { u as useRuntimeConfig, k as knex } from '../nitro/nitro.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const getDatabase = () => {
  const runtimeConfig = useRuntimeConfig();
  const connectionString = runtimeConfig.databaseUrl;
  const cleanConnectionString = (connectionString == null ? void 0 : connectionString.replace(/[?&]sslmode=[^&]*/g, "")) || "";
  return knex({
    client: "pg",
    connection: {
      connectionString: cleanConnectionString,
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  });
};
class DatabaseHelper {
  constructor(database) {
    __publicField(this, "db");
    this.db = database || getDatabase();
  }
  // Generic CRUD operations
  async findById(table, id) {
    return await this.db(table).where("id", id).first();
  }
  async findByField(table, field, value) {
    return await this.db(table).where(field, value).first();
  }
  async findAll(table, where) {
    let query = this.db(table);
    if (where) {
      query = query.where(where);
    }
    return await query.select("*");
  }
  async create(table, data) {
    const now = /* @__PURE__ */ new Date();
    const dataWithTimestamps = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    const [result] = await this.db(table).insert(dataWithTimestamps).returning("*");
    return result;
  }
  async update(table, id, data) {
    const [result] = await this.db(table).where("id", id).update({ ...data, updatedAt: /* @__PURE__ */ new Date() }).returning("*");
    return result;
  }
  async delete(table, id) {
    return await this.db(table).where("id", id).del();
  }
  // Company-specific helpers
  async findCompanyBySlug(slug) {
    return await this.db("companies").where("slug", slug).first();
  }
  async findUserByEmail(email) {
    return await this.db("users").where("email", email).first();
  }
  async findUserByPhone(phone) {
    return await this.db("users").where("phone", phone).first();
  }
  // Professional helpers
  async findCompanyProfessionals(companyId) {
    return await this.db("company_professionals").join("users", "company_professionals.user_id", "users.id").where("company_professionals.company_id", companyId).where("company_professionals.status", "active").select("company_professionals.*", "users.name", "users.email", "users.phone");
  }
  // Client helpers
  async findCompanyClients(companyId) {
    return await this.db("company_users").join("users", "company_users.user_id", "users.id").where("company_users.company_id", companyId).select("company_users.*", "users.name", "users.email", "users.phone");
  }
  // Service helpers
  async findCompanyServices(companyId) {
    return await this.db("services").where("company_id", companyId);
  }
  // Product helpers
  async findCompanyProducts(companyId) {
    return await this.db("products").where("company_id", companyId);
  }
  // Appointment helpers
  async findAppointmentsByDate(companyId, date, professionalId) {
    let query = this.db("appointments").where("company_id", companyId).whereRaw("DATE(start_date) = ?", [date]).where("status", "active");
    if (professionalId) {
      query = query.where("company_professional_id", professionalId);
    }
    return await query.select("*");
  }
  // Order helpers
  async findCompanyOrders(companyId, status) {
    let query = this.db("orders").join("company_users", "orders.company_user_id", "company_users.id").join("users", "company_users.user_id", "users.id").where("orders.company_id", companyId);
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
  async findCompanyMovements(companyId, category) {
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

export { DatabaseHelper as D };
//# sourceMappingURL=database.mjs.map
