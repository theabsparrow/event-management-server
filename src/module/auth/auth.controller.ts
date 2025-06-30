/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utills/sendResponse";
import { StatusCodes } from "http-status-codes";
import { cookieOptions } from "./auth.const";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.login(payload);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "login successfully",
      data: { accessToken, refreshToken },
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refreshToken", cookieOptions);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "successfully logged out" });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user;
    const { userId } = user;
    const result = await authService.changePassword(payload, userId);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "password changed successfully",
      data: { accessToken, refreshToken },
    });
  }
);

const generateAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await authService.generateAccessToken(user);
    res.cookie("accessToken", result, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "token generated successfullt",
      data: { accessToken: result },
    });
  }
);

export const authController = {
  login,
  logout,
  changePassword,
  generateAccessToken,
};
