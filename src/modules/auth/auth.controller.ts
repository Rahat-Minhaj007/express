import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginService(req.body);
    const { refreshToken } = result;

    console.log(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      secure: false, //http ->false, https -> true /In production true
      httpOnly: true, //prevent xss attack
      sameSite: "lax",
      // maxAge
      path: "/",
      domain: "localhost",
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    res.status(201).json({
      success: true,
      message: "Access token generated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
