import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import { TAuthLogin, TChangePassword } from "./auth.interface";
import { createToken, passwordMatching } from "./auth.utills";
import config from "../../config";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";

const login = async (payload: TAuthLogin) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email: email }).select("+password");
  if (!isUserExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "the email you provided is incorrect"
    );
  }
  const userIsDeleted = isUserExists?.isDeleted;
  if (userIsDeleted) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "the email you provided is incorrect"
    );
  }
  const userPass = isUserExists?.password;
  const isPasswordMatched = await passwordMatching(password, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "the password you have provided is wrong"
    );
  }
  const jwtPayload = {
    userId: isUserExists?._id.toString(),
    userRole: isUserExists?.role,
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
  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (id: string, payload: TChangePassword) => {
  const { oldPassword, newPassword } = payload;
  const saltNumber = config.bcrypt_salt_round as string;
  const isUserExists = await User.findById(id).select("+password");
  if (!isUserExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "the email you provided is incorrect"
    );
  }
  const userPass = isUserExists?.password;
  const isPasswordMatched = await passwordMatching(oldPassword, userPass);
  if (!isPasswordMatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "the password you have provided is wrong"
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, Number(saltNumber));
  const result = await User.findByIdAndUpdate(
    id,
    { password: hashedPassword, passwordChangedAt: new Date() },
    { new: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "failed to change password");
  }
  const jwtPayload = {
    userId: isUserExists?._id.toString(),
    userRole: isUserExists?.role,
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
  return { accessToken, refreshToken };
};

const generateAccessToken = async (user: JwtPayload) => {
  const { userId } = user;
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "user data not found");
  }
  const jwtPayload = {
    userId: isUserExist?._id.toString() as string,
    userRole: isUserExist?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return accessToken;
};

export const authService = {
  login,
  changePassword,
  generateAccessToken,
};
