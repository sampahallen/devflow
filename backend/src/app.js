import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { authRoutes } from "./routes/auth.routes.js";
import { projectRoutes } from "./routes/project.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { promptRoutes } from "./routes/prompt.routes.js";
import { noteRoutes } from "./routes/note.routes.js";
import { resourceRoutes } from "./routes/resource.routes.js";
import { pomodoroRoutes } from "./routes/pomodoro.routes.js";
import { calendarRoutes } from "./routes/calendar.routes.js";
import { searchRoutes } from "./routes/search.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_URL || "http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const localDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (
        !origin
        || allowedOrigins.includes(origin)
        || (process.env.NODE_ENV !== "production" && localDevOrigin.test(origin))
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true
  }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));
  app.use(rateLimit({ windowMs: 60_000, max: 240 }));

  app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" }, message: "DevFlow API healthy" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/prompts", promptRoutes);
  app.use("/api/notes", noteRoutes);
  app.use("/api/resources", resourceRoutes);
  app.use("/api/pomodoro", pomodoroRoutes);
  app.use("/api/calendar", calendarRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
