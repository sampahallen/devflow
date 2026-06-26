import { Router } from "express";
import * as controller from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardRoutes = Router();
dashboardRoutes.use(requireAuth);
dashboardRoutes.get("/", asyncHandler(controller.overview));
