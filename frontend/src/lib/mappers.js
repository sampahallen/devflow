export const EMPTY_PROJECT = {
  id: "",
  name: "No project",
  color: "#3B82F6",
  tag: "NEW",
  description: "Create a project to get started",
  taskCount: 1,
  completedTasks: 0,
  pomodoroSessions: 0,
  lastActive: "—",
  raw: null
};

export function asTemplateProject(project, tasks = [], pomodoros = []) {
  if (!project) return { ...EMPTY_PROJECT };

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const sessions = pomodoros.reduce((sum, item) => sum + (item.completedSessions || 0), 0);
  return {
    id: project._id || "",
    name: project.name || "Untitled project",
    color: project.color || "#3B82F6",
    tag: project.slug?.split("-")?.[0]?.slice(0, 4)?.toUpperCase() || "DEV",
    description: project.description || "Local-first developer workspace",
    taskCount: Math.max(total, 1),
    completedTasks: completed,
    pomodoroSessions: sessions,
    lastActive: "now",
    raw: project
  };
}

export function displayDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function initials(value = "") {
  const source = value.trim() || "DF";
  return source.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
