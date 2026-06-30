import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { usePomodoroStore } from "../../app/store/pomodoroStore.js";

const durations = [
  { label: "25", minutes: 25 },
  { label: "15", minutes: 15 },
  { label: "5", minutes: 5 }
];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function sessionCountForTask(sessions, taskId) {
  if (!taskId) return sessions.reduce((sum, item) => sum + (item.completedSessions || 0), 0);
  return sessions
    .filter((item) => item.taskId === taskId)
    .reduce((sum, item) => sum + (item.completedSessions || 0), 0);
}

export function PomodoroView({ project, tasks }) {
  const {
    running,
    secondsLeft,
    durationSeconds,
    selectedTaskId,
    sessions,
    start,
    pause,
    reset,
    setDuration,
    setSelectedTask
  } = usePomodoroStore();
  const progress = 1 - secondsLeft / Math.max(durationSeconds, 1);
  const selectedTask = tasks.find((task) => task._id === selectedTaskId);
  const totalSessions = sessionCountForTask(sessions);

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto pr-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Timer size={16} style={{ color: project.color }} />
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: project.color }}>
              Pomodoro
            </span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#E6EDF3" }}>Focus timer</h1>
          <p className="mt-1 text-sm" style={{ color: "#8B949E" }}>
            Run focused work sessions against this project.
          </p>
        </div>

        <div
          className="rounded-lg px-4 py-3 text-right"
          style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
            Completed
          </p>
          <p className="mt-1 text-lg font-bold" style={{ color: "#E6EDF3" }}>{totalSessions}</p>
        </div>
      </div>

      <div className="grid min-h-[420px] gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
        <section
          className="flex min-h-0 flex-col items-center justify-center rounded-lg p-6"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="relative grid aspect-square w-full max-w-[340px] place-items-center rounded-full"
            style={{
              background: `conic-gradient(${project.color} ${progress * 360}deg, rgba(255,255,255,0.07) 0deg)`
            }}
          >
            <div
              className="absolute inset-3 rounded-full"
              style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <div className="relative text-center">
              <div className="text-6xl font-bold tabular-nums" style={{ color: "#E6EDF3" }}>
                {formatTime(secondsLeft)}
              </div>
              <p className="mt-3 text-xs" style={{ color: "#8B949E" }}>
                {selectedTask ? selectedTask.title : "Project focus session"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <button
              onClick={running ? pause : start}
              className="flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-150"
              style={{ background: project.color, color: "#fff" }}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={reset}
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.06)", color: "#C9D1D9" }}
              title="Reset timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4">
          <div
            className="rounded-lg p-4"
            style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="mb-3 text-xs font-semibold" style={{ color: "#E6EDF3" }}>Session length</p>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((duration) => {
                const active = duration.minutes * 60 === durationSeconds;
                return (
                  <button
                    key={duration.minutes}
                    onClick={() => setDuration(duration.minutes)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150"
                    style={{
                      background: active ? `${project.color}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? project.color : "rgba(255,255,255,0.08)"}`,
                      color: active ? project.color : "#8B949E"
                    }}
                  >
                    {duration.label}m
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col rounded-lg"
            style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="shrink-0 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Attach to task</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <button
                onClick={() => setSelectedTask("")}
                className="mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs"
                style={{
                  background: selectedTaskId ? "transparent" : "rgba(255,255,255,0.07)",
                  color: selectedTaskId ? "#8B949E" : "#E6EDF3"
                }}
              >
                Project focus
                <span style={{ color: "#6E7681" }}>{sessionCountForTask(sessions, "")}</span>
              </button>
              {tasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => setSelectedTask(task._id)}
                  className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-all duration-100"
                  style={{
                    background: selectedTaskId === task._id ? "rgba(255,255,255,0.07)" : "transparent",
                    color: selectedTaskId === task._id ? "#E6EDF3" : "#8B949E"
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">{task.title}</span>
                  <span style={{ color: "#6E7681" }}>{sessionCountForTask(sessions, task._id)}</span>
                </button>
              ))}
              {tasks.length === 0 && (
                <p className="px-3 py-4 text-xs" style={{ color: "#6E7681" }}>No tasks yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

