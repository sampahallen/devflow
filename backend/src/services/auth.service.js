import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { compareValue, hashValue, signAccessToken, signRefreshToken } from "./token.service.js";

function serializeUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email is already registered", 409);
  const passwordHash = await hashValue(password);
  const user = await User.create({ name, email, passwordHash });
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashValue(refreshToken);
  await user.save();
  return { user: serializeUser(user), accessToken: signAccessToken(user), refreshToken };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await compareValue(password, user.passwordHash))) throw new AppError("Invalid email or password", 401);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await hashValue(refreshToken);
  await user.save();
  return { user: serializeUser(user), accessToken: signAccessToken(user), refreshToken };
}

export async function refresh(refreshToken) {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev-refresh-secret");
  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokenHash || !(await compareValue(refreshToken, user.refreshTokenHash))) throw new AppError("Invalid refresh token", 401);
  return { user: serializeUser(user), accessToken: signAccessToken(user), refreshToken };
}

export async function logout(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: "" } });
}
