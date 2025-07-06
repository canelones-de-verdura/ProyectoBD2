import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// singleton para los de ANDIS
export class db_manager {
  static instance;
  pool;

  constructor() {
    try {
      this.pool = mysql.createPool(dbConfig);
      console.log("[ OK ] Pool de conexiones creada.");
    } catch (error) {
      console.log("[ ERROR ] No se pudo crear la pool. Apagando...");
      console.log(error);
      process.exit(1); // irrecuperable
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new db_manager();
    }

    return this.instance;
  }

  /***
   * no se pueden hacer transacciones con la pool.
   * hay que llamar conn.release() cuando se termina de usar.
   */
  async getConnection() {
    return await this.pool.getConnection();
  }

  async query(sql, params) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.log("[ ERROR ] Falló la query: ", { sql, params, error });
      throw error;
    }
  }

  async execute(sql, params) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.log("[ ERROR ] Falló la query: ", { sql, params, error });
      throw error;
    }
  }

  async get_all(table, fields) {
    const fields_queried = !fields ? "*" : fields.join(", ");
    return this.execute(`SELECT ${fields_queried} FROM ${table}`);
  }

  async get_with(table, params, fields) {
    const condition = Object.keys(params)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const values = Object.keys(params).map((key) => params[key]);
    const fields_queried = !fields ? "*" : fields.join(", ");

    try {
      return this.execute(
        `SELECT ${fields_queried} FROM ${table} WHERE ${condition}`,
        values,
      );
    } catch (error) {
      throw error;
    }
  }

  close() {
    this.pool.end();
    console.log("[ OK ] Pool de conexiones terminada.");
  }
}
