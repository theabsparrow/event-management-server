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

export const userService = {
  createUser,
};
