import { FolderKanban, Plus } from "lucide-react";

export function EmptyProjectState({ onCreateProject, error, onRetry }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <FolderKanban size={28} style={{ color: "#3B82F6" }} />
      </div>
      <div className="max-w-md">
        <h2 className="mb-2 text-lg font-bold" style={{ color: "#E6EDF3" }}>Welcome to DevFlow</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#8B949E" }}>
          Create your first project to manage tasks, notes, prompts, and resources in one place.
        </p>
        {error && (
          <p className="mt-3 text-xs" style={{ color: "#EF4444" }}>
            {error}
            {onRetry && (
              <button onClick={onRetry} className="ml-2 underline" style={{ color: "#3B82F6" }}>
                Retry
              </button>
            )}
          </p>
        )}
      </div>
      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "#3B82F6" }}
      >
        <Plus size={16} /> Create your first project
      </button>
    </div>
  );
}
