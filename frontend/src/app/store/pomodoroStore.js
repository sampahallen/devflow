import { create } from "zustand";
import { api, unwrap } from "../../services/api.js";

export const usePomodoroStore = create((set) => ({
  running: false,
  durationSeconds: 25 * 60,
  secondsLeft: 25 * 60,
  selectedTaskId: "",
  sessions: [],
  miniOpaque: false,
  setSessions: (sessions) => set({ sessions }),
  setRunning: (running) => set({ running }),
  start: () => set({ running: true }),
  pause: () => set({ running: false }),
  reset: () => set((state) => ({ running: false, secondsLeft: state.durationSeconds })),
  setDuration: (minutes) => set({
    running: false,
    durationSeconds: minutes * 60,
    secondsLeft: minutes * 60
  }),
  tick: () => set((state) => ({ secondsLeft: Math.max(0, state.secondsLeft - 1) })),
  setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),
  toggleMiniOpaque: () => set((state) => ({ miniOpaque: !state.miniOpaque })),
  async complete(projectId, taskId) {
    const minutes = Math.max(1, Math.round(usePomodoroStore.getState().durationSeconds / 60));
    const payload = taskId ? { projectId, taskId, minutes } : { projectId, minutes };
    const data = await api.post("/pomodoro/complete", payload).then(unwrap);
    set((state) => ({
      sessions: [data, ...state.sessions],
      running: false,
      secondsLeft: state.durationSeconds
    }));
  }
}));
