import { TrendingUp } from "lucide-react";

export function Stat({ label, value, sub, color = "#E6EDF3", icon: Icon = TrendingUp }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-lg p-4"
      style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>
          {label}
        </span>
        <Icon size={13} style={{ color: "#6E7681" }} />
      </div>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-2xl font-bold leading-none" style={{ color, fontFamily: "'Inter', sans-serif" }}>
          {value}
        </span>
        {sub && <span className="mb-0.5 text-[11px]" style={{ color: "#6E7681" }}>{sub}</span>}
      </div>
    </div>
  );
}
