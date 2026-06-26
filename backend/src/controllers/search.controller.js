import { Note } from "../models/Note.js";
import { Prompt } from "../models/Prompt.js";
import { Resource } from "../models/Resource.js";
import { Task } from "../models/Task.js";
import { ok } from "../utils/apiResponse.js";

export const search = async (req, res) => {
  const { projectId, q = "" } = req.query;
  const text = new RegExp(q, "i");
  const base = { createdBy: req.user._id, projectId };
  const [tasks, notes, prompts, resources] = await Promise.all([
    Task.find({ ...base, title: text }).limit(8),
    Note.find({ ...base, title: text }).limit(8),
    Prompt.find({ ...base, title: text }).limit(8),
    Resource.find({ ...base, title: text }).limit(8)
  ]);
  ok(res, { tasks, notes, prompts, resources });
};
