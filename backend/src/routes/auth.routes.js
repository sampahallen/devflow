import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, refreshSchema, registerSchema } from "../validators/schemas.js";

export const authRoutes = Router();
authRoutes.post("/register", validate(registerSchema), asyncHandler(controller.register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(controller.login));
authRoutes.post("/refresh", validate(refreshSchema), asyncHandler(controller.refresh));
authRoutes.post("/logout", requireAuth, asyncHandler(controller.logout));
