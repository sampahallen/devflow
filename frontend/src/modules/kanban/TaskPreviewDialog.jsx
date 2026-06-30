import { Calendar, Edit3, FileCode, Github, Timer, Trash2, User, X } from "lucide-react";
import { columns, priorityConfig } from "../../constants/app.js";
import { displayDate } from "../../lib/mappers.js";

export function TaskPreviewDialog({ open, task, onClose, onEdit, onDelete }) {
  if (!open || !task) return null;

  const column = columns.find((item) => item.id === task.status) || columns[0];
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[520px] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="mt-1.5 h-2 w-2 rounded-full" style={{ background: column.color }} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug" style={{ color: "#E6EDF3" }}>{task.title}</p>
            <p className="mt-1 text-[11px]" style={{ color: "#6E7681" }}>{column.label}</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.035)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Priority
              </p>
              <p className="mt-1 text-xs font-semibold" style={{ color: priority.color }}>{priority.label}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.035)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Due date
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: "#C9D1D9" }}>
                <Calendar size={12} /> {displayDate(task.dueDate)}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.035)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Assignee
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: "#C9D1D9" }}>
                <User size={12} /> {task.assignee || "Unassigned"}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.035)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
                Pomodoros
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: "#C9D1D9" }}>
                <Timer size={12} /> {task.completedPomodoros || 0}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
              Notes
            </p>
            <p
              className="min-h-[74px] whitespace-pre-wrap rounded-lg p-3 text-sm leading-relaxed"
              style={{ color: task.description ? "#C9D1D9" : "#6E7681", background: "#0D1117", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {task.description || "No notes yet."}
            </p>
          </div>

          {(task.githubUrl || task.markdownFiles?.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {task.githubUrl && (
                <a
                  href={task.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs"
                  style={{ color: "#C9D1D9", background: "rgba(255,255,255,0.05)" }}
                >
                  <Github size={12} /> GitHub
                </a>
              )}
              {(task.markdownFiles || []).map((file) => (
                <span
                  key={file}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs"
                  style={{ color: "#C9D1D9", background: "rgba(255,255,255,0.05)" }}
                >
                  <FileCode size={12} /> {file}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ color: "#E6EDF3", background: "rgba(255,255,255,0.06)" }}
          >
            <Edit3 size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ color: "#EF4444", background: "rgba(239,68,68,0.1)" }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

