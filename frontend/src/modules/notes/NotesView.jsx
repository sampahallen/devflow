import { Edit3, Eye, FileText, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MarkdownPreview } from "./MarkdownPreview.jsx";

function slugifyTitle(title) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "note"}.md`;
}

function NoteExplorerItem({ note, isSelected, onSelect, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(note.title);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setName(note.title);
  }, [note.title]);

  const commitRename = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === note.title) {
      setName(note.title);
      setEditing(false);
      return;
    }
    await onRename(note._id, trimmed);
    setEditing(false);
  };

  return (
    <div
      className="group flex items-center gap-0.5 pr-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitRename();
            if (event.key === "Escape") { setName(note.title); setEditing(false); }
          }}
          className="mx-2 h-6 flex-1 rounded border border-white/10 bg-[#0D1117] px-1.5 text-[10px] outline-none focus:border-[#3B82F6]"
          style={{ color: "#E6EDF3" }}
        />
      ) : (
        <button
          type="button"
          onClick={() => onSelect(note._id)}
          onDoubleClick={() => setEditing(true)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-md py-1 text-left text-[11px] transition-all"
          style={{
            paddingLeft: 8,
            paddingRight: 4,
            color: isSelected ? "#E6EDF3" : "#6E7681",
            background: isSelected ? "rgba(59,130,246,0.1)" : hovered ? "rgba(255,255,255,0.04)" : "transparent"
          }}
        >
          <FileText size={10} style={{ flexShrink: 0, color: isSelected ? "#3B82F6" : "#6E7681" }} />
          <span className="flex-1 truncate">{note.title}</span>
        </button>
      )}
      {!editing && (hovered || isSelected) && (
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onDelete(note._id); }}
          className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded opacity-70 transition-opacity hover:opacity-100"
          style={{ color: "#EF4444" }}
          title="Delete note"
        >
          <Trash2 size={10} />
        </button>
      )}
    </div>
  );
}

export function NotesView({ project, notes, activeNote, readNote, createNote, saveNote, updateNote, deleteNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState("split");

  useEffect(() => {
    setContent(activeNote?.content || "");
  }, [activeNote]);

  const addNote = async (nameOverride) => {
    const trimmed = (nameOverride ?? title).trim() || `Untitled ${notes.length + 1}`;
    const path = slugifyTitle(trimmed);
    const note = await createNote({ title: trimmed, path, content: `# ${trimmed}\n`, projectId: project.id });
    setTitle("");
    readNote(note._id);
  };

  const renameNote = async (id, newTitle) => {
    const path = slugifyTitle(newTitle);
    await updateNote(id, { title: newTitle, path });
    if (activeNote?._id === id) readNote(id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(id);
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div
        className="flex shrink-0 flex-col overflow-y-auto py-2"
        style={{ width: 220, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mb-2 flex items-center justify-between px-3">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#6E7681" }}>Files</span>
          <button
            type="button"
            onClick={() => addNote()}
            className="cursor-pointer transition-colors hover:text-[#E6EDF3]"
            style={{ color: "#6E7681" }}
            title="New note"
          >
            <Plus size={11} />
          </button>
        </div>
        <div className="mb-2 px-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addNote()}
            placeholder="New note..."
            className="h-7 w-full cursor-text rounded-md border border-white/10 bg-[#0D1117] px-2 text-[10px] text-[#E6EDF3] outline-none placeholder:text-[#6E7681] focus:border-[#3B82F6]"
          />
        </div>
        {notes.length === 0 && (
          <p className="px-3 py-2 text-[10px]" style={{ color: "#6E7681" }}>
            No notes yet. Click + or type a name above.
          </p>
        )}
        {notes.map((note) => (
          <NoteExplorerItem
            key={note._id}
            note={note}
            isSelected={activeNote?._id === note._id}
            onSelect={readNote}
            onRename={renameNote}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex shrink-0 items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0D1117" }}
        >
          <span className="text-[11px] font-medium" style={{ color: "#E6EDF3", fontFamily: "monospace" }}>
            {activeNote?.path || activeNote?.title || "Select or create a note"}
          </span>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 rounded-md p-0.5"
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {([
                ["edit", Edit3, "Edit"],
                ["split", LayoutGrid, "Split"],
                ["preview", Eye, "Preview"]
              ]).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className="flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-all"
                  style={mode === id ? { background: "#21262D", color: "#E6EDF3" } : { color: "#6E7681" }}
                >
                  <Icon size={9} /> {label}
                </button>
              ))}
            </div>
            {activeNote && (
              <button
                type="button"
                onClick={() => handleDelete(activeNote._id)}
                className="cursor-pointer rounded-md px-2 py-1 text-[10px]"
                style={{ color: "#EF4444", background: "rgba(239,68,68,0.1)" }}
              >
                Delete
              </button>
            )}
            {activeNote && (
              <button
                type="button"
                onClick={() => saveNote(content)}
                className="cursor-pointer rounded-lg px-3 py-1 text-[10px] font-medium text-white"
                style={{ background: project.color }}
              >
                Save
              </button>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {(mode === "edit" || mode === "split") && (
            <div
              className={`overflow-y-auto p-4 ${mode === "split" ? "w-1/2" : "w-full"}`}
              style={{
                borderRight: mode === "split" ? "1px solid rgba(255,255,255,0.08)" : "none",
                background: "#0D1117"
              }}
            >
              {activeNote ? (
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="h-full min-h-[300px] w-full cursor-text resize-none bg-transparent text-[10px] leading-relaxed outline-none"
                  style={{ color: "#8B949E", fontFamily: "monospace" }}
                  placeholder="Write markdown..."
                />
              ) : (
                <p className="text-xs" style={{ color: "#6E7681" }}>Select a note from the explorer.</p>
              )}
            </div>
          )}
          {(mode === "preview" || mode === "split") && (
            <div className="flex-1 overflow-y-auto p-4" style={{ background: "#0D1117" }}>
              {content ? <MarkdownPreview content={content} /> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
