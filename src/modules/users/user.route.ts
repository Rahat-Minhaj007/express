import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

// post user
// /api/v1/users
router.post("/", userController.createUser);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUser,
);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getSingleUser,
);
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userController.updateUser,
);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
