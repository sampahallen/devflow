import { Eye, EyeOff, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePomodoroStore } from "../../app/store/pomodoroStore.js";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function PomodoroMiniTimer({ project, tasks, onOpen }) {
  const {
    running,
    secondsLeft,
    durationSeconds,
    selectedTaskId,
    miniOpaque,
    start,
    pause,
    reset,
    tick,
    complete,
    toggleMiniOpaque
  } = usePomodoroStore();
  const completingRef = useRef(false);
  const selectedTask = tasks.find((task) => task._id === selectedTaskId);
  const shouldShow = running || secondsLeft < durationSeconds;
  const progress = 1 - secondsLeft / Math.max(durationSeconds, 1);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [running, tick]);

  useEffect(() => {
    if (!running || secondsLeft > 0 || completingRef.current) return;
    completingRef.current = true;
    complete(project.id, selectedTaskId)
      .catch(() => pause())
      .finally(() => { completingRef.current = false; });
  }, [complete, pause, project.id, running, secondsLeft, selectedTaskId]);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[230px] rounded-lg p-3 shadow-2xl backdrop-blur transition-opacity duration-150"
      style={{
        background: miniOpaque ? "#111827" : "rgba(17,24,39,0.72)",
        border: "1px solid rgba(255,255,255,0.12)",
        opacity: miniOpaque ? 1 : 0.82
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Timer size={14} style={{ color: project.color }} />
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate text-xs font-semibold" style={{ color: "#E6EDF3" }}>
            {selectedTask ? selectedTask.title : "Pomodoro running"}
          </p>
        </button>
        <button
          onClick={toggleMiniOpaque}
          className="grid h-7 w-7 place-items-center rounded-md"
          style={{ background: "rgba(255,255,255,0.06)", color: "#C9D1D9" }}
          title={miniOpaque ? "Make translucent" : "Make opaque"}
        >
          {miniOpaque ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold tabular-nums" style={{ color: "#E6EDF3" }}>
          {formatTime(secondsLeft)}
        </div>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.09)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%`, background: project.color }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={running ? pause : start}
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-semibold"
          style={{ background: project.color, color: "#fff" }}
        >
          {running ? <Pause size={13} /> : <Play size={13} />}
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={reset}
          className="grid h-8 w-8 place-items-center rounded-md"
          style={{ background: "rgba(255,255,255,0.06)", color: "#C9D1D9" }}
          title="Reset timer"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}

