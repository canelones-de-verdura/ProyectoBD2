import mysql, {
  Pool,
  PoolOptions,
  PoolConnection,
  RowDataPacket,
} from "mysql2/promise";

const dbConfig: PoolOptions = {
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
  private static instance: db_manager;
  private pool: Pool;

  private constructor() {
    try {
      this.pool = mysql.createPool(dbConfig);
      console.log("[ OK ] Conexión con la base establecida.");
    } catch (error) {
      console.log(
        "[ ERROR ] No se pudo establecer la conexión con la base. Apagando...",
      );
      process.exit(1); // irrecuperable
    }
  }

  public static getInstance(): db_manager {
    if (!this.instance) {
      this.instance = new db_manager();
    }

    return this.instance;
  }

  public getConnection(): Promise<PoolConnection> {
    return this.pool.getConnection();
  }

  public async query<T extends RowDataPacket[]>(
    sql: string,
    params?: any[],
  ): Promise<T> {
    try {
      const [rows] = await this.pool.query<T>(sql, params);
      return rows;
    } catch (error) {
      console.log("[ ERROR ] Falló la query: ", { sql, params, error });
      throw error;
    }
  }

  public close() {
    this.pool.end();
    console.log("[ OK ] Conexión con la base terminada.");
  }
}
