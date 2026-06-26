import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useCalendarStore } from "./store/calendarStore.js";
import { useNotesStore } from "./store/notesStore.js";
import { usePomodoroStore } from "./store/pomodoroStore.js";
import { useProjectStore } from "./store/projectStore.js";
import { usePromptStore } from "./store/promptStore.js";
import { useResourceStore } from "./store/resourceStore.js";
import { useTaskStore } from "./store/taskStore.js";
import { CommandPalette } from "../components/shared/CommandPalette.jsx";
import { EmptyProjectState } from "../components/shared/EmptyProjectState.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { views } from "../constants/app.js";
import { asTemplateProject } from "../lib/mappers.js";
import { api, unwrap } from "../services/api.js";
import { CalendarView } from "../modules/calendar/CalendarView.jsx";
import { DashboardView } from "../modules/dashboard/DashboardView.jsx";
import { KanbanView } from "../modules/kanban/KanbanView.jsx";
import { LinksView } from "../modules/links/LinksView.jsx";
import { NotesView } from "../modules/notes/NotesView.jsx";
import { PromptsView } from "../modules/prompts/PromptsView.jsx";
import { SettingsView } from "../modules/settings/SettingsView.jsx";

export function DevFlowApp() {
  const [view, setView] = useState("dashboard");
  const [dashboard, setDashboard] = useState({});
  const {
    projects,
    currentProjectId,
    loading,
    initialized,
    error,
    fetchProjects,
    createProject,
    setCurrentProject,
    updateProject,
    deleteProject
  } = useProjectStore();
  const taskStore = useTaskStore();
  const promptStore = usePromptStore();
  const notesStore = useNotesStore();
  const resourceStore = useResourceStore();
  const pomodoroStore = usePomodoroStore();
  const calendarStore = useCalendarStore();

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    if (!currentProjectId) {
      taskStore.fetch(null);
      promptStore.fetch(null);
      notesStore.fetch(null);
      resourceStore.fetch(null);
      setDashboard({});
      return;
    }
    taskStore.fetch(currentProjectId);
    promptStore.fetch(currentProjectId);
    notesStore.fetch(currentProjectId);
    resourceStore.fetch(currentProjectId);
    api.get("/pomodoro", { params: { projectId: currentProjectId } })
      .then(unwrap)
      .then((sessions) => pomodoroStore.setSessions?.(sessions))
      .catch(() => undefined);
    api.get("/dashboard", { params: { projectId: currentProjectId } })
      .then(unwrap)
      .then(setDashboard)
      .catch(() => undefined);
  }, [currentProjectId]);

  const rawProject = projects.find((project) => project._id === currentProjectId) || null;
  const hasProject = Boolean(rawProject);
  const project = useMemo(
    () => asTemplateProject(rawProject, taskStore.items, pomodoroStore.sessions || []),
    [rawProject, taskStore.items, pomodoroStore.sessions]
  );

  const createNamedProject = async () => {
    await createProject({
      name: projects.length === 0 ? "My First Project" : `Project ${projects.length + 1}`,
      description: "New DevFlow workspace",
      color: "#3B82F6"
    });
    setView("dashboard");
  };

  const newTask = () => {
    if (!hasProject) return;
    setView("kanban");
    taskStore.create({ title: "New task", priority: "medium", status: "todo", projectId: project.id });
  };

  const handleProjectChange = (projectId) => {
    setCurrentProject(projectId);
    setView("dashboard");
  };

  if (!initialized && loading) {
    return (
      <div className="grid h-screen place-items-center bg-[#0D1117] text-sm text-[#8B949E]">
        Loading DevFlow...
      </div>
    );
  }

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "#0D1117", fontFamily: "'Inter', sans-serif" }}
    >
      <TopBar
        project={project}
        projects={projects}
        hasProject={hasProject}
        onProjectChange={handleProjectChange}
        onCreateProject={createNamedProject}
        onNewTask={newTask}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar view={view} project={project} onNav={setView} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            className="flex shrink-0 items-center gap-2 px-6 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-xs" style={{ color: "#6E7681" }}>{project.name}</span>
            <ChevronRight size={12} style={{ color: "#6E7681" }} />
            <span className="text-xs font-semibold" style={{ color: "#E6EDF3" }}>{views[view]}</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden p-6">
            {!hasProject ? (
              <EmptyProjectState
                onCreateProject={createNamedProject}
                error={error}
                onRetry={fetchProjects}
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${project.id}-${view}`}
                  className="h-full"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.13 }}
                >
                  {view === "dashboard" && (
                    <DashboardView
                      project={project}
                      tasks={taskStore.items}
                      resources={resourceStore.items}
                      data={dashboard}
                      onNav={setView}
                    />
                  )}
                  {view === "kanban" && (
                    <KanbanView
                      project={project}
                      tasks={taskStore.items}
                      createTask={taskStore.create}
                      updateTask={taskStore.update}
                      deleteTask={taskStore.remove}
                    />
                  )}
                  {view === "prompts" && (
                    <PromptsView
                      project={project}
                      prompts={promptStore.items}
                      createPrompt={promptStore.create}
                      updatePrompt={promptStore.update}
                      deletePrompt={promptStore.remove}
                    />
                  )}
                {view === "notes" && (
                  <NotesView
                    project={project}
                    notes={notesStore.items}
                    activeNote={notesStore.activeNote}
                    readNote={notesStore.read}
                    createNote={notesStore.create}
                    saveNote={notesStore.saveActive}
                    updateNote={notesStore.updateNote}
                    deleteNote={notesStore.remove}
                  />
                )}
                  {view === "links" && (
                    <LinksView
                      project={project}
                      resources={resourceStore.items}
                      createResource={resourceStore.create}
                      updateResource={resourceStore.update}
                      deleteResource={resourceStore.remove}
                    />
                  )}
                {view === "calendar" && (
                  <CalendarView
                    project={project}
                    tasks={taskStore.items}
                    createTask={taskStore.create}
                    updateTask={taskStore.update}
                    deleteTask={taskStore.remove}
                    connectCalendar={async () => {
                      const url = await calendarStore.getConnectUrl();
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  />
                )}
                  {view === "settings" && (
                    <SettingsView
                      project={project}
                      updateProject={updateProject}
                      deleteProject={deleteProject}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      {hasProject && <CommandPalette />}
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
