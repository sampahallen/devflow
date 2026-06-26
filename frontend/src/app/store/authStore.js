import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, unwrap } from "../../services/api.js";

export const useAuthStore = create(persist((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  async login(payload) {
    const data = await api.post("/auth/login", payload).then(unwrap);
    set(data);
  },
  async register(payload) {
    const data = await api.post("/auth/register", payload).then(unwrap);
    set(data);
  },
  logout() {
    set({ user: null, accessToken: null, refreshToken: null });
  }
}), { name: "devflow-auth" }));
