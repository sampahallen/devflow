import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, KanbanSquare, Zap, FileText, Link2, Calendar, Settings,
  Plus, Search, ChevronDown, ChevronRight, MoreHorizontal, Copy, Check,
  Github, FileCode, Clock, Timer, AlertCircle, Circle, CheckCircle2,
  Play, Pause, RotateCcw, ExternalLink, Tag, Folder, FolderOpen,
  TrendingUp, Activity, Flame, Star, ArrowUpRight, RefreshCw, Bell,
  Wifi, Eye, Edit3, LayoutGrid, X, Hash, Globe, BookOpen, Package,
  ChevronUp, Filter, SortAsc, Layers, BarChart2, Target,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "high" | "med" | "low";
type Column = "todo" | "inprogress" | "review" | "done";
type View = "dashboard" | "kanban" | "prompts" | "notes" | "links" | "calendar" | "settings";

interface Project {
  id: string;
  name: string;
  color: string;
  tag: string;
  description: string;
  taskCount: number;
  completedTasks: number;
  pomodoroSessions: number;
  lastActive: string;
}

interface Task {
  id: string;
  title: string;
  priority: Priority;
  column: Column;
  assignee: string;
  dueDate: string;
  hasGithub?: boolean;
  hasMd?: boolean;
  pomodoroCount?: number;
  tags?: string[];
  projectId: string;
}

interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  body: string;
  usageCount: number;
  projectId: string;
  starred?: boolean;
}

interface NoteFile {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: NoteFile[];
  content?: string;
  modified?: string;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  favicon?: string;
  projectId: string;
}

interface Activity {
  id: string;
  type: "task" | "note" | "prompt" | "link" | "pomodoro";
  text: string;
  time: string;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  { id: "p1", name: "E-commerce App", color: "#3B82F6", tag: "Web", description: "Full-stack e-commerce platform with Next.js and Stripe", taskCount: 24, completedTasks: 11, pomodoroSessions: 38, lastActive: "2 min ago" },
  { id: "p2", name: "Portfolio Redesign", color: "#8B5CF6", tag: "Design", description: "Personal portfolio rewrite with Framer Motion animations", taskCount: 12, completedTasks: 8, pomodoroSessions: 14, lastActive: "1 hour ago" },
  { id: "p3", name: "DevFlow Core", color: "#10B981", tag: "OSS", description: "Local-first task manager — internal dogfooding project", taskCount: 31, completedTasks: 19, pomodoroSessions: 62, lastActive: "Yesterday" },
  { id: "p4", name: "API Gateway", color: "#F59E0B", tag: "Infra", description: "Rate-limiting and auth middleware for microservices", taskCount: 9, completedTasks: 3, pomodoroSessions: 11, lastActive: "3 days ago" },
];

const TASKS: Task[] = [
  { id: "t1", title: "Implement Stripe Checkout v3 integration", priority: "high", column: "inprogress", assignee: "AK", dueDate: "Jun 26", hasGithub: true, hasMd: true, pomodoroCount: 3, tags: ["payments"], projectId: "p1" },
  { id: "t2", title: "Product image optimisation pipeline (Sharp)", priority: "med", column: "todo", assignee: "SR", dueDate: "Jun 30", hasMd: true, tags: ["perf"], projectId: "p1" },
  { id: "t3", title: "Cart persistence with Zustand + localStorage", priority: "high", column: "todo", assignee: "ML", dueDate: "Jun 27", hasGithub: true, projectId: "p1" },
  { id: "t4", title: "Admin dashboard — orders table with filters", priority: "med", column: "review", assignee: "AK", dueDate: "Jun 25", hasGithub: true, hasMd: true, pomodoroCount: 2, projectId: "p1" },
  { id: "t5", title: "Inventory sync job — cron every 15 min", priority: "low", column: "review", assignee: "JP", dueDate: "Jul 2", tags: ["infra"], projectId: "p1" },
  { id: "t6", title: "Write product-search Algolia integration", priority: "high", column: "todo", assignee: "SR", dueDate: "Jun 28", hasGithub: true, tags: ["search"], projectId: "p1" },
  { id: "t7", title: "Checkout flow — address autocomplete (Places API)", priority: "med", column: "inprogress", assignee: "ML", dueDate: "Jun 29", pomodoroCount: 1, projectId: "p1" },
  { id: "t8", title: "Set up GitHub Actions deploy pipeline to Vercel", priority: "low", column: "done", assignee: "AK", dueDate: "Jun 20", hasGithub: true, projectId: "p1" },
  { id: "t9", title: "Database schema — products, orders, inventory", priority: "high", column: "done", assignee: "ML", dueDate: "Jun 18", hasMd: true, projectId: "p1" },
];

