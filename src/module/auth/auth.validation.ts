import { z } from "zod";

const authLoginValidationSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email("invalid email"),
  password: z
    .string({ required_error: "password is required" })
    .max(16, "password max length should be 16"),
});

const passwordChangeValidationSchema = z.object({
  oldPassword: z
    .string({ required_error: "password is required" })
    .max(16, "password max length should be 16"),
  newPassword: z
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
});

export const authValidation = {
  authLoginValidationSchema,
  passwordChangeValidationSchema,
};
