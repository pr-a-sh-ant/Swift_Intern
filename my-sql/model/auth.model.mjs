import { col } from "sequelize";
import pool from "../db/connect.mjs";
import mysql from "mysql2/promise";

const createUser = async (userDetail) => {
  try {
    const columns = Object.keys(userDetail)
      .map((col) => `\`${col}\``)
      .join(", ");
    const values = Object.values(userDetail);
    const query = mysql.format(`INSERT INTO Users (${columns}) VALUES (?)`, [
      values,
    ]);
    const result = await pool.execute(query);
    return result[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
};

const findUserByEmail = async (email) => {
  try {
    const query = mysql.format("SELECT * FROM Users WHERE email = ?", [email]);
    const [rows] = await pool.execute(query);
    return rows[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("User not found");
  }
};

const Auth = { createUser, findUserByEmail };

export default Auth;
