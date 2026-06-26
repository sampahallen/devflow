import { Router } from "express";
import * as controller from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { projectSchema } from "../validators/schemas.js";

export const projectRoutes = Router();
projectRoutes.use(requireAuth);
projectRoutes.get("/", asyncHandler(controller.list));
projectRoutes.post("/", validate(projectSchema), asyncHandler(controller.create));
projectRoutes.patch("/:id", asyncHandler(controller.update));
projectRoutes.delete("/:id", asyncHandler(controller.remove));
