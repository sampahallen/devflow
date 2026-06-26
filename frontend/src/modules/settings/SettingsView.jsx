import { useEffect, useState } from "react";
import { env } from "../../config/env.js";

export function SettingsView({ project, updateProject, deleteProject }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
  }, [project.id, project.name, project.description]);

  const saveDetails = async () => {
    setSaving(true);
    try {
      await updateProject(project.id, {
        name: name.trim() || project.name,
        description: description.trim()
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this project and all its data?")) return;
    await deleteProject(project.id);
  };

  return (
    <div className="flex max-w-xl flex-col gap-4 overflow-y-auto">
      <div className="rounded-lg p-5" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="mb-4 text-sm font-semibold" style={{ color: "#E6EDF3" }}>Project Details</h3>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs" style={{ color: "#6E7681" }}>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-9 rounded-md border border-white/10 bg-[#0D1117] px-3 text-xs outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs" style={{ color: "#6E7681" }}>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="rounded-md border border-white/10 bg-[#0D1117] px-3 py-2 text-xs outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3" }}
            />
          </label>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs" style={{ color: "#6E7681" }}>Tag</span>
            <span className="text-xs font-medium" style={{ color: "#E6EDF3" }}>{project.tag}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs" style={{ color: "#6E7681" }}>Color</span>
            <div className="flex gap-2">
              {["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                <button
                  key={color}
                  onClick={() => updateProject(project.id, { color })}
                  className="h-5 w-5 cursor-pointer rounded-full transition-all"
                  style={{
                    background: color,
                    outline: color === project.color ? `2px solid ${color}` : "none",
                    outlineOffset: 2
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={saveDetails}
            disabled={saving}
            className="mt-1 rounded-lg py-2 text-xs font-medium text-white disabled:opacity-50"
            style={{ background: project.color }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div className="rounded-lg p-5" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="mb-4 text-sm font-semibold" style={{ color: "#E6EDF3" }}>Integrations</h3>
        {[
          { name: "GitHub", status: "Connected", color: "#10B981" },
          { name: "Google Calendar", status: "Connected", color: "#10B981" },
          { name: "Backend API", status: env.apiUrl ? "Connected" : "Pending", color: "#3B82F6" }
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs" style={{ color: "#8B949E" }}>{item.name}</span>
            <span
              className="rounded px-2 py-0.5 text-xs font-medium"
              style={{ color: item.color, background: `${item.color}15` }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleDelete}
        className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all"
        style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}
      >
        Delete Project
      </button>
    </div>
  );
}
