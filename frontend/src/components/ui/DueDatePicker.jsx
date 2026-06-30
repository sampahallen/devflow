import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { displayDate, localDateTimeToIso, toInputDate, toInputTime } from "../../lib/mappers.js";

export function DueDatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.showPicker?.() || inputRef.current?.focus();
  }, [open]);

  const hasDate = Boolean(value);
  const dateValue = toInputDate(value);
  const timeValue = toInputTime(value);

  const updateDateTime = (date, time = timeValue) => {
    onChange(date ? localDateTimeToIso(date, time) : null);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-[10px] transition-colors hover:bg-white/[0.06]"
        style={{ color: hasDate ? "#6E7681" : "#3B82F6", fontFamily: "monospace" }}
        title={hasDate ? "Change due date and time" : "Add due date and time"}
      >
        <Calendar size={9} style={{ flexShrink: 0 }} />
        {hasDate ? displayDate(value) : "Add date"}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 rounded-lg p-2"
          style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
        >
          <div className="flex gap-1.5">
            <input
              ref={inputRef}
              type="date"
              value={dateValue}
              onChange={(event) => updateDateTime(event.target.value, timeValue)}
              className="cursor-pointer rounded border border-white/10 bg-[#0D1117] px-2 py-1 text-[10px] outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3", fontFamily: "monospace" }}
            />
            <input
              type="time"
              value={timeValue}
              onChange={(event) => updateDateTime(dateValue || toInputDate(new Date()), event.target.value)}
              className="cursor-pointer rounded border border-white/10 bg-[#0D1117] px-2 py-1 text-[10px] outline-none focus:border-[#3B82F6]"
              style={{ color: "#E6EDF3", fontFamily: "monospace" }}
            />
          </div>
          {hasDate && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="mt-1.5 w-full cursor-pointer rounded px-2 py-1 text-[10px] transition-colors hover:bg-white/[0.06]"
              style={{ color: "#EF4444" }}
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
