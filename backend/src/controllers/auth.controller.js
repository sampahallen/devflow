import * as auth from "../services/auth.service.js";
import { created, ok } from "../utils/apiResponse.js";

export const register = async (req, res) => created(res, await auth.register(req.body), "Account created");
export const login = async (req, res) => ok(res, await auth.login(req.body), "Logged in");
export const refresh = async (req, res) => ok(res, await auth.refresh(req.body.refreshToken), "Token refreshed");
export const logout = async (req, res) => {
  await auth.logout(req.user._id);
  ok(res, {}, "Logged out");
};
