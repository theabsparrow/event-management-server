/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utills/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utills/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { attendeeService } from "./attendee.service";

const createAttendee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const id = req.params.id;
    const result = await attendeeService.createAttendeeToJoin(userId, id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "successfully join the event",
      data: result,
    });
  }
);

const cancelJoining = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const id = req.params.id;
    const result = await attendeeService.cancelJoining(userId, id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "successfully cancelled attending",
      data: result,
    });
  }
);

const myJoiningEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await attendeeService.myJoiningEvent(userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "events retrived successfully",
      data: result,
    });
  }
);
export const attendeeController = {
  createAttendee,
  cancelJoining,
  myJoiningEvent,
};
