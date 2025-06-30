/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utills/sendResponse";
import { StatusCodes } from "http-status-codes";
import { cookieOptions } from "../auth/auth.const";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await userService.createUser(payload);
    const { accessToken, refreshToken, userInfo } = result;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: " regestration successfull",
      data: { accessToken, refreshToken, userInfo },
    });
  }
);

const getMeRoute = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.user as JwtPayload;
    const { userId } = payload;
    const result = await userService.getMeRoute(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "info is retirved successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const { userId } = user;
    const payload = req.body;
    const result = await userService.updateUser(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "data updated successfully",
      data: result,
    });
  }
);

const deleteUSer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await userService.deleteUSer(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "data deleted successfully",
      data: result,
    });
  }
);

export const userController = {
  createUser,
  getMeRoute,
  updateUser,
  deleteUSer,
};
