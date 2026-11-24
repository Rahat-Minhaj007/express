import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  console.log(roles);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access!!",
        });
      }
      const decode = jwt.verify(token, config.jwtSecreteKey) as JwtPayload;

      const userExistQueryText = "SELECT * FROM users WHERE email = $1";
      const userExistValues = [decode.email];
      const userExistResult = await pool.query(
        userExistQueryText,
        userExistValues,
      );

      if (userExistResult.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      if (!userExistResult.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      if (roles.length && !roles.includes(userExistResult.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access!!",
        });
      }
      req.user = decode;
      // console.log(req);

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
