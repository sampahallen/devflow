import { Activity, Check, Copy, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { categoryColors, promptCategories } from "../../constants/app.js";

export function PromptsView({ project, prompts, createPrompt, updatePrompt, deletePrompt }) {
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", content: "" });
  const cats = ["All", ...Array.from(new Set([...promptCategories, ...prompts.map((p) => p.category)]))];
  const filtered = filter === "All" ? prompts : prompts.filter((prompt) => prompt.category === filter);

  const handleCopy = async (prompt) => {
    await navigator.clipboard?.writeText(prompt.content);
    await updatePrompt(prompt._id, { usageCount: (prompt.usageCount || 0) + 1 });
    setCopied(prompt._id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleNewPrompt = () => {
    createPrompt({
      title: "New prompt",
      category: "Coding",
      content: "Describe what you want the AI to do...",
      projectId: project.id
    });
  };

  const startEdit = (prompt) => {
    setEditingId(prompt._id);
    setDraft({ title: prompt.title, content: prompt.content });
  };

  const saveEdit = async (prompt) => {
    await updatePrompt(prompt._id, { title: draft.title, content: draft.content });
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
        <span className="ml-2 text-xs" style={{ color: "#6E7681" }}>{filtered.length} prompts</span>
        <button
          onClick={handleNewPrompt}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{ background: project.color, color: "#fff" }}
        >
          <Plus size={12} /> New Prompt
        </button>
      </div>

      <div
        className="grid gap-3 overflow-y-auto pr-1"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", alignContent: "start" }}
      >
        {filtered.map((prompt) => {
          const catColor = categoryColors[prompt.category] || "#6E7681";
          const isCopied = copied === prompt._id;
          const isEditing = editingId === prompt._id;
          return (
            <div
              key={prompt._id}
              className="flex flex-col gap-3 rounded-lg p-4 transition-all duration-150"
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ color: catColor, background: `${catColor}18` }}
                    >
                      {prompt.category}
                    </span>
                    <button onClick={() => updatePrompt(prompt._id, { favorite: !prompt.favorite })}>
                      {prompt.favorite && <Star size={10} style={{ color: "#F59E0B" }} fill="#F59E0B" />}
                    </button>
                  </div>
                  {isEditing ? (
                    <input
                      value={draft.title}
                      onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                      className="mb-1 w-full rounded border border-white/10 bg-[#0D1117] px-2 py-1 text-xs outline-none focus:border-[#3B82F6]"
                      style={{ color: "#E6EDF3" }}
                    />
                  ) : (
                    <h3
                      className="cursor-text text-xs font-semibold"
                      style={{ color: "#E6EDF3" }}
                      onDoubleClick={() => startEdit(prompt)}
                    >
                      {prompt.title}
                    </h3>
                  )}
                </div>
                <span className="flex shrink-0 items-center gap-0.5 text-[10px]" style={{ color: "#6E7681" }}>
                  <Activity size={9} /> {prompt.usageCount || 0}×
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={draft.content}
                  onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
                  className="min-h-24 w-full rounded-md border border-white/10 bg-[#0D1117] p-2.5 text-[10px] leading-relaxed outline-none focus:border-[#3B82F6]"
                  style={{ color: "#8B949E", fontFamily: "monospace" }}
                />
              ) : (
                <pre
                  className="line-clamp-3 overflow-hidden whitespace-pre-wrap rounded-md p-2.5 text-[10px] leading-relaxed"
                  style={{
                    background: "#0D1117",
                    color: "#8B949E",
                    fontFamily: "monospace",
                    border: "1px solid rgba(255,255,255,0.06)",
                    maxHeight: 72
                  }}
                  onDoubleClick={() => startEdit(prompt)}
                >
                  {prompt.content}
                </pre>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(prompt)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium"
                      style={{ background: project.color, color: "#fff" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md px-3 py-1.5 text-[11px]"
                      style={{ color: "#6E7681", background: "rgba(255,255,255,0.04)" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleCopy(prompt)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium transition-all"
                    style={{
                      color: isCopied ? "#10B981" : "#6E7681",
                      background: isCopied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    {isCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                  </button>
                )}
                <button
                  onClick={() => deletePrompt(prompt._id)}
                  className="rounded-md px-2"
                  style={{ color: "#EF4444", background: "rgba(239,68,68,0.1)" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs" style={{ color: "#6E7681" }}>No prompts yet. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}
