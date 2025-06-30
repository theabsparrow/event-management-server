import { TEvent } from "./event.interface";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import { Event } from "./event.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";

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

const getAllEvents = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  query = { ...query, ...filter };
  const eventsQuery = new QueryBuilder(Event.find(), query)
    .search(["title"])
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await eventsQuery.modelQuery;
  const meta = await eventsQuery.countTotal();
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  return { meta, result };
};

const getASingleEvent = async (id: string) => {
  const result = await Event.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  if (result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  return result;
};

const getMyEvents = async (userId: string, query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  query = { ...query, ...filter };
  const eventsQuery = new QueryBuilder(Event.find({ userId: userId }), query)
    .search(["title"])
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await eventsQuery.modelQuery;
  const meta = await eventsQuery.countTotal();
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  return { meta, result };
};

const getMySingleEvent = async (userId: string, id: string) => {
  const result = await Event.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  if (result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  if (result.userId.toString() !== userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "you have no permission to view this"
    );
  }
  return result;
};

const updateEvent = async ({
  userId,
  id,
  payload,
}: {
  userId: string;
  id: string;
  payload: Partial<TEvent>;
}) => {
  const isEventExists = await Event.findById(id);
  if (!isEventExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  if (isEventExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  const eventOwnerId = isEventExists?.userId;
  if (eventOwnerId.toString() !== userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "you have no permission to update this"
    );
  }
  const result = await Event.findByIdAndUpdate(isEventExists?._id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "faild to update event data");
  }
  return result;
};

const deleteEvent = async (userId: string, id: string) => {
  const isEventExists = await Event.findById(id);
  if (!isEventExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  if (isEventExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "no data found");
  }
  const eventOwnerId = isEventExists?.userId;
  if (eventOwnerId.toString() !== userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "you have no permission to update this"
    );
  }
  const result = await Event.findByIdAndUpdate(
    isEventExists?._id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "faild to delete data");
  }
  return null;
};

export const eventService = {
  createEvent,
  getAllEvents,
  getASingleEvent,
  getMyEvents,
  getMySingleEvent,
  updateEvent,
  deleteEvent,
};