const PROMPTS: Prompt[] = [
  { id: "pr1", title: "E-commerce Data Model Review", category: "Architecture", description: "Review DB schema for normalisation and index coverage", body: "Review this e-commerce database schema for: normalisation issues, missing indexes, N+1 query risks, and scalability to 1M SKUs. Suggest concrete improvements.", usageCount: 14, starred: true, projectId: "p1" },
  { id: "pr2", title: "Stripe Webhook Debug", category: "Debugging", description: "Debug Stripe webhook signature failures", body: "Debug this Stripe webhook handler. Check: raw body parsing, signature verification, idempotency key handling, and retry logic for failed events.", usageCount: 7, projectId: "p1" },
  { id: "pr3", title: "Next.js API Route Scaffold", category: "Coding", description: "Generate type-safe API route with Zod validation", body: "Generate a Next.js App Router API route for: {endpoint}. Include: Zod input validation, error handling, rate limiting, and TypeScript types.", usageCount: 22, starred: true, projectId: "p1" },
  { id: "pr4", title: "Product Page SEO Audit", category: "Documentation", description: "Audit product pages for Core Web Vitals and SEO", body: "Audit this product page for: Open Graph tags, structured data (schema.org/Product), LCP optimisation, and canonical URL strategy.", usageCount: 5, projectId: "p1" },
  { id: "pr5", title: "Tailwind Component Refactor", category: "Design", description: "Extract reusable component patterns", body: "Refactor these Tailwind utility classes into a reusable React component. Ensure: variant props, dark mode support, and accessible focus states.", usageCount: 11, projectId: "p1" },
  { id: "pr6", title: "Payment Flow Test Cases", category: "Debugging", description: "Generate Playwright tests for checkout", body: "Write Playwright e2e tests for the checkout flow covering: successful payment, card decline, 3DS challenge, and webhook delivery verification.", usageCount: 3, projectId: "p1" },
];

const NOTES: NoteFile[] = [
  { id: "nf1", name: "E-commerce App", type: "folder", children: [
    { id: "nf2", name: "Architecture", type: "folder", children: [
      { id: "nf3", name: "database-schema.md", type: "file", modified: "Jun 22", content: `# Database Schema

## Core Tables

### products
\`\`\`sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  inventory   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### orders
\`\`\`sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  stripe_pi_id    TEXT UNIQUE,
  status          TEXT CHECK (status IN ('pending','paid','shipped','cancelled')),
  total_cents     INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);
\`\`\`

## Indexes

| Table | Column | Type | Reason |
|-------|--------|------|--------|
| products | slug | UNIQUE BTREE | URL lookups |
| orders | user_id | BTREE | User order history |
| orders | stripe_pi_id | UNIQUE BTREE | Webhook dedup |

## Notes

> **Warning:** Add partial index on \`orders WHERE status = 'pending'\` — full scans are slow past 100k rows.` },
      { id: "nf4", name: "stripe-integration.md", type: "file", modified: "Jun 21", content: `# Stripe Integration

## Approach

Using **Stripe Checkout** with server-side session creation.

## Webhook Events

- \`payment_intent.succeeded\` → fulfil order
- \`payment_intent.payment_failed\` → notify user
- \`customer.subscription.deleted\` → downgrade plan

## Idempotency

Every webhook handler checks the \`stripe_pi_id\` before processing.` },
    ]},
    { id: "nf5", name: "Decisions", type: "folder", children: [
      { id: "nf6", name: "ADR-001-state-management.md", type: "file", modified: "Jun 19", content: `# ADR 001: State Management

**Status:** Accepted
**Date:** 2026-06-19

## Context

Needed a lightweight, persistent cart state solution.

## Decision

**Zustand** with localStorage middleware.

## Consequences

- ✅ Zero boilerplate vs Redux
- ✅ Persists across sessions
- ⚠️ SSR hydration mismatch — mitigated with \`skipHydration\`` },
    ]},
    { id: "nf7", name: "README.md", type: "file", modified: "Jun 18", content: `# E-commerce App

Next.js 15 · PostgreSQL · Stripe · Vercel

## Stack

- **Frontend:** Next.js 15 App Router, Tailwind CSS
- **Backend:** Next.js API Routes, Drizzle ORM
- **Payments:** Stripe Checkout + Webhooks
- **Search:** Algolia InstantSearch
- **Infra:** Vercel + Neon PostgreSQL` },
  ]},
];

const LINKS: LinkItem[] = [
  { id: "l1", title: "Stripe Checkout Docs", url: "https://stripe.com/docs/checkout", category: "Payments", description: "Official Stripe Checkout session API reference", projectId: "p1" },
  { id: "l2", title: "Next.js App Router Guide", url: "https://nextjs.org/docs/app", category: "Framework", description: "App Router, Server Components, layouts and routing", projectId: "p1" },
  { id: "l3", title: "Drizzle ORM Docs", url: "https://orm.drizzle.team", category: "Database", description: "Type-safe ORM with schema push and migrations", projectId: "p1" },
  { id: "l4", title: "Algolia InstantSearch", url: "https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react", category: "Search", description: "React hooks and components for search UI", projectId: "p1" },
  { id: "l5", title: "Vercel Deploy Docs", url: "https://vercel.com/docs/deployments", category: "Infra", description: "Deployment configuration, env vars, preview URLs", projectId: "p1" },
  { id: "l6", title: "Zustand Persist Middleware", url: "https://github.com/pmndrs/zustand", category: "State", description: "Lightweight state management with persistence", projectId: "p1" },
  { id: "l7", title: "Neon PostgreSQL", url: "https://neon.tech/docs", category: "Database", description: "Serverless Postgres with branching for dev/prod", projectId: "p1" },
  { id: "l8", title: "Sharp Image Processing", url: "https://sharp.pixelplumbing.com", category: "Perf", description: "High-performance image resize and optimisation", projectId: "p1" },
];

