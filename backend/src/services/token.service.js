import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_ACCESS_SECRET || "dev-access-secret", {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_REFRESH_SECRET || "dev-refresh-secret", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  });
}

export async function hashValue(value) {
  return bcrypt.hash(value, 10);
}

export async function compareValue(value, hash) {
  return bcrypt.compare(value, hash);
}
