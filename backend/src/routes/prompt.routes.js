import { Router } from "express";
import { createCrudController } from "../controllers/crud.controller.js";
import { Prompt } from "../models/Prompt.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCrudService } from "../services/crud.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { promptSchema } from "../validators/schemas.js";

const controller = createCrudController(createCrudService(Prompt));
export const promptRoutes = Router();
promptRoutes.use(requireAuth);
promptRoutes.get("/", asyncHandler(controller.list));
promptRoutes.post("/", validate(promptSchema), asyncHandler(controller.create));
promptRoutes.patch("/:id", asyncHandler(controller.update));
promptRoutes.delete("/:id", asyncHandler(controller.remove));
