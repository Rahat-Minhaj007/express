import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: any) => {
  console.log(roles);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        res.status(401).json({
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
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      if (!userExistResult.rows[0].is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decode;
      // console.log(req);

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
