import { model, Schema } from "mongoose";
import { TAtendee } from "./attendee.interface";

const AttendeeSchema = new Schema<TAtendee>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: [true, "event id is required"],
      ref: "Event",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "user id is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Attendee = model<TAtendee>("Attendee", AttendeeSchema);
