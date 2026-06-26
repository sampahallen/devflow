import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    path: { type: String, required: true },
    tags: [{ type: String }],
    lastModified: { type: Date, default: Date.now },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

noteSchema.index({ path: 1, projectId: 1 }, { unique: true });

export const Note = mongoose.model("Note", noteSchema);
