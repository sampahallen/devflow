import { Router } from "express";
import * as controller from "../controllers/search.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchRoutes = Router();
searchRoutes.use(requireAuth);
searchRoutes.get("/", asyncHandler(controller.search));
