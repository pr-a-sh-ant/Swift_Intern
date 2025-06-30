import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "ghost",
  database: "chat",
};

const pool = mysql.createPool(dbConfig);

try {
  const connection = await pool.getConnection();
  console.log("Database connection successful!");
} catch (error) {
  console.error("Database connection failed:", error);
  throw error; // Re-throw the error to handle it in the calling context
}

export default pool;
