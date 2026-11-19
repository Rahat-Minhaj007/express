import { pool } from "../../db";
import type { IUser, UpdateUser } from "./user.interface";

const createUserService = async (payload: IUser) => {
  const { name, email, password, age } = payload;

  const queryText = `INSERT INTO users (name, email, password, age) VALUES ($1,$2,$3,$4) RETURNING *`;
  const values = [name, email, password, age];
  const result = await pool.query(queryText, values);

  console.log(result);
  return result;
};

const getAllUserService = async () => {
  const queryText = `SELECT * FROM users`;
  const result = await pool.query(queryText);

  console.log(result.rows);
  return result.rows;
};

const getSingleUserService = async (id: string) => {
  const queryText = "SELECT * FROM users WHERE id = $1";
  const values = [id];
  const result = await pool.query(queryText, values);
  return result.rows;
};

const updateUserService = async (payload: UpdateUser, id: string) => {
  const { name, password, is_active, age } = payload;
  const queryText = `
      UPDATE users 
      SET name =COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($4, age),
      is_active = COALESCE($3, is_active),
      updated_at = NOW()
      WHERE id = $5 
      RETURNING *
    `;
  const values = [
    name ?? null,
    password ?? null,
    is_active ?? null,
    age ?? null,
    id,
  ];
  const result = await pool.query(queryText, values);
  return result;
};
const deleteUserService = async (id: string) => {
  const queryText = "DELETE FROM users WHERE id = $1";
  const values = [id];
  const result = await pool.query(queryText, values);
  // Handle case where user ID does not exist
  return result;
};

export const userService = {
  createUserService,
  getSingleUserService,
  getAllUserService,
  updateUserService,
  deleteUserService,
};
