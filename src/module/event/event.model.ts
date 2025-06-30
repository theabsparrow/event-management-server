import { model, Schema } from "mongoose";
import { TEvent } from "./event.interface";

const EventSchema = new Schema<TEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "title is required"],
      min: [1, "title can`t be blank"],
      max: [50, "title can`t be more that 50 character"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    image: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      required: [true, "date is required"],
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          return selectedDate > today;
        },
        message: "Date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
      min: [1, "location can`t be blank"],
      max: [30, "location can`t be more than 30 character"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
      min: [10, "description must be at least 10 character"],
      max: [1000, "description can`t be more than 1000 character"],
    },
    attendeeCount: {
      type: Number,
      default: 0,
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

export const Event = model<TEvent>("Event", EventSchema);
