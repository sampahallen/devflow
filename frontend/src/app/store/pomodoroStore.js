import { create } from "zustand";
import { api, unwrap } from "../../services/api.js";

export const usePomodoroStore = create((set) => ({
  running: false,
  secondsLeft: 25 * 60,
  selectedTaskId: "",
  sessions: [],
  setSessions: (sessions) => set({ sessions }),
  setRunning: (running) => set({ running }),
  reset: () => set({ running: false, secondsLeft: 25 * 60 }),
  tick: () => set((state) => ({ secondsLeft: Math.max(0, state.secondsLeft - 1) })),
  setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),
  async complete(projectId, taskId) {
    const data = await api.post("/pomodoro/complete", { projectId, taskId, minutes: 25 }).then(unwrap);
    set((state) => ({ sessions: [data, ...state.sessions], running: false, secondsLeft: 25 * 60 }));
  }
}));
