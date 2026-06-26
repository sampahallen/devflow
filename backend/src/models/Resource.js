import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    category: { type: String, enum: ["Documentation", "APIs", "Tutorials", "Design References", "Stack Overflow"], default: "Documentation" },
    notes: { type: String, default: "" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
