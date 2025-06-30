import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest";
import { userValidation } from "./user.validation";
import { userController } from "./user.controller";

import { USER_ROLE } from "./user.const";
import { authRefresh } from "../../middlewire/authRefresh";
import { auth } from "../../middlewire/auth";

const router = Router();
router.post(
  "/register",
  validateRequest(userValidation.userValidationSchema),
  userController.createUser
);
router.get(
  "/get-me",
  authRefresh(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMeRoute
);
router.patch(
  "/update-data",
  validateRequest(userValidation.updateUserValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.updateUser
);
router.delete(
  "/delete-user",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.deleteUSer
);
export const userRoute = router;
