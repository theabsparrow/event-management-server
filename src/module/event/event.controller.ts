/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { eventService } from "./event.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utills/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { userId } = req.user as JwtPayload;
    const result = await eventService.createEvent(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "event created successfully",
      data: result,
    });
  }
);

export const eventController = {
  createEvent,
};
