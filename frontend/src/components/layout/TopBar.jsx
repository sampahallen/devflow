import { Bell, Layers, Plus, Search } from "lucide-react";
import { useUiStore } from "../../app/store/uiStore.js";
import { Avatar } from "../ui/Avatar.jsx";
import { ProjectSelector } from "./ProjectSelector.jsx";

export function TopBar({ project, projects, hasProject = true, onProjectChange, onCreateProject, onNewTask }) {
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  return (
    <div
      className="flex shrink-0 items-center gap-4 px-4 py-2.5"
      style={{ background: "#0D1117", borderBottom: "1px solid rgba(255,255,255,0.08)", height: 52 }}
    >
      <div className="mr-2 flex items-center gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <Layers size={13} color="#fff" />
        </div>
        <span className="text-sm font-bold" style={{ color: "#E6EDF3" }}>DevFlow</span>
      </div>

      <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

      <ProjectSelector
        project={project}
        projects={projects}
        onChange={onProjectChange}
        onCreate={onCreateProject}
      />

      <div className="flex-1" />

      <button
        onClick={() => setCommandOpen(true)}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-left"
        style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)", width: 220 }}
      >
        <Search size={12} style={{ color: "#6E7681", flexShrink: 0 }} />
        <span className="flex-1 text-xs" style={{ color: "#6E7681" }}>Search in project...</span>
        <kbd
          className="rounded px-1.5 py-0.5 text-[10px]"
          style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)", fontFamily: "monospace" }}
        >
          Ctrl K
        </kbd>
      </button>

      <button
        onClick={onNewTask}
        disabled={!hasProject}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: project.color, color: "#fff" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        <Plus size={12} /> New Task
      </button>

      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150"
        style={{ background: "rgba(255,255,255,0.04)", color: "#6E7681" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#E6EDF3"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#6E7681"; }}
      >
        <Bell size={14} />
      </button>

      <Avatar initials="AK" size={28} />
    </div>
  );
}
