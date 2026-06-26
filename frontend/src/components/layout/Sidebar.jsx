import { navItems } from "../../constants/app.js";

export function Sidebar({ view, project, onNav }) {
  const progress = Math.round((project.completedTasks / Math.max(project.taskCount, 1)) * 100);

  return (
    <div
      className="flex h-full flex-col py-3"
      style={{ background: "#0D1117", borderRight: "1px solid rgba(255,255,255,0.08)", width: 200 }}
    >
      <div className="mb-2 px-3">
        <div
          className="mb-3 flex items-center gap-1.5 rounded-md px-2 py-1"
          style={{ background: `${project.color}12` }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: project.color }} />
          <span
            className="truncate text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: project.color }}
          >
            {project.name}
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {navItems.map(({ id, Icon, label }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-all duration-100"
              style={{
                color: active ? "#E6EDF3" : "#6E7681",
                background: active ? "rgba(255,255,255,0.07)" : "transparent"
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#C9D1D9";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6E7681";
                }
              }}
            >
              <Icon size={14} style={{ color: active ? project.color : "#6E7681", flexShrink: 0 }} />
              {label}
              {active && <div className="ml-auto h-1 w-1 rounded-full" style={{ background: project.color }} />}
            </button>
          );
        })}
      </nav>

      <div className="mt-3 px-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
            Progress
          </span>
          <span className="ml-auto text-[10px]" style={{ color: "#6E7681" }}>
            {project.completedTasks}/{project.taskCount}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{ background: project.color, width: `${progress}%`, transition: "width 0.4s ease" }}
          />
        </div>
        <p className="mt-1.5 text-[10px]" style={{ color: "#6E7681" }}>{progress}% complete</p>
      </div>
    </div>
  );
}
