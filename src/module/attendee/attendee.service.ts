/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { Event } from "../event/event.model";
import { Attendee } from "./attendee.model";
import mongoose, { Types } from "mongoose";
import { TAtendee } from "./attendee.interface";

const createAttendeeToJoin = async (userId: string, id: string) => {
  const isEventExists = await Event.findById(id).select("date time isDeleted");
  if (!isEventExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "this event data not fount");
  }
  if (isEventExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "this event data not fount");
  }
  const isAttendeeExists = await Attendee.findOne({
    userId: userId,
    eventId: isEventExists?._id,
  });
  if (isAttendeeExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "you have already joined this event"
    );
  }
  const date = isEventExists?.date;
  const time = isEventExists?.time;
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eventDate < today) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Cannot join past events");
  }
  if (eventDate === today) {
    const [eventHour, eventMinute] = time.split(":").map(Number);
    const eventDateTime = new Date();
    eventDateTime.setHours(eventHour, eventMinute, 0, 0);
    const now = new Date();
    if (eventDateTime < now) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Cannot join past events");
    }
  }
  const payload: TAtendee = {
    eventId: isEventExists?._id,
    userId: new Types.ObjectId(userId),
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const JoinEvent = await Attendee.create([payload], { session });
    if (!JoinEvent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "faild to join the event");
    }

    const increaseAttendeeCount = await Event.findByIdAndUpdate(
      id,
      { $inc: { attendeeCount: 1 } },
      { session, new: true, runValidators: true }
    );
    if (!increaseAttendeeCount) {
      throw new AppError(StatusCodes.BAD_REQUEST, "faild to join the event");
    }
    await session.commitTransaction();
    await session.endSession();
    return JoinEvent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

export const attendeeService = {
  createAttendeeToJoin,
};