const ACTIVITIES: Activity[] = [
  { id: "a1", type: "task", text: "Moved \"Stripe Checkout v3\" to In Progress", time: "2m ago", color: "#3B82F6" },
  { id: "a2", type: "pomodoro", text: "Completed 3 pomodoro sessions on payments sprint", time: "18m ago", color: "#EF4444" },
  { id: "a3", type: "note", text: "Updated stripe-integration.md with webhook events", time: "1h ago", color: "#10B981" },
  { id: "a4", type: "task", text: "Completed \"Admin dashboard — orders table\"", time: "2h ago", color: "#10B981" },
  { id: "a5", type: "prompt", text: "Used \"Next.js API Route Scaffold\" prompt 3×", time: "3h ago", color: "#8B5CF6" },
  { id: "a6", type: "link", text: "Added Algolia InstantSearch to resources", time: "5h ago", color: "#F59E0B" },
  { id: "a7", type: "task", text: "Created task: Algolia product search integration", time: "6h ago", color: "#6E7681" },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high: { label: "High", color: "#EF4444", bg: "rgba(239,68,68,0.12)", Icon: AlertCircle },
  med:  { label: "Med",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)", Icon: Circle },
  low:  { label: "Low",  color: "#10B981", bg: "rgba(16,185,129,0.12)", Icon: CheckCircle2 },
};

const COLUMN_CONFIG: { id: Column; label: string; color: string }[] = [
  { id: "todo",       label: "Todo",        color: "#6E7681" },
  { id: "inprogress", label: "In Progress", color: "#3B82F6" },
  { id: "review",     label: "Review",      color: "#F59E0B" },
  { id: "done",       label: "Done",        color: "#10B981" },
];

const AVATAR_COLORS: Record<string, string> = { AK: "#3B82F6", SR: "#8B5CF6", ML: "#10B981", JP: "#F59E0B" };

const CAT_COLORS: Record<string, string> = {
  Architecture: "#8B5CF6", Debugging: "#EF4444", Coding: "#3B82F6",
  Documentation: "#10B981", Design: "#F59E0B",
  Payments: "#10B981", Framework: "#3B82F6", Database: "#8B5CF6",
  Search: "#F59E0B", Infra: "#6E7681", State: "#EF4444", Perf: "#F59E0B",
};

const NAV_ITEMS: { id: View; Icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
  { id: "kanban",    Icon: KanbanSquare,    label: "Kanban" },
  { id: "prompts",   Icon: Zap,             label: "Prompts" },
  { id: "notes",     Icon: FileText,        label: "Notes" },
  { id: "links",     Icon: Link2,           label: "Links" },
  { id: "calendar",  Icon: Calendar,        label: "Calendar" },
  { id: "settings",  Icon: Settings,        label: "Settings" },
];

// ─── Micro components ─────────────────────────────────────────────────────────

function Avatar({ initials, size = 20 }: { initials: string; size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: AVATAR_COLORS[initials] ?? "#6E7681", fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, color, bg, Icon } = PRIORITY_CONFIG[priority];
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ color, background: bg }}>
      <Icon size={8} strokeWidth={2.5} /> {label}
    </span>
  );
}

