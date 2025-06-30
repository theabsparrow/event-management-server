/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utills/sendResponse";
import { StatusCodes } from "http-status-codes";
import { cookieOptions } from "../auth/auth.const";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await userService.createUser(payload);
    const { accessToken, refreshToken, userInfo } = result;
    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: " regestration successfyll",
      data: { accessToken, refreshToken, userInfo },
    });
  }
);

export const userController = {
  createUser,
};
