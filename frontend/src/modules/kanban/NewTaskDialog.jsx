import { Calendar, Check, Flag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { columns, priorityConfig } from "../../constants/app.js";
import { localDateTimeToIso, toInputDate, toInputTime } from "../../lib/mappers.js";

const initialForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
  dueTime: "09:00",
  assignee: ""
};

export function NewTaskDialog({ open, project, defaultStatus = "todo", task = null, tasks = [], onClose, onCreate, onUpdate }) {
  const [form, setForm] = useState({ ...initialForm, status: defaultStatus });
  const [saving, setSaving] = useState(false);
  const editing = Boolean(task);

  useEffect(() => {
    if (!open) return;
    setForm(task ? {
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || defaultStatus,
      dueDate: toInputDate(task.dueDate),
      dueTime: toInputTime(task.dueDate),
      assignee: task.assignee || ""
    } : { ...initialForm, status: defaultStatus });
  }, [defaultStatus, open, task]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, open]);

  if (!open) return null;

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const column = columns.find((item) => item.id === form.status) || columns[0];
  const priority = priorityConfig[form.priority] || priorityConfig.medium;

  const submit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title || saving) return;

    const sameColumnTasks = tasks.filter((item) => item.status === form.status);
    const maxPosition = sameColumnTasks.reduce((max, item) => Math.max(max, item.position || 0), 0);
    setSaving(true);
    try {
      const payload = {
        title,
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate ? localDateTimeToIso(form.dueDate, form.dueTime) : (editing ? null : undefined),
        assignee: form.assignee.trim(),
        projectId: project.id
      };
      if (editing) {
        await onUpdate(task._id, payload);
      } else {
        await onCreate({
          ...payload,
          position: maxPosition + 1024
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-[460px] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="h-2 w-2 rounded-full" style={{ background: column.color }} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>{editing ? "Edit task" : "New task"}</p>
            <p className="text-[11px]" style={{ color: "#6E7681" }}>{project.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ color: "#8B949E", background: "rgba(255,255,255,0.04)" }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
              Title
            </span>
            <input
              autoFocus
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Build the onboarding flow"
              className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm outline-none transition-colors focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
              Notes
            </span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={3}
              placeholder="Add context, acceptance criteria, or a quick reminder."
              className="resize-none rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-sm outline-none transition-colors focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Status
              </span>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-xs outline-none"
                style={{ color: "#E6EDF3" }}
              >
                {columns.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Priority
              </span>
              <div className="relative">
                <Flag size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: priority.color }} />
                <select
                  value={form.priority}
                  onChange={(event) => updateField("priority", event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0D1117] py-2 pl-8 pr-3 text-xs outline-none"
                  style={{ color: "#E6EDF3" }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Due date
              </span>
              <div className="relative">
                <Calendar size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6E7681" }} />
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => updateField("dueDate", event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0D1117] py-2 pl-8 pr-3 text-xs outline-none"
                  style={{ color: "#E6EDF3" }}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Deadline time
              </span>
              <input
                type="time"
                value={form.dueTime}
                onChange={(event) => updateField("dueTime", event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0D1117] px-3 py-2 text-xs outline-none"
                style={{ color: "#E6EDF3" }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Assignee
              </span>
              <div className="relative">
                <User size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6E7681" }} />
                <input
                  value={form.assignee}
                  onChange={(event) => updateField("assignee", event.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-white/10 bg-[#0D1117] py-2 pl-8 pr-3 text-xs outline-none"
                  style={{ color: "#E6EDF3" }}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{ color: "#8B949E", background: "rgba(255,255,255,0.04)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title.trim() || saving}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            style={{ background: project.color, color: "#fff" }}
          >
            <Check size={13} />
            {saving ? (editing ? "Saving..." : "Creating...") : (editing ? "Save changes" : "Create task")}
          </button>
        </div>
      </form>
    </div>
  );
}
