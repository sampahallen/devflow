import { Router } from "express";
import { createCrudController } from "../controllers/crud.controller.js";
import { Task } from "../models/Task.js";
import { createCrudService } from "../services/crud.service.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { taskSchema } from "../validators/schemas.js";

const controller = createCrudController(createCrudService(Task));
export const taskRoutes = Router();
taskRoutes.use(requireAuth);
taskRoutes.get("/", asyncHandler(controller.list));
taskRoutes.post("/", validate(taskSchema), asyncHandler(controller.create));
taskRoutes.patch("/:id", asyncHandler(controller.update));
taskRoutes.delete("/:id", asyncHandler(controller.remove));
