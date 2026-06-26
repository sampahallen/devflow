import { create } from "zustand";
import { api, unwrap } from "../../services/api.js";

export const useCalendarStore = create((set) => ({
  connectUrl: "",
  async getConnectUrl() {
    const data = await api.get("/calendar/connect").then(unwrap);
    set({ connectUrl: data.url });
    return data.url;
  },
  syncTask: (taskId) => api.post(`/calendar/tasks/${taskId}/sync`).then(unwrap)
}));
