import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["todo", "in-progress", "review", "done"], default: "todo" },
    dueDate: { type: Date },
    assignee: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    resourceLinks: [{ type: String }],
    markdownFiles: [{ type: String }],
    completedPomodoros: { type: Number, default: 0 },
    targetPomodoros: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    calendarEventId: { type: String, default: "" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
