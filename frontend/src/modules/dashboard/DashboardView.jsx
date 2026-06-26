import { Activity, AlertCircle, ArrowUpRight, CheckCircle2, ExternalLink, Flame, Globe } from "lucide-react";
import { categoryColors, columns } from "../../constants/app.js";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { PriorityBadge } from "../../components/ui/PriorityBadge.jsx";
import { Stat } from "../../components/ui/Stat.jsx";
import { displayDate, initials } from "../../lib/mappers.js";

function buildActivities(tasks, project) {
  return tasks.slice(0, 7).map((task, index) => ({
    id: task._id,
    text: task.status === "done" ? `Completed "${task.title}"` : `Updated "${task.title}"`,
    time: `${index + 1}h ago`,
    color: task.status === "done" ? "#10B981" : project.color
  }));
}

export function DashboardView({ project, tasks, resources, data, onNav }) {
  const done = tasks.filter((task) => task.status === "done").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const highPriority = tasks.filter((task) => task.priority === "high" && task.status !== "done").length;
  const activities = buildActivities(tasks, project);

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto pr-1">
      <div
        className="relative overflow-hidden rounded-xl p-5"
        style={{
          background: `linear-gradient(135deg, ${project.color}18 0%, transparent 60%)`,
          border: `1px solid ${project.color}30`
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at top left, ${project.color} 0%, transparent 60%)` }}
        />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: project.color }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: project.color }}
              >
                {project.tag} Project
              </span>
            </div>
            <h1 className="mb-1 text-xl font-bold" style={{ color: "#E6EDF3" }}>{project.name}</h1>
            <p className="text-sm" style={{ color: "#8B949E" }}>{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#10B981" }} />
              Active · {project.lastActive}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Stat label="Tasks Done" value={done} sub={`/ ${tasks.length} total`} color="#10B981" icon={CheckCircle2} />
        <Stat label="In Progress" value={inProgress} color="#3B82F6" icon={Activity} />
        <Stat
          label="Pomodoros"
          value={data?.pomodoroSummary?.sessions || project.pomodoroSessions}
          sub="sessions"
          color="#EF4444"
          icon={Flame}
        />
        <Stat label="High Priority" value={highPriority} sub="open" color="#F59E0B" icon={AlertCircle} />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Active Tasks</span>
              <button
                onClick={() => onNav("kanban")}
                className="flex items-center gap-1 text-[11px] transition-all"
                style={{ color: "#3B82F6" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                View board <ArrowUpRight size={10} />
              </button>
            </div>
            <div>
              {tasks.filter((task) => task.status !== "done").slice(0, 5).map((task) => {
                const column = columns.find((item) => item.id === task.status) || columns[0];
                return (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 px-4 py-2.5 transition-all duration-100"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: column.color }} />
                    <span className="flex-1 truncate text-xs" style={{ color: "#C9D1D9" }}>{task.title}</span>
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>
                      {displayDate(task.dueDate)}
                    </span>
                    <Avatar initials={initials(task.assignee)} size={18} />
                  </div>
                );
              })}
              {tasks.filter((task) => task.status !== "done").length === 0 && (
                <p className="px-4 py-4 text-xs" style={{ color: "#6E7681" }}>No active tasks.</p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Key Resources</span>
              <button onClick={() => onNav("links")} className="flex items-center gap-1 text-[11px]" style={{ color: "#3B82F6" }}>
                View all <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="grid grid-cols-2">
              {resources.slice(0, 4).map((resource) => {
                const color = categoryColors[resource.category] || "#6E7681";
                return (
                  <a
                    key={resource._id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-100"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Globe size={13} style={{ color, flexShrink: 0 }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium" style={{ color: "#C9D1D9" }}>{resource.title}</p>
                      <p className="text-[10px]" style={{ color: "#6E7681" }}>{resource.category}</p>
                    </div>
                    <ExternalLink size={10} style={{ color: "#6E7681", flexShrink: 0 }} />
                  </a>
                );
              })}
              {resources.length === 0 && (
                <p className="col-span-2 px-4 py-4 text-xs" style={{ color: "#6E7681" }}>No resources yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div
              className="shrink-0 px-4 py-3"
              style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Recent Activity</span>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {activities.map((act, index) => (
                <div
                  key={act.id}
                  className="relative flex items-start gap-3 px-4 py-2.5"
                  style={{ borderBottom: index < activities.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: act.color }} />
                  <div className="min-w-0 flex-1 flex-col">
                    <p className="text-[11px] leading-snug" style={{ color: "#8B949E" }}>{act.text}</p>
                    <span className="mt-0.5 text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{act.time}</span>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="px-4 py-4 text-xs" style={{ color: "#6E7681" }}>No recent activity.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Board Snapshot</span>
              <button onClick={() => onNav("kanban")} className="text-[11px]" style={{ color: "#3B82F6" }}>
                Open board
              </button>
            </div>
            <div className="flex gap-2">
              {columns.map((column) => {
                const count = tasks.filter((task) => task.status === column.id).length;
                const pct = tasks.length ? count / tasks.length : 0;
                return (
                  <div key={column.id} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="flex h-16 w-full items-end overflow-hidden rounded"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="w-full rounded-sm transition-all duration-500"
                        style={{ height: `${Math.max(8, pct * 100)}%`, background: `${column.color}60` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: column.color }}>{count}</span>
                    <span className="text-center text-[9px] leading-tight" style={{ color: "#6E7681" }}>{column.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
