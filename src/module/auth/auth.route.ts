import { Router } from "express";
import validateRequest from "../../middlewire/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import { authRefresh } from "../../middlewire/authRefresh";
import { USER_ROLE } from "../user/user.const";
import { auth } from "../../middlewire/auth";

const router = Router();
router.post(
  "/login",
  validateRequest(authValidation.authLoginValidationSchema),
  authController.login
);
router.post(
  "/logout",
  authRefresh(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.logout
);
router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(authValidation.passwordChangeValidationSchema),
  authController.changePassword
);
router.post(
  "/get-token",
  authRefresh(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  authController.generateAccessToken
);
export const authRoute = router;
