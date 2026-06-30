import { AlertCircle, CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { priorityConfig } from "../../constants/app.js";

const priorities = ["high", "medium", "low"];
const icons = { high: AlertCircle, medium: Circle, low: CheckCircle2 };

export function PriorityDropdown({ priority = "medium", onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = icons[priority] || Circle;

  useEffect(() => {
    const handler = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-opacity hover:opacity-80"
        style={{ color: config.color, background: config.bg }}
      >
        <Icon size={8} strokeWidth={2.5} /> {config.label}
        <ChevronDown size={8} style={{ opacity: 0.7 }} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-[88px] overflow-hidden rounded-lg py-1"
          style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          {priorities.map((level) => {
            const item = priorityConfig[level];
            const ItemIcon = icons[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() => { onChange(level); setOpen(false); }}
                className="flex w-full cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left text-[10px] font-semibold transition-colors hover:bg-white/[0.06]"
                style={{ color: item.color }}
              >
                <ItemIcon size={9} strokeWidth={2.5} /> {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
