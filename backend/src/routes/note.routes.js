import { Router } from "express";
import * as controller from "../controllers/note.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { noteSchema } from "../validators/schemas.js";

export const noteRoutes = Router();
noteRoutes.use(requireAuth);
noteRoutes.get("/", asyncHandler(controller.list));
noteRoutes.get("/:id", asyncHandler(controller.read));
noteRoutes.post("/", validate(noteSchema), asyncHandler(controller.create));
noteRoutes.patch("/:id", asyncHandler(controller.update));
noteRoutes.delete("/:id", asyncHandler(controller.remove));
