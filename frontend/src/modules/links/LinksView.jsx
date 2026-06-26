import { ExternalLink, Globe, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { categoryColors, resourceCategories } from "../../constants/app.js";

export function LinksView({ project, resources, createResource, updateResource, deleteResource }) {
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", url: "", category: "Documentation", notes: "" });
  const cats = ["All", ...Array.from(new Set([...resourceCategories, ...resources.map((r) => r.category)]))];
  const filtered = filter === "All" ? resources : resources.filter((resource) => resource.category === filter);

  const handleAddLink = () => {
    createResource({
      title: "New resource",
      url: "https://example.com",
      category: "Documentation",
      notes: "",
      projectId: project.id
    });
  };

  const startEdit = (link) => {
    setEditingId(link._id);
    setDraft({
      title: link.title,
      url: link.url,
      category: link.category || "Documentation",
      notes: link.notes || ""
    });
  };

  const saveEdit = async (id) => {
    await updateResource(id, draft);
    setEditingId(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-all"
              style={filter === cat ? { background: project.color, color: "#fff" } : { color: "#6E7681" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddLink}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{ background: project.color, color: "#fff" }}
        >
          <Plus size={12} /> Add Link
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {filtered.map((link) => {
          const catColor = categoryColors[link.category] || "#6E7681";
          const isEditing = editingId === link._id;

          if (isEditing) {
            return (
              <div
                key={link._id}
                className="flex flex-col gap-2 rounded-lg px-4 py-3"
                style={{ background: "#161B22", border: "1px solid rgba(59,130,246,0.3)" }}
              >
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Title"
                  className="h-8 rounded-md border border-white/10 bg-[#0D1117] px-2.5 text-xs outline-none focus:border-[#3B82F6]"
                  style={{ color: "#E6EDF3" }}
                />
                <input
                  value={draft.url}
                  onChange={(event) => setDraft((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://..."
                  className="h-8 rounded-md border border-white/10 bg-[#0D1117] px-2.5 text-xs outline-none focus:border-[#3B82F6]"
                  style={{ color: "#E6EDF3", fontFamily: "monospace" }}
                />
                <select
                  value={draft.category}
                  onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
                  className="h-8 rounded-md border border-white/10 bg-[#0D1117] px-2.5 text-xs outline-none focus:border-[#3B82F6]"
                  style={{ color: "#E6EDF3" }}
                >
                  {resourceCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                  value={draft.notes}
                  onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Notes"
                  className="h-8 rounded-md border border-white/10 bg-[#0D1117] px-2.5 text-xs outline-none focus:border-[#3B82F6]"
                  style={{ color: "#E6EDF3" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(link._id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                    style={{ background: project.color }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg px-3 py-1.5 text-xs"
                    style={{ color: "#6E7681" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={link._id}
              className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 transition-all duration-150"
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              onDoubleClick={() => startEdit(link)}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${catColor}18` }}
              >
                <Globe size={14} style={{ color: catColor }} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{link.title}</span>
                <span className="mt-0.5 truncate text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>
                  {link.url}
                </span>
              </div>
              <span
                className="shrink-0 rounded px-2 py-0.5 text-[10px] font-medium"
                style={{ color: catColor, background: `${catColor}18` }}
              >
                {link.category}
              </span>
              <p className="hidden max-w-[240px] shrink-0 truncate text-[11px] lg:block" style={{ color: "#6E7681" }}>
                {link.notes}
              </p>
              <a href={link.url} target="_blank" rel="noreferrer" style={{ color: "#6E7681", flexShrink: 0 }}>
                <ExternalLink size={12} />
              </a>
              <button
                onClick={() => deleteResource(link._id)}
                style={{ color: "#EF4444", flexShrink: 0 }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs" style={{ color: "#6E7681" }}>No links yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
}
