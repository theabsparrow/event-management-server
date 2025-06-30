import { TEvent } from "./event.interface";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Event } from "./event.model";
import { User } from "../user/user.model";

const createEvent = async (userId: string, payload: TEvent) => {
  const isUserExists = await User.findById(userId).select("name");
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "user data not fount");
  }
  payload.userId = isUserExists?._id;
  payload.name = isUserExists?.name;
  const result = await Event.create(payload);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "faild to create an event");
  }
  return result;
};

export const eventService = {
  createEvent,
};
