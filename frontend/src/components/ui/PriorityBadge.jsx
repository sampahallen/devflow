import { AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { priorityConfig } from "../../constants/app.js";

export function PriorityBadge({ priority = "medium" }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = priority === "high" ? AlertCircle : priority === "low" ? CheckCircle2 : Circle;
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ color: config.color, background: config.bg }}
    >
      <Icon size={8} strokeWidth={2.5} /> {config.label}
    </span>
  );
}
