import { Note } from "../models/Note.js";
import { Pomodoro } from "../models/Pomodoro.js";
import { Prompt } from "../models/Prompt.js";
import { Resource } from "../models/Resource.js";
import { Task } from "../models/Task.js";
import { ok } from "../utils/apiResponse.js";

export const overview = async (req, res) => {
  const { projectId } = req.query;
  const filter = { createdBy: req.user._id, projectId };
  const [activeTasks, notesCount, promptCount, resourceCount, upcomingDeadlines, pomodoros] = await Promise.all([
    Task.countDocuments({ ...filter, status: { $ne: "done" } }),
    Note.countDocuments(filter),
    Prompt.countDocuments(filter),
    Resource.countDocuments(filter),
    Task.find({ ...filter, dueDate: { $gte: new Date() } }).sort({ dueDate: 1 }).limit(5),
    Pomodoro.find(filter)
  ]);
  ok(res, {
    activeTasks,
    notesCount,
    promptCount,
    resourceCount,
    upcomingDeadlines,
    pomodoroSummary: pomodoros.reduce((acc, item) => ({ sessions: acc.sessions + item.completedSessions, minutes: acc.minutes + item.totalMinutes }), { sessions: 0, minutes: 0 }),
    recentActivity: []
  });
};
