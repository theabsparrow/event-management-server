import { z } from "zod";

const eventValidationSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "title can`t be blank")
    .max(50, "title can`t be more than 50 character"),
  image: z.string().url("invalid image url").optional(),
  date: z
    .string({ required_error: "date is required" })
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      {
        message: "Date must be in the future",
      }
    )
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Date must be in YYYY-MM-DD format",
    }),
  time: z
    .string({ required_error: "time is required" })
    .refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
      message: "Time must be in HH:MM 24-hour format",
    }),
  location: z
    .string({ required_error: "location is required" })
    .max(30, "location can`t be more than 30 character"),
  description: z
    .string({ required_error: "description is required" })
    .min(10, "description can`t be less than 10 charcter")
    .max(1000, "description can`t be more than 1000 charcter"),
});

const updateEventValidationSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "title can`t be blank")
    .max(50, "title can`t be more than 50 character")
    .optional(),
  image: z.string().url("invalid image url").optional(),
  date: z
    .string({ required_error: "date is required" })
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      {
        message: "Date must be in the future",
      }
    )
    .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Date must be in YYYY-MM-DD format",
    })
    .optional(),
  time: z
    .string({ required_error: "time is required" })
    .refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
      message: "Time must be in HH:MM 24-hour format",
    })
    .optional(),
  location: z
    .string({ required_error: "location is required" })
    .max(30, "location can`t be more than 30 character")
    .optional(),
  description: z
    .string({ required_error: "description is required" })
    .min(10, "description can`t be less than 10 charcter")
    .max(1000, "description can`t be more than 1000 charcter")
    .optional(),
});

export const eventValidation = {
  eventValidationSchema,
  updateEventValidationSchema,
};
