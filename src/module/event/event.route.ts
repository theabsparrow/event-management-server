import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest";
import { eventValidation } from "./event.validation";
import { auth } from "../../middlewire/auth";
import { USER_ROLE } from "../user/user.const";
import { eventController } from "./event.controller";
import { authRefresh } from "../../middlewire/authRefresh";

const router = Router();
router.post(
  "/create-event",
  validateRequest(eventValidation.eventValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.createEvent
);
router.get("/all-events", eventController.getAllEvents);
router.get("/single-event/:id", eventController.getASingleEvent);
router.get(
  "/my-events",
  authRefresh(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.getMyEvents
);
router.get(
  "/mySingle-event/:id",
  authRefresh(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.getMySingleEvent
);
router.patch(
  "/update-event/:id",
  validateRequest(eventValidation.updateEventValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.updateEvent
);
router.delete(
  "/delete-event/:id",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.deleteEvent
);
export const eventRouter = router;
