import pool from "../db/connect.js";
import mysql from "mysql2/promise";

const createPost = async (postDetail) => {
  try {
    const columns = Object.keys(postDetail)
      .map((col) => `\`${col}\``)
      .join(", ");
    const values = Object.values(postDetail);

    const query = mysql.format(`INSERT INTO Posts (${columns}) VALUES (?)`, [
      values,
    ]);
    const result = await pool.execute(query);
    return result[0];
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Post creation failed");
  }
};

const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const query = mysql.format(
      `SELECT * FROM Posts ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

const getPostById = async (postId) => {
  try {
    const query = mysql.format(
      `Select p.id, p.title, p.content, p.createdAt, p.updatedAt, u.name 
      from Posts p inner join Users u on 
      p.authorId = u.id where p.id = ?`,
      [postId]
    );

    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post");
  }
};

const updatePost = async (authorId, postDetail, postId) => {
  const getPostQuery = mysql.format(`SELECT * FROM Posts WHERE id = ?`, [
    postId,
  ]);
  const [post] = await pool.execute(getPostQuery);

  if (post.length === 0) {
    console.error("Post not found for update:", postId);
    throw new Error("Post not found");
  }
  if (post[0].authorId !== authorId) {
    console.error("Unauthorized update attempt on post:", postId);
    throw new Error("Unauthorized update attempt");
  }
  const columns = Object.keys(postDetail)
    .map((col) => `\`${col}\` = ?`)
    .join(", ");
  const values = Object.values(postDetail);
  console.log(columns);
  const query = mysql.format(
    `UPDATE Posts SET ${columns}, updatedAt = NOW() WHERE id = ?`,
    [...values, postId]
  );
  const [result] = await pool.execute(query);
  if (result.affectedRows === 0) {
    console.error("Post update failed:", postId);
    throw new Error("Post update failed");
  }
  return result;
};

const deletePost = async (authorId, postId) => {
  const getPostQuery = mysql.format(`SELECT * from Posts where id = ?`, [
    postId,
  ]);
  const [post] = await pool.execute(getPostQuery);
  if (post.length === 0) {
    console.error("Post not found for deletion:", postId);
    throw new Error("Post not found");
  }
  if (post[0].authorId !== authorId) {
    console.error("Unauthorized deletion attempt on post:", postId);
    throw new Error("Unauthorized deletion attempt");
  }
  const deleteQuery = mysql.format(`DELETE FROM Posts WHERE id = ?`, [postId]);
  const [result] = await pool.execute(deleteQuery);
  if (result.affectedRows === 0) {
    console.error("Post deletion failed:", postId);
    throw new Error("Post deletion failed");
  }
  return result;
};

const postModel = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

export default postModel;
