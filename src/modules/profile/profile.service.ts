import { pool } from "../../db";

const createProfileService = async (payload: any) => {
  const { user_id, bio, address, phone, gender } = payload;

  const userExistQueryText = "SELECT * FROM profiles WHERE id = $1";
  const userExistValues = [user_id];
  const userExistResult = await pool.query(userExistQueryText, userExistValues);

  if (userExistResult.rowCount === 0) {
    throw new Error("User doesn't exist!");
  }

  const queryText = `INSERT INTO profiles (user_id, bio, address, phone, gender) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const values = [user_id, bio, address, phone, gender];
  const result = await pool.query(queryText, values);
  return result;
};

export const profileService = {
  createProfileService,
};
