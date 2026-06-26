import mongoose from "mongoose";

const calendarAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiryDate: { type: Number }
  },
  { timestamps: true }
);

export const CalendarAccount = mongoose.model("CalendarAccount", calendarAccountSchema);
