import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProjectStore } from "../../app/store/projectStore.js";
import { useUiStore } from "../../app/store/uiStore.js";
import { api, unwrap } from "../../services/api.js";

export function CommandPalette() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const projectId = useProjectStore((state) => state.currentProjectId);
  const [q, setQ] = useState("");
  const [results, setResults] = useState({});
  useEffect(() => {
    if (!open || !projectId) return;
    const timer = setTimeout(() => api.get("/search", { params: { projectId, q } }).then(unwrap).then(setResults).catch(() => setResults({})), 150);
    return () => clearTimeout(timer);
  }, [open, projectId, q]);
  if (!open) return null;
  const sections = [["Tasks", results.tasks], ["Notes", results.notes], ["Prompts", results.prompts], ["Resources", results.resources]];
  return (
    <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-20 max-w-2xl rounded-[10px] border border-white/10 bg-[#161B22] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="h-4 w-4 text-[#6E7681]" />
          <input autoFocus value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search current project" className="h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#6E7681]" />
          <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-[10px] text-[#8B949E] hover:bg-[#111827] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-96 overflow-auto p-2">
          {sections.map(([label, items = []]) => (
            <div key={label} className="mb-2">
              <p className="px-2 py-1 text-xs font-medium uppercase text-[#6E7681]">{label}</p>
              {items.map((item) => <button key={item._id} className="block w-full rounded-[10px] px-2 py-2 text-left text-sm text-[#E6EDF3] hover:bg-[#111827]">{item.title}</button>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
