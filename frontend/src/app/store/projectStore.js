import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, unwrap } from "../../services/api.js";

export const useProjectStore = create(persist((set, get) => ({
  projects: [],
  currentProjectId: null,
  loading: false,
  initialized: false,
  error: "",
  async fetchProjects() {
    set({ loading: true, error: "" });
    try {
      const projects = await api.get("/projects").then(unwrap);
      const currentId = get().currentProjectId;
      const currentExists = projects.some((project) => project._id === currentId);
      set({
        projects,
        currentProjectId: currentExists ? currentId : projects[0]?._id || null,
        loading: false,
        initialized: true
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Unable to load projects",
        loading: false,
        initialized: true
      });
    }
  },
  async createProject(payload) {
    const project = await api.post("/projects", { color: "#3B82F6", ...payload }).then(unwrap);
    set({ projects: [project, ...get().projects], currentProjectId: project._id, error: "" });
    return project;
  },
  async updateProject(id, payload) {
    const project = await api.patch(`/projects/${id}`, payload).then(unwrap);
    set({ projects: get().projects.map((item) => (item._id === id ? project : item)) });
    return project;
  },
  async deleteProject(id) {
    await api.delete(`/projects/${id}`);
    const projects = get().projects.filter((item) => item._id !== id);
    set({ projects, currentProjectId: projects[0]?._id || null });
  },
  setCurrentProject(id) {
    set({ currentProjectId: id });
  },
  currentProject() {
    return get().projects.find((project) => project._id === get().currentProjectId);
  }
}), { name: "devflow-projects", partialize: (state) => ({ currentProjectId: state.currentProjectId }) }));
