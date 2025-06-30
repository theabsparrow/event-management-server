import { Router } from "express";
import { userRoute } from "../module/user/user.route";
import { authRoute } from "../module/auth/auth.route";
import { eventRouter } from "../module/event/event.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/event",
    route: eventRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
