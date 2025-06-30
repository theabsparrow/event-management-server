import { TUSerRole } from "./user.interface";

export const USER_ROLE = {
  admin: "admin",
  user: "user",
  superAdmin: "superAdmin",
} as const;

export const userRole: TUSerRole[] = ["admin", "superAdmin", "user"] as const;
