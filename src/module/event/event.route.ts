import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest";
import { eventValidation } from "./event.validation";
import { auth } from "../../middlewire/auth";
import { USER_ROLE } from "../user/user.const";
import { eventController } from "./event.controller";

const router = Router();
router.post(
  "/create-event",
  validateRequest(eventValidation.eventValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  eventController.createEvent
);

export const eventRouter = router;