function Stat({ label, value, sub, color = "#E6EDF3", icon: Icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: typeof TrendingUp }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#6E7681" }}>{label}</span>
        {Icon && <Icon size={13} style={{ color: "#6E7681" }} />}
      </div>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl font-bold leading-none" style={{ color, fontFamily: "'Inter', sans-serif" }}>{value}</span>
        {sub && <span className="text-[11px] mb-0.5" style={{ color: "#6E7681" }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─── Project Selector ─────────────────────────────────────────────────────────

function ProjectSelector({ project, projects, onChange }: { project: Project; projects: Project[]; onChange: (p: Project) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group"
        style={{ background: open ? "#21262D" : "transparent", border: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#21262D"; }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: project.color }} />
        <span className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>{project.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${project.color}20`, color: project.color }}>{project.tag}</span>
        <ChevronDown size={12} style={{ color: "#6E7681", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden"
            style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.12)", minWidth: 280, boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
            <div className="p-1.5">
              {projects.map(p => (
                <button key={p.id} onClick={() => { onChange(p); setOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-all duration-100"
                  style={{ background: p.id === project.id ? "rgba(255,255,255,0.06)" : "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (p.id !== project.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: p.color }} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{p.name}</span>
                    <span className="text-[10px] truncate" style={{ color: "#6E7681" }}>{p.description}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px]" style={{ color: p.color, background: `${p.color}18`, padding: "1px 6px", borderRadius: 4 }}>{p.tag}</span>
                    <span className="text-[10px]" style={{ color: "#6E7681" }}>{p.lastActive}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-1.5 pb-1.5">
              <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-100"
                style={{ color: "#3B82F6", border: "1px dashed rgba(59,130,246,0.3)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <Plus size={12} /> Create New Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ view, project, onNav }: { view: View; project: Project; onNav: (v: View) => void }) {
  return (
    <div className="flex flex-col h-full py-3" style={{ background: "#0D1117", borderRight: "1px solid rgba(255,255,255,0.08)", width: 200 }}>
      <div className="px-3 mb-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md mb-3" style={{ background: `${project.color}12` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest truncate" style={{ color: project.color }}>{project.name}</span>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {NAV_ITEMS.map(({ id, Icon, label }) => {
          const active = view === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-100 w-full text-left"
              style={{ color: active ? "#E6EDF3" : "#6E7681", background: active ? "rgba(255,255,255,0.07)" : "transparent" }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#C9D1D9"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6E7681"; } }}>
              <Icon size={14} style={{ color: active ? project.color : "#6E7681", flexShrink: 0 }} />
              {label}
              {active && <div className="ml-auto w-1 h-1 rounded-full" style={{ background: project.color }} />}
            </button>
          );
        })}
      </nav>
      <div className="px-3 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6E7681" }}>Progress</span>
          <span className="text-[10px] ml-auto" style={{ color: "#6E7681" }}>{project.completedTasks}/{project.taskCount}</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full" style={{ background: project.color, width: `${(project.completedTasks / project.taskCount) * 100}%`, transition: "width 0.4s ease" }} />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "#6E7681" }}>{Math.round((project.completedTasks / project.taskCount) * 100)}% complete</p>
      </div>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ project, projects, onProjectChange }: { project: Project; projects: Project[]; onProjectChange: (p: Project) => void }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 flex-shrink-0" style={{ background: "#0D1117", borderBottom: "1px solid rgba(255,255,255,0.08)", height: 52 }}>
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
          <Layers size={13} color="#fff" />
        </div>
        <span className="text-sm font-bold" style={{ color: "#E6EDF3" }}>DevFlow</span>
      </div>

      <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

      <ProjectSelector project={project} projects={projects} onChange={onProjectChange} />

      <div className="flex-1" />

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)", width: 220 }}>
        <Search size={12} style={{ color: "#6E7681", flexShrink: 0 }} />
        <span className="text-xs flex-1" style={{ color: "#6E7681" }}>Search in project...</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)", fontFamily: "monospace" }}>⌘K</kbd>
      </div>

      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
        style={{ background: project.color, color: "#fff" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
        <Plus size={12} /> New Task
      </button>

      <button className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
        style={{ background: "rgba(255,255,255,0.04)", color: "#6E7681" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E6EDF3"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6E7681"; }}>
        <Bell size={14} />
      </button>

      <Avatar initials="AK" size={28} />
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView({ project, onNav }: { project: Project; onNav: (v: View) => void }) {
  const tasks = TASKS.filter(t => t.projectId === project.id);
  const done = tasks.filter(t => t.column === "done").length;
  const inprog = tasks.filter(t => t.column === "inprogress").length;
  const highPriority = tasks.filter(t => t.priority === "high" && t.column !== "done").length;

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pr-1">
      {/* Hero */}
      <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${project.color}18 0%, transparent 60%)`, border: `1px solid ${project.color}30` }}>
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(ellipse at top left, ${project.color} 0%, transparent 60%)` }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: project.color }} />
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: project.color }}>{project.tag} Project</span>
            </div>
            <h1 className="text-xl font-bold mb-1" style={{ color: "#E6EDF3" }}>{project.name}</h1>
            <p className="text-sm" style={{ color: "#8B949E" }}>{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10B981" }} />
              Active · {project.lastActive}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Tasks Done" value={done} sub={`/ ${tasks.length} total`} color="#10B981" icon={CheckCircle2} />
        <Stat label="In Progress" value={inprog} color="#3B82F6" icon={Activity} />
        <Stat label="Pomodoros" value={project.pomodoroSessions} sub="sessions" color="#EF4444" icon={Flame} />
        <Stat label="High Priority" value={highPriority} sub="open" color="#F59E0B" icon={AlertCircle} />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Left col */}
        <div className="flex flex-col gap-4">
          {/* Recent Tasks */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Active Tasks</span>
              <button onClick={() => onNav("kanban")} className="flex items-center gap-1 text-[11px] transition-all" style={{ color: "#3B82F6" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                View board <ArrowUpRight size={10} />
              </button>
            </div>
            <div className="divide-y" style={{ divideColor: "rgba(255,255,255,0.05)" }}>
              {tasks.filter(t => t.column !== "done").slice(0, 5).map(task => {
                const col = COLUMN_CONFIG.find(c => c.id === task.column)!;
                return (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 transition-all duration-100"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                    <span className="text-xs flex-1 truncate" style={{ color: "#C9D1D9" }}>{task.title}</span>
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{task.dueDate}</span>
                    <Avatar initials={task.assignee} size={18} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Resources */}
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Key Resources</span>
              <button onClick={() => onNav("links")} className="flex items-center gap-1 text-[11px]" style={{ color: "#3B82F6" }}>View all <ArrowUpRight size={10} /></button>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {LINKS.filter(l => l.projectId === project.id).slice(0, 4).map(link => {
                const catColor = CAT_COLORS[link.category] ?? "#6E7681";
                return (
                  <div key={link.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-100"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <Globe size={13} style={{ color: catColor, flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#C9D1D9" }}>{link.title}</p>
                      <p className="text-[10px]" style={{ color: "#6E7681" }}>{link.category}</p>
                    </div>
                    <ExternalLink size={10} style={{ color: "#6E7681", flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          {/* Activity Feed */}
          <div className="rounded-lg overflow-hidden flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="px-4 py-3 flex-shrink-0" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Recent Activity</span>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {ACTIVITIES.map((act, i) => (
                <div key={act.id} className="flex items-start gap-3 px-4 py-2.5 relative" style={{ borderBottom: i < ACTIVITIES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: act.color }} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[11px] leading-snug" style={{ color: "#8B949E" }}>{act.text}</p>
                    <span className="text-[10px] mt-0.5" style={{ color: "#6E7681", fontFamily: "monospace" }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban snapshot */}
          <div className="rounded-lg p-4" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>Board Snapshot</span>
              <button onClick={() => onNav("kanban")} className="text-[11px]" style={{ color: "#3B82F6" }}>Open board</button>
            </div>
            <div className="flex gap-2">
              {COLUMN_CONFIG.map(col => {
                const count = tasks.filter(t => t.column === col.id).length;
                const pct = tasks.length ? count / tasks.length : 0;
                return (
                  <div key={col.id} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full h-16 rounded flex items-end overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-full rounded-sm transition-all duration-500" style={{ height: `${Math.max(8, pct * 100)}%`, background: `${col.color}60` }} />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: col.color }}>{count}</span>
                    <span className="text-[9px] text-center leading-tight" style={{ color: "#6E7681" }}>{col.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban View ──────────────────────────────────────────────────────────────

function KanbanCard({ task }: { task: Task }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="rounded-lg p-3 cursor-pointer transition-all duration-150"
      style={{ background: hovered ? "#1C2128" : "#161B22", border: `1px solid ${hovered ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <p className="text-[11px] font-medium leading-snug mb-2.5" style={{ color: "#E6EDF3", lineHeight: 1.45 }}>{task.title}</p>
      <div className="flex flex-wrap items-center gap-1 mb-2.5">
        <PriorityBadge priority={task.priority} />
        {task.tags?.map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)", fontFamily: "monospace" }}>{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {task.hasMd && <FileCode size={11} style={{ color: "#6E7681" }} />}
          {task.hasGithub && <Github size={11} style={{ color: "#6E7681" }} />}
          {task.pomodoroCount != null && task.pomodoroCount > 0 && (
            <div className="flex items-center gap-1">
              <Timer size={10} style={{ color: "#EF4444" }} />
              <span className="text-[10px]" style={{ color: "#EF4444", fontFamily: "monospace" }}>{task.pomodoroCount}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{task.dueDate}</span>
          <Avatar initials={task.assignee} size={17} />
        </div>
      </div>
    </div>
  );
}

function KanbanView({ project }: { project: Project }) {
  const tasks = TASKS.filter(t => t.projectId === project.id);
  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-2">
      {COLUMN_CONFIG.map(col => {
        const colTasks = tasks.filter(t => t.column === col.id);
        return (
          <div key={col.id} className="flex flex-col flex-shrink-0" style={{ width: 268 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: col.color }}>{col.label}</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}>{colTasks.length}</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 p-2 rounded-lg overflow-y-auto" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {colTasks.map(task => <KanbanCard key={task.id} task={task} />)}
              <button className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-[11px] w-full transition-all"
                style={{ color: "#6E7681", border: "1px dashed rgba(255,255,255,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "#C9D1D9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#6E7681"; }}>
                <Plus size={11} /> Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Prompts View ─────────────────────────────────────────────────────────────

function PromptsView({ project }: { project: Project }) {
  const prompts = PROMPTS.filter(p => p.projectId === project.id);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(prompts.map(p => p.category)))];
  const filtered = filter === "All" ? prompts : prompts.filter(p => p.category === filter);

  const handleCopy = (id: string, body: string) => {
    navigator.clipboard.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
              style={filter === cat ? { background: project.color, color: "#fff" } : { color: "#6E7681" }}>
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs ml-2" style={{ color: "#6E7681" }}>{filtered.length} prompts</span>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: project.color, color: "#fff" }}>
          <Plus size={12} /> New Prompt
        </button>
      </div>
      <div className="grid gap-3 overflow-y-auto pr-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", alignContent: "start" }}>
        {filtered.map(prompt => {
          const catColor = CAT_COLORS[prompt.category] ?? "#6E7681";
          const isCopied = copied === prompt.id;
          return (
            <div key={prompt.id} className="rounded-lg p-4 flex flex-col gap-3 transition-all duration-150"
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: catColor, background: `${catColor}18` }}>{prompt.category}</span>
                    {prompt.starred && <Star size={10} style={{ color: "#F59E0B" }} fill="#F59E0B" />}
                  </div>
                  <h3 className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{prompt.title}</h3>
                  <p className="text-[10px] mt-0.5" style={{ color: "#6E7681" }}>{prompt.description}</p>
                </div>
                <span className="text-[10px] flex-shrink-0 flex items-center gap-0.5" style={{ color: "#6E7681" }}>
                  <Activity size={9} /> {prompt.usageCount}×
                </span>
              </div>
              <pre className="rounded-md p-2.5 text-[10px] leading-relaxed overflow-hidden whitespace-pre-wrap line-clamp-3"
                style={{ background: "#0D1117", color: "#8B949E", fontFamily: "monospace", border: "1px solid rgba(255,255,255,0.06)", maxHeight: 72 }}>
                {prompt.body}
              </pre>
              <button onClick={() => handleCopy(prompt.id, prompt.body)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all w-full"
                style={{ color: isCopied ? "#10B981" : "#6E7681", background: isCopied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {isCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Notes View ───────────────────────────────────────────────────────────────

function NoteTreeItem({ file, depth, selected, onSelect }: { file: NoteFile; depth: number; selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(depth === 0);
  if (file.type === "folder") {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 w-full text-left py-1 rounded-md text-[11px] transition-all"
          style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: 8, color: "#8B949E" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          {open ? <FolderOpen size={11} style={{ color: "#F59E0B", flexShrink: 0 }} /> : <Folder size={11} style={{ color: "#F59E0B", flexShrink: 0 }} />}
          <span className="font-medium flex-1">{file.name}</span>
          {open ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
        </button>
        {open && file.children?.map(c => <NoteTreeItem key={c.id} file={c} depth={depth + 1} selected={selected} onSelect={onSelect} />)}
      </div>
    );
  }
  const isSelected = selected === file.id;
  return (
    <button onClick={() => onSelect(file.id)}
      className="flex items-center gap-1.5 w-full text-left py-1 rounded-md text-[11px] transition-all"
      style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: 8, color: isSelected ? "#E6EDF3" : "#6E7681", background: isSelected ? "rgba(59,130,246,0.1)" : "transparent" }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
      <FileText size={10} style={{ flexShrink: 0, color: isSelected ? "#3B82F6" : "#6E7681" }} />
      <span className="flex-1 truncate">{file.name}</span>
      {file.modified && <span className="text-[9px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{file.modified}</span>}
    </button>
  );
}

function getAllFiles(files: NoteFile[]): NoteFile[] {
  return files.flatMap(f => f.type === "folder" ? getAllFiles(f.children ?? []) : [f]);
}

function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const els: React.ReactNode[] = [];
  let i = 0, codeLines: string[] = [], inCode = false, tableRows: string[][] = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows; tableRows = [];
    els.push(
      <div key={`t${i}`} className="overflow-x-auto my-3">
        <table className="w-full text-[11px] border-collapse">
          <thead><tr>{rows[0].map((c, ci) => <th key={ci} className="text-left py-1.5 px-3 font-semibold" style={{ color: "#E6EDF3", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{c.trim()}</th>)}</tr></thead>
          <tbody>{rows.slice(2).map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci} className="py-1.5 px-3" style={{ color: "#8B949E", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{c.trim()}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      inCode ? (els.push(<pre key={`c${i}`} className="my-3 rounded-lg p-3 text-[10px] leading-relaxed overflow-x-auto" style={{ background: "#0D1117", color: "#79C0FF", fontFamily: "monospace", border: "1px solid rgba(255,255,255,0.08)" }}>{codeLines.join("\n")}</pre>), inCode = false, codeLines = []) : (inCode = true);
      i++; continue;
    }
    if (inCode) { codeLines.push(line); i++; continue; }
    if (line.startsWith("|")) { tableRows.push(line.split("|").filter((_, ci, a) => ci > 0 && ci < a.length - 1)); i++; continue; }
    flushTable();
    if (line.startsWith("# ")) els.push(<h1 key={i} className="text-lg font-bold mt-1 mb-3" style={{ color: "#E6EDF3" }}>{line.slice(2)}</h1>);
    else if (line.startsWith("## ")) els.push(<h2 key={i} className="text-sm font-semibold mt-4 mb-2" style={{ color: "#E6EDF3" }}>{line.slice(3)}</h2>);
    else if (line.startsWith("### ")) els.push(<h3 key={i} className="text-xs font-semibold mt-3 mb-1.5" style={{ color: "#C9D1D9" }}>{line.slice(4)}</h3>);
    else if (line.startsWith("> ")) els.push(<blockquote key={i} className="pl-3 my-2 text-[11px] italic" style={{ borderLeft: "2px solid #3B82F6", color: "#8B949E" }}>{line.slice(2)}</blockquote>);
    else if (line.match(/^[-*] /)) els.push(<li key={i} className="text-[11px] ml-4 my-0.5 list-disc" style={{ color: "#8B949E" }} dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<b style='color:#C9D1D9'>$1</b>").replace(/`(.*?)`/g, "<code style='color:#79C0FF;font-family:monospace;background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:3px'>$1</code>") }} />);
    else if (line.match(/^✅|^⚠️/)) els.push(<li key={i} className="text-[11px] ml-1 my-0.5 list-none" style={{ color: "#8B949E" }}>{line}</li>);
    else if (line.trim() === "") els.push(<div key={i} className="h-2" />);
    else els.push(<p key={i} className="text-[11px] leading-relaxed my-0.5" style={{ color: "#8B949E" }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#C9D1D9'>$1</strong>").replace(/`(.*?)`/g, "<code style='color:#79C0FF;font-family:monospace;background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:3px'>$1</code>") }} />);
    i++;
  }
  flushTable();
  return <>{els}</>;
}

function NotesView() {
  const allFiles = getAllFiles(NOTES);
  const [selected, setSelected] = useState(allFiles[0]?.id ?? "");
  const [mode, setMode] = useState<"split" | "edit" | "preview">("split");
  const file = allFiles.find(f => f.id === selected);

  return (
    <div className="flex h-full gap-0 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-col py-2 overflow-y-auto flex-shrink-0" style={{ width: 196, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "#6E7681" }}>Files</span>
          <button style={{ color: "#6E7681" }}><Plus size={11} /></button>
        </div>
        {NOTES.map(f => <NoteTreeItem key={f.id} file={f} depth={0} selected={selected} onSelect={setSelected} />)}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0D1117" }}>
          <span className="text-[11px] font-medium" style={{ color: "#E6EDF3", fontFamily: "monospace" }}>{file?.name}</span>
          <div className="flex items-center gap-1 p-0.5 rounded-md" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["edit", "split", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all"
                style={mode === m ? { background: "#21262D", color: "#E6EDF3" } : { color: "#6E7681" }}>
                {m === "edit" && <><Edit3 size={9} /> Edit</>}
                {m === "split" && <><LayoutGrid size={9} /> Split</>}
                {m === "preview" && <><Eye size={9} /> Preview</>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 min-h-0">
          {(mode === "edit" || mode === "split") && (
            <div className={`overflow-y-auto p-4 ${mode === "split" ? "w-1/2" : "w-full"}`} style={{ borderRight: mode === "split" ? "1px solid rgba(255,255,255,0.08)" : "none", background: "#0D1117" }}>
              <pre className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ color: "#8B949E", fontFamily: "monospace" }}>{file?.content}</pre>
            </div>
          )}
          {(mode === "preview" || mode === "split") && (
            <div className="overflow-y-auto p-4 flex-1" style={{ background: "#0D1117" }}>
              {file?.content ? <MarkdownPreview content={file.content} /> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Links View ───────────────────────────────────────────────────────────────

function LinksView({ project }: { project: Project }) {
  const links = LINKS.filter(l => l.projectId === project.id);
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(links.map(l => l.category)))];
  const filtered = filter === "All" ? links : links.filter(l => l.category === filter);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
              style={filter === cat ? { background: project.color, color: "#fff" } : { color: "#6E7681" }}>
              {cat}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: project.color, color: "#fff" }}>
          <Plus size={12} /> Add Link
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {filtered.map(link => {
          const catColor = CAT_COLORS[link.category] ?? "#6E7681";
          return (
            <div key={link.id} className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150"
              style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.13)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `${catColor}18` }}>
                <Globe size={14} style={{ color: catColor }} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{link.title}</span>
                <span className="text-[10px] truncate mt-0.5" style={{ color: "#6E7681", fontFamily: "monospace" }}>{link.url}</span>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0" style={{ color: catColor, background: `${catColor}18` }}>{link.category}</span>
              <p className="text-[11px] flex-shrink-0 hidden lg:block max-w-[240px] truncate" style={{ color: "#6E7681" }}>{link.description}</p>
              <ExternalLink size={12} style={{ color: "#6E7681", flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView({ project }: { project: Project }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  const events = [
    { day: 0, hour: 10, duration: 1, title: "Sprint Planning", color: project.color },
    { day: 1, hour: 14, duration: 1.5, title: "Stripe Integration Review", color: "#8B5CF6" },
    { day: 2, hour: 11, duration: 1, title: "1:1 — Engineering", color: "#10B981" },
    { day: 3, hour: 9, duration: 2, title: "Architecture Decision", color: "#F59E0B" },
    { day: 4, hour: 15, duration: 1, title: "Deploy & Release", color: "#EF4444" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>June 2026</h2>
          <div className="flex gap-1">
            {["<", "Today", ">"].map(b => (
              <button key={b} className="px-2 py-1 rounded text-xs transition-all" style={{ color: "#6E7681", background: "rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E6EDF3"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6E7681"; }}>{b}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>
          <Wifi size={11} /> Google Calendar synced
        </div>
      </div>
      <div className="flex flex-1 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex flex-col flex-shrink-0" style={{ width: 52, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="h-10" />
          {hours.map(h => (
            <div key={h} className="flex items-center justify-end pr-2 flex-shrink-0" style={{ height: 60, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[10px]" style={{ color: "#6E7681", fontFamily: "monospace" }}>{h}:00</span>
            </div>
          ))}
        </div>
        <div className="flex flex-1 relative overflow-hidden">
          {days.map((day, di) => (
            <div key={day} className="flex flex-col flex-1 relative" style={{ borderLeft: di > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div className="flex items-center justify-center h-10 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-[11px] font-semibold" style={{ color: di === 1 ? project.color : "#6E7681" }}>{day}</span>
              </div>
              {hours.map(h => <div key={h} className="flex-shrink-0" style={{ height: 60, borderTop: "1px solid rgba(255,255,255,0.04)" }} />)}
              {events.filter(e => e.day === di).map((evt, ei) => (
                <div key={ei} className="absolute left-0.5 right-0.5 rounded px-1.5 py-1.5 overflow-hidden cursor-pointer"
                  style={{ top: 40 + (evt.hour - 9) * 60, height: evt.duration * 60 - 3, background: `${evt.color}20`, borderLeft: `2px solid ${evt.color}`, color: evt.color }}>
                  <p className="text-[10px] font-semibold leading-tight">{evt.title}</p>
                  <p className="text-[9px] mt-0.5 opacity-70" style={{ fontFamily: "monospace" }}>{evt.hour}:00</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────

function SettingsView({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-4 max-w-xl overflow-y-auto">
      <div className="rounded-lg p-5" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#E6EDF3" }}>Project Details</h3>
        <div className="flex flex-col gap-3">
          {[["Name", project.name], ["Tag", project.tag], ["Description", project.description]].map(([label, val]) => (
            <div key={label} className="flex items-start justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-xs" style={{ color: "#6E7681" }}>{label}</span>
              <span className="text-xs font-medium text-right max-w-[240px]" style={{ color: "#E6EDF3" }}>{val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs" style={{ color: "#6E7681" }}>Color</span>
            <div className="flex gap-2">
              {["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"].map(c => (
                <div key={c} className="w-5 h-5 rounded-full cursor-pointer transition-all" style={{ background: c, outline: c === project.color ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg p-5" style={{ background: "#161B22", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#E6EDF3" }}>Integrations</h3>
        {[{ name: "GitHub", status: "Connected", color: "#10B981" }, { name: "Google Calendar", status: "Connected", color: "#10B981" }, { name: "Algolia", status: "Configured", color: "#3B82F6" }].map(int => (
          <div key={int.name} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-xs" style={{ color: "#8B949E" }}>{int.name}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: int.color, background: `${int.color}15` }}>{int.status}</span>
          </div>
        ))}
      </div>
      <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all" style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
        Delete Project
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const VIEW_LABELS: Record<View, string> = {
  dashboard: "Dashboard", kanban: "Kanban", prompts: "Prompts",
  notes: "Notes", links: "Links", calendar: "Calendar", settings: "Settings",
};

export default function App() {
  const [project, setProject] = useState(PROJECTS[0]);
  const [view, setView] = useState<View>("dashboard");

  const handleProjectChange = (p: Project) => { setProject(p); setView("dashboard"); };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: "#0D1117", fontFamily: "'Inter', sans-serif" }}>
      <TopBar project={project} projects={PROJECTS} onProjectChange={handleProjectChange} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar view={view} project={project} onNav={setView} />
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-xs" style={{ color: "#6E7681" }}>{project.name}</span>
            <ChevronRight size={12} style={{ color: "#6E7681" }} />
            <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{VIEW_LABELS[view]}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden p-6">
            <AnimatePresence mode="wait">
              <motion.div key={`${project.id}-${view}`} className="h-full" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.13 }}>
                {view === "dashboard"  && <DashboardView project={project} onNav={setView} />}
                {view === "kanban"     && <KanbanView project={project} />}
                {view === "prompts"    && <PromptsView project={project} />}
                {view === "notes"      && <NotesView />}
                {view === "links"      && <LinksView project={project} />}
                {view === "calendar"   && <CalendarView project={project} />}
                {view === "settings"   && <SettingsView project={project} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
        *::-webkit-scrollbar { width: 4px; height: 4px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        *::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
      `}</style>
    </div>
  );
}
