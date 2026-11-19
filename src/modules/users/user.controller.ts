import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "user created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserService();
    res.status(200).json({
      success: true,
      message: "users data retrieved!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUserService(
      req.params.id as string,
    );
    res.status(200).json({
      success: true,
      message: "users data retrieved!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;
    const userId = req.params.id as string;
    const result = await userService.updateUserService(reqBody, userId);

    // Handle case where user ID does not exist
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "users data updated!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const result = await userService.deleteUserService(userId);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "users data deleted!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
