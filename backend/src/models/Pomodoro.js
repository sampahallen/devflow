import mongoose from "mongoose";

const pomodoroSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    completedSessions: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Pomodoro = mongoose.model("Pomodoro", pomodoroSchema);
