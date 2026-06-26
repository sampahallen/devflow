import {
  Calendar,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  Link2,
  Settings,
  Zap
} from "lucide-react";

export const views = {
  dashboard: "Dashboard",
  kanban: "Kanban",
  prompts: "Prompts",
  notes: "Notes",
  links: "Links",
  calendar: "Calendar",
  settings: "Settings"
};

export const navItems = [
  { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { id: "kanban", Icon: KanbanSquare, label: "Kanban" },
  { id: "prompts", Icon: Zap, label: "Prompts" },
  { id: "notes", Icon: FileText, label: "Notes" },
  { id: "links", Icon: Link2, label: "Links" },
  { id: "calendar", Icon: Calendar, label: "Calendar" },
  { id: "settings", Icon: Settings, label: "Settings" }
];

export const columns = [
  { id: "todo", label: "Todo", color: "#6E7681" },
  { id: "in-progress", label: "In Progress", color: "#3B82F6" },
  { id: "review", label: "Review", color: "#F59E0B" },
  { id: "done", label: "Done", color: "#10B981" }
];

export const priorityConfig = {
  high: { label: "High", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  medium: { label: "Med", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  low: { label: "Low", color: "#10B981", bg: "rgba(16,185,129,0.12)" }
};

export const categoryColors = {
  Architecture: "#8B5CF6",
  Debugging: "#EF4444",
  Coding: "#3B82F6",
  Documentation: "#10B981",
  Design: "#F59E0B",
  Payments: "#10B981",
  Framework: "#3B82F6",
  Database: "#8B5CF6",
  Search: "#F59E0B",
  Infra: "#6E7681",
  State: "#EF4444",
  Perf: "#F59E0B",
  "UI/UX": "#F59E0B",
  Refactoring: "#8B5CF6",
  APIs: "#8B5CF6",
  Tutorials: "#F59E0B",
  "Design References": "#F59E0B",
  "Stack Overflow": "#EF4444"
};

export const promptCategories = ["Coding", "Debugging", "Documentation", "Architecture", "Design"];
export const resourceCategories = ["Documentation", "APIs", "Framework", "Database", "Infra"];
