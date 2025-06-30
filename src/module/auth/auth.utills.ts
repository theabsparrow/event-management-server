import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

type TJwtPayload = {
  userId: string;
  userRole: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

export const timeComparison = (passwordChangedAt: Date, tokenIat: number) => {
  const timeInNumber = new Date(passwordChangedAt).getTime() / 1000;
  return timeInNumber > tokenIat;
};

export const passwordMatching = async (password: string, userPass: string) => {
  const result = await bcrypt.compare(password, userPass);
  return result;
};
