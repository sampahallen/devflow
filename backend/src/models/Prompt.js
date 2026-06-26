import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["Coding", "Debugging", "Documentation", "UI/UX", "Refactoring"], default: "Coding" },
    tags: [{ type: String }],
    favorite: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Prompt = mongoose.model("Prompt", promptSchema);
