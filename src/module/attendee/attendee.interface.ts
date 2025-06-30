import { Types } from "mongoose";

export type TAtendee = {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
};
