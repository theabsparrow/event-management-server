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

export const attendeeController = {
  createAttendee,
};
