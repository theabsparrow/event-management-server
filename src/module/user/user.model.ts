/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from "mongoose";
import { TUSer } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const UserSchema = new Schema<TUSer>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      min: [1, "name can`t be blank"],
      max: [30, "name can`t be more than 30 character"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [8, "password should be at least 6 character"],
      max: [16, "password can`t be more than 16 character"],
    },
    photoURL: {
      type: String,
      required: [true, "image is required"],
    },
    role: {
      type: String,
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

UserSchema.post("save", function (data, next) {
  data.password = "";
  next();
});

export const User = model<TUSer>("User", UserSchema);
