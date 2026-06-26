import { Router } from "express";
import * as controller from "../controllers/calendar.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const calendarRoutes = Router();
calendarRoutes.use(requireAuth);
calendarRoutes.get("/connect", asyncHandler(controller.connect));
calendarRoutes.get("/oauth/callback", asyncHandler(controller.callback));
calendarRoutes.post("/tasks/:taskId/sync", asyncHandler(controller.syncTask));
