import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  if (process.env.AUTH_DISABLED === "true") {
    const email = process.env.DEV_USER_EMAIL || "dev@devflow.local";
    const name = process.env.DEV_USER_NAME || "DevFlow Developer";
    req.user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { name, email, passwordHash: "auth-disabled" } },
      { new: true, upsert: true }
    ).select("-passwordHash");
    next();
    return;
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new AppError("Authentication required", 401);
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "dev-access-secret");
  const user = await User.findById(payload.sub).select("-passwordHash");
  if (!user) throw new AppError("User no longer exists", 401);
  req.user = user;
  next();
});
