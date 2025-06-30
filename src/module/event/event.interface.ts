import { Types } from "mongoose";

export type TEvent = {
  userId: Types.ObjectId;
  title: string;
  name: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  isDeleted: boolean;
};
