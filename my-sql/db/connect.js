// Get the client
import mysql from "mysql2/promise";

import config from "../config/config.js";

const pool = mysql.createPool({
  host: config.development.host,
  user: config.development.username,
  password: config.development.password,
  database: config.development.database,
  port: config.development.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const connection = await pool.getConnection();
  console.log("Database connection successful!");
} catch (error) {
  console.error("Database connection failed:", error);
  throw error; // Re-throw the error to handle it in the calling context
}

export default pool;
