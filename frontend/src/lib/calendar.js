const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function dayIndexInWeek(date, weekStart) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - start) / 86_400_000);
  return diff >= 0 && diff < 7 ? diff : -1;
}

export function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6);
  const opts = { month: "short", day: "numeric" };
  const startStr = weekStart.toLocaleDateString(undefined, opts);
  const endStr = end.toLocaleDateString(undefined, { ...opts, year: weekStart.getFullYear() !== end.getFullYear() ? "numeric" : undefined });
  const year = weekStart.getFullYear();
  if (weekStart.getMonth() === end.getMonth()) {
    return `${weekStart.toLocaleDateString(undefined, { month: "long" })} ${weekStart.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${startStr} – ${endStr}, ${year}`;
}

export function getWeekDays(weekStart) {
  return DAY_LABELS.map((label, index) => {
    const date = addDays(weekStart, index);
    return { label, date, index, isToday: isSameDay(date, new Date()) };
  });
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function buildDateTime(weekStart, dayIndex, hour, minute = 0) {
  const d = addDays(weekStart, dayIndex);
  d.setHours(hour, minute, 0, 0);
  return d;
}

const priorityColors = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" };

export function tasksToWeekEvents(tasks, weekStart, fallbackColor = "#3B82F6") {
  const weekEnd = addDays(weekStart, 7);
  return tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const due = new Date(task.dueDate);
      if (due < weekStart || due >= weekEnd) return null;
      const dayIndex = dayIndexInWeek(due, weekStart);
      if (dayIndex < 0) return null;
      let hour = due.getHours();
      const minute = due.getMinutes();
      if (hour === 0 && minute === 0) hour = 9;
      return {
        id: task._id,
        taskId: task._id,
        title: task.title,
        dayIndex,
        hour,
        minute,
        duration: 1,
        color: priorityColors[task.priority] || fallbackColor,
        due
      };
    })
    .filter(Boolean);
}

export const CALENDAR_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
export const CALENDAR_START_HOUR = CALENDAR_HOURS[0];
export const HOUR_HEIGHT = 60;
