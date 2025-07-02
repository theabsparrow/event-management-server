import { Router } from "express";
import { auth } from "../../middlewire/auth";
import { USER_ROLE } from "../user/user.const";
import { attendeeController } from "./attendee.controller";
import { authRefresh } from "../../middlewire/authRefresh";

const router = Router();
router.post(
  "/join-event/:id",
  auth(USER_ROLE.user),
  attendeeController.createAttendee
);
router.delete(
  "/cancel-joining/:id",
  auth(USER_ROLE.user),
  attendeeController.cancelJoining
);
router.get(
  "/joined-events",
  authRefresh(USER_ROLE.user),
  attendeeController.myJoiningEvent
);
export const attendeeRoute = router;
