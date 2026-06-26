import { ChevronDown, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { asTemplateProject } from "../../lib/mappers.js";

export function ProjectSelector({ project, projects, onChange, onCreate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasProjects = projects.length > 0;

  useEffect(() => {
    const handler = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-150"
        style={{ background: open ? "#21262D" : "transparent", border: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#21262D"; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: project.color }} />
        <span className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>
          {hasProjects ? project.name : "Select project"}
        </span>
        {hasProjects && (
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
            style={{ background: `${project.color}20`, color: project.color }}
          >
            {project.tag}
          </span>
        )}
        <ChevronDown
          size={12}
          style={{ color: "#6E7681", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1 overflow-hidden rounded-xl"
            style={{
              background: "#161B22",
              border: "1px solid rgba(255,255,255,0.12)",
              minWidth: 280,
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)"
            }}
          >
            <div className="p-1.5">
              {projects.length === 0 && (
                <p className="px-3 py-4 text-center text-xs" style={{ color: "#6E7681" }}>
                  No projects yet
                </p>
              )}
              {projects.map((item) => {
                const mapped = asTemplateProject(item);
                return (
                  <button
                    key={item._id}
                    onClick={() => { onChange(item._id); setOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-100"
                    style={{ background: item._id === project.id ? "rgba(255,255,255,0.06)" : "transparent" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={(e) => {
                      if (item._id !== project.id) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div className="h-3 w-3 shrink-0 rounded-sm" style={{ background: item.color || "#3B82F6" }} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{item.name}</span>
                      <span className="truncate text-[10px]" style={{ color: "#6E7681" }}>
                        {item.description || "No description"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span
                        className="text-[10px]"
                        style={{ color: mapped.color, background: `${mapped.color}18`, padding: "1px 6px", borderRadius: 4 }}
                      >
                        {mapped.tag}
                      </span>
                      <span className="text-[10px]" style={{ color: "#6E7681" }}>{mapped.lastActive}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-1.5 pb-1.5">
              <button
                onClick={() => { onCreate(); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-100"
                style={{ color: "#3B82F6", border: "1px dashed rgba(59,130,246,0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <Plus size={12} /> Create New Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
