import { Router } from "express";
import { userRoute } from "../module/user/user.route";
import { authRoute } from "../module/auth/auth.route";
import { eventRouter } from "../module/event/event.route";
import { attendeeRoute } from "../module/attendee/attendee.route";

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
  {
    path: "/join",
    route: attendeeRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
