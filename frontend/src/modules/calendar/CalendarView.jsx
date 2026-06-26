import { Plus, Trash2, Wifi, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CALENDAR_HOURS,
  CALENDAR_START_HOUR,
  HOUR_HEIGHT,
  addDays,
  buildDateTime,
  formatWeekRange,
  getWeekDays,
  startOfWeek,
  tasksToWeekEvents
} from "../../lib/calendar.js";

function EventModal({ draft, onChange, onSave, onDelete, onClose, projectColor }) {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl p-4"
        style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.12)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>
            {draft.taskId ? "Edit event" : "New event"}
          </span>
          <button type="button" onClick={onClose} className="cursor-pointer" style={{ color: "#6E7681" }}>
            <X size={16} />
          </button>
        </div>

        <label className="mb-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Title</span>
          <input
            autoFocus
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            className="h-9 rounded-md border border-white/10 bg-[#0D1117] px-3 text-xs outline-none focus:border-[#3B82F6]"
            style={{ color: "#E6EDF3" }}
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) => onChange({ ...draft, date: event.target.value })}
              className="h-9 cursor-pointer rounded-md border border-white/10 bg-[#0D1117] px-2 text-xs outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Time</span>
            <input
              type="time"
              value={draft.time}
              onChange={(event) => onChange({ ...draft, time: event.target.value })}
              className="h-9 cursor-pointer rounded-md border border-white/10 bg-[#0D1117] px-2 text-xs outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>
        </div>

        <label className="mb-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Duration (hours)</span>
          <select
            value={draft.duration}
            onChange={(event) => onChange({ ...draft, duration: Number(event.target.value) })}
            className="h-9 cursor-pointer rounded-md border border-white/10 bg-[#0D1117] px-2 text-xs outline-none focus:border-[#3B82F6]"
            style={{ color: "#E6EDF3" }}
          >
            {[0.5, 1, 1.5, 2, 3, 4].map((value) => (
              <option key={value} value={value}>{value}h</option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="flex-1 cursor-pointer rounded-lg py-2 text-xs font-medium text-white"
            style={{ background: projectColor }}
          >
            Save
          </button>
          {draft.taskId && (
            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer rounded-lg px-3 py-2"
              style={{ color: "#EF4444", background: "rgba(239,68,68,0.1)" }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function toDraftFromSlot(weekStart, dayIndex, hour) {
  const date = buildDateTime(weekStart, dayIndex, hour);
  return {
    taskId: null,
    title: "",
    date: date.toISOString().slice(0, 10),
    time: `${String(hour).padStart(2, "0")}:00`,
    duration: 1,
    dayIndex,
    hour
  };
}

function toDraftFromEvent(event) {
  const due = new Date(event.due);
  return {
    taskId: event.taskId,
    title: event.title,
    date: due.toISOString().slice(0, 10),
    time: `${String(due.getHours()).padStart(2, "0")}:${String(due.getMinutes()).padStart(2, "0")}`,
    duration: event.duration,
    dayIndex: event.dayIndex,
    hour: event.hour
  };
}

function draftToDueDate(draft) {
  const [year, month, day] = draft.date.split("-").map(Number);
  const [hours, minutes] = draft.time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

export function CalendarView({ project, tasks, createTask, updateTask, deleteTask, connectCalendar }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [draft, setDraft] = useState(null);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const events = useMemo(() => tasksToWeekEvents(tasks, weekStart, project.color), [tasks, weekStart, project.color]);

  const openSlot = (dayIndex, hour) => setDraft(toDraftFromSlot(weekStart, dayIndex, hour));
  const openEvent = (event) => setDraft(toDraftFromEvent(event));

  const saveDraft = async () => {
    if (!draft?.title?.trim()) return;
    const payload = { dueDate: draftToDueDate(draft), title: draft.title.trim() };
    if (draft.taskId) {
      await updateTask(draft.taskId, payload);
    } else {
      await createTask({
        ...payload,
        title: draft.title.trim(),
        priority: "medium",
        status: "todo",
        projectId: project.id
      });
    }
    setDraft(null);
  };

  const removeDraft = async () => {
    if (!draft?.taskId) return;
    if (!window.confirm("Delete this calendar event? The task will be removed from the board.")) return;
    await deleteTask(draft.taskId);
    setDraft(null);
  };

  const eventTop = (hour, minute = 0) => 40 + (hour - CALENDAR_START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>{formatWeekRange(weekStart)}</h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setWeekStart((current) => addDays(current, -7))}
              className="cursor-pointer rounded px-2 py-1 text-xs transition-all hover:text-[#E6EDF3]"
              style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="cursor-pointer rounded px-2 py-1 text-xs transition-all hover:text-[#E6EDF3]"
              style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setWeekStart((current) => addDays(current, 7))}
              className="cursor-pointer rounded px-2 py-1 text-xs transition-all hover:text-[#E6EDF3]"
              style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}
            >
              &gt;
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSlot(0, 9)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white"
            style={{ background: project.color }}
          >
            <Plus size={11} /> New event
          </button>
          <button
            type="button"
            onClick={connectCalendar}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
            style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <Wifi size={11} /> Sync Google Calendar
          </button>
        </div>
      </div>

      {events.length === 0 && (
        <p className="mb-3 text-xs" style={{ color: "#6E7681" }}>
          Tasks with due dates appear here. Click any time slot or use New event to schedule work.
        </p>
      )}

      <div className="flex flex-1 overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex shrink-0 flex-col"
          style={{ width: 52, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="h-10 shrink-0" />
          {CALENDAR_HOURS.map((hour) => (
            <div
              key={hour}
              className="flex shrink-0 items-center justify-end pr-2"
              style={{ height: HOUR_HEIGHT, borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{hour}:00</span>
            </div>
          ))}
        </div>

        <div className="relative flex flex-1 overflow-auto">
          {weekDays.map(({ label, date, index, isToday }) => (
            <div
              key={label}
              className="relative flex min-w-0 flex-1 flex-col"
              style={{ borderLeft: index > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <div
                className="flex h-10 shrink-0 flex-col items-center justify-center"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-[10px] uppercase" style={{ color: "#6E7681" }}>{label}</span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: isToday ? project.color : "#E6EDF3" }}
                >
                  {date.getDate()}
                </span>
              </div>

              <div className="relative flex-1">
                {CALENDAR_HOURS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => openSlot(index, hour)}
                    className="w-full cursor-pointer border-0 transition-colors hover:bg-white/[0.03]"
                    style={{ height: HOUR_HEIGHT, borderTop: "1px solid rgba(255,255,255,0.04)", background: "transparent" }}
                    aria-label={`Add event ${label} ${hour}:00`}
                  />
                ))}

                {events.filter((event) => event.dayIndex === index).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => openEvent(event)}
                    className="absolute left-0.5 right-0.5 cursor-pointer overflow-hidden rounded px-1.5 py-1.5 text-left transition-opacity hover:opacity-90"
                    style={{
                      top: eventTop(event.hour, event.minute),
                      height: event.duration * HOUR_HEIGHT - 3,
                      background: `${event.color}20`,
                      borderLeft: `2px solid ${event.color}`,
                      color: event.color
                    }}
                  >
                    <p className="truncate text-[10px] font-semibold leading-tight">{event.title}</p>
                    <p className="mt-0.5 text-[9px] opacity-70" style={{ fontFamily: "monospace" }}>
                      {String(event.hour).padStart(2, "0")}:{String(event.minute).padStart(2, "0")}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EventModal
        draft={draft}
        onChange={setDraft}
        onSave={saveDraft}
        onDelete={removeDraft}
        onClose={() => setDraft(null)}
        projectColor={project.color}
      />
    </div>
  );
}
