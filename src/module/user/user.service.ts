import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { TUSer } from "./user.interface";
import { User } from "./user.model";
import { capitalizeFirstWord } from "./user.utills";
import { createToken } from "../auth/auth.utills";
import config from "../../config";

const createUser = async (payload: TUSer) => {
  const isEmailExist = await User.findOne({ email: payload.email }).select(
    "email"
  );
  if (isEmailExist) {
    throw new AppError(StatusCodes.CONFLICT, "this email is already in used");
  }
  payload.name = capitalizeFirstWord(payload?.name);
  const userInfo = await User.create(payload);
  if (!userInfo) {
    throw new AppError(StatusCodes.BAD_REQUEST, "failed to regester");
  }
  const jwtPayload = {
    userId: userInfo?._id.toString(),
    userRole: userInfo?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return { accessToken, refreshToken, userInfo };
};

const getMeRoute = async (userId: string) => {
  const result = await User.findById(userId);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "user data not found");
  }
};

const updateUser = async (id: string, payload: Partial<TUSer>) => {
  const isUserExists = await User.findById(id);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "user data not found");
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "faild to update data");
  }
};

const deleteUSer = async (id: string) => {
  const isUserExists = await User.findById(id);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "user data not found");
  }
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "faild to delete account");
  }
  return null;
};

export const userService = {
  createUser,
  getMeRoute,
  updateUser,
  deleteUSer,
};
