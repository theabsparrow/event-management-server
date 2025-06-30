import { z } from "zod";

const userValidationSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .max(30, "name can`t be more than 30 character"),
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email")
    .trim(),
  password: z
    .string({ required_error: "password is required" })
    .min(6, "password must be at least 6 character")
    .max(16, "password can`t be more that 16 character")
    .refine(
      (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(value),
      {
        message:
          "password must be contain one capital letter, one small letter, one number and one special chareacter ",
      }
    ),
  photoURL: z
    .string({ required_error: "image should be in string" })
    .url("invalid url"),
});

export const userValidation = {
  userValidationSchema,
};
