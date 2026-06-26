import { Router } from "express";
import { Pomodoro } from "../models/Pomodoro.js";
import { Task } from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { pomodoroSchema } from "../validators/schemas.js";

export const pomodoroRoutes = Router();
pomodoroRoutes.use(requireAuth);
pomodoroRoutes.get("/", asyncHandler(async (req, res) => ok(res, await Pomodoro.find({ createdBy: req.user._id, projectId: req.query.projectId }))));
pomodoroRoutes.post("/complete", validate(pomodoroSchema), asyncHandler(async (req, res) => {
  const { projectId, taskId, minutes } = req.body;
  const entry = await Pomodoro.findOneAndUpdate({ createdBy: req.user._id, projectId, taskId }, { $inc: { completedSessions: 1, totalMinutes: minutes } }, { upsert: true, new: true });
  if (taskId) await Task.findOneAndUpdate({ _id: taskId, createdBy: req.user._id }, { $inc: { completedPomodoros: 1 } });
  ok(res, entry, "Pomodoro completed");
}));
