import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginService = async (payload: { email: string; password: string }) => {
  // check if the user exist
  // check if the password match
  // check the user status
  // if pass all than generate jwt token
  const { email, password } = payload;
  const checkUserQuery = "SELECT * FROM users WHERE email = $1";
  const checkUserValues = [email];
  const checkUser = await pool.query(checkUserQuery, checkUserValues);
  // console.log(checkUser.rows[0]);

  if (checkUser.rowCount === 0) {
    throw new Error("Invalid Credential!");
  }

  const matchPassword = await bcrypt.compare(
    password,
    checkUser.rows[0].password,
  );
  if (!matchPassword) {
    throw new Error("Invalid Credential!");
  }
  if (!checkUser.rows[0].is_active) {
    throw new Error("Access Denied!");
  }

  const jwtPayload = {
    id: checkUser.rows[0].id,
    name: checkUser.rows[0].name,
    email: checkUser.rows[0].email,
    role: checkUser.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwtSecreteKey, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refreshSecreteKey, {
    expiresIn: "10d",
  });

  delete checkUser.rows[0].password;
  return { accessToken, refreshToken, userInfo: checkUser.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized Access!!");
  }
  const decode = jwt.verify(token, config.refreshSecreteKey) as JwtPayload;

  const userExistQueryText = "SELECT * FROM users WHERE email = $1";
  const userExistValues = [decode.email];
  const userExistResult = await pool.query(userExistQueryText, userExistValues);

  if (userExistResult.rowCount === 0) {
    throw new Error("User not found!");
  }

  if (!userExistResult.rows[0].is_active) {
    throw new Error("Forbidden!");
  }

  const jwtPayload = {
    id: userExistResult.rows[0].id,
    name: userExistResult.rows[0].name,
    email: userExistResult.rows[0].email,
    role: userExistResult.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwtSecreteKey, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginService,
  generateAccessToken,
};
