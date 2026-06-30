export const EMPTY_PROJECT = {
  id: "",
  name: "No project",
  color: "#3B82F6",
  tag: "NEW",
  description: "Create a project to get started",
  taskCount: 1,
  completedTasks: 0,
  pomodoroSessions: 0,
  lastActive: "-",
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
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  const dateText = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (!hasTime) return dateText;
  return `${dateText} ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
}

export function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

export function toInputTime(value, fallback = "09:00") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function localDateTimeToIso(dateValue, timeValue = "09:00") {
  if (!dateValue) return "";
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours = 9, minutes = 0] = (timeValue || "09:00").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

export function initials(value = "") {
  const source = value.trim() || "DF";
  return source.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
