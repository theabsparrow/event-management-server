import { USER_ROLE } from "./user.const";

export type TUSerRole = keyof typeof USER_ROLE;

export type TUSer = {
  name: string;
  email: string;
  password: string;
  photoURL: string;
  role: TUSerRole;
  isDeleted: boolean;
};
