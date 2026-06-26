import { Router } from "express";
import { createCrudController } from "../controllers/crud.controller.js";
import { Resource } from "../models/Resource.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createCrudService } from "../services/crud.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resourceSchema } from "../validators/schemas.js";

const controller = createCrudController(createCrudService(Resource));
export const resourceRoutes = Router();
resourceRoutes.use(requireAuth);
resourceRoutes.get("/", asyncHandler(controller.list));
resourceRoutes.post("/", validate(resourceSchema), asyncHandler(controller.create));
resourceRoutes.patch("/:id", asyncHandler(controller.update));
resourceRoutes.delete("/:id", asyncHandler(controller.remove));
