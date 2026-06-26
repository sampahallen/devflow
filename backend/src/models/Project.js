import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, index: true },
    color: { type: String, default: "#3B82F6" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1, createdBy: 1 }, { unique: true });

export const Project = mongoose.model("Project", projectSchema);
