import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 365 * 24 * 60 * 60 * 1000,
} as const;
