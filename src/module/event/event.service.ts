import { Types } from "mongoose";
import { TEvent } from "./event.interface";

const createEvent = async (userId: string, payload: TEvent) => {
  payload.userId = new Types.ObjectId(userId);
  console.log(payload);
};

export const eventService = {
  createEvent,
};
