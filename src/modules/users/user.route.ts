import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router();

// post user
// /api/v1/users
router.post("/", userController.createUser);

export const userRoute = router;
