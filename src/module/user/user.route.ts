import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest";
import { userValidation } from "./user.validation";
import { userController } from "./user.controller";

const router = Router();
router.post(
  "/regester",
  validateRequest(userValidation.userValidationSchema),
  userController.createUser
);

export const userRoute = router;
