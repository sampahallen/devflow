import { create } from "zustand";
import { api, unwrap } from "../../services/api.js";

export function createEntityStore(endpoint) {
  return create((set, get) => ({
    items: [],
    loading: false,
    error: "",
    query: "",
    mergeItems(updates) {
      const byId = new Map(updates.map((item) => [item._id, item]));
      set({ items: get().items.map((item) => (byId.has(item._id) ? { ...item, ...byId.get(item._id) } : item)) });
    },
    async fetch(projectId, q = "") {
      if (!projectId) {
        set({ items: [], loading: false, query: q });
        return;
      }
      set({ loading: true, error: "", query: q });
      try {
        const items = await api.get(endpoint, { params: { projectId, q } }).then(unwrap);
        set({ items, loading: false });
      } catch (error) {
        set({ error: error.response?.data?.message || error.message || "Unable to load data", loading: false });
      }
    },
    async create(payload) {
      const item = await api.post(endpoint, payload).then(unwrap);
      set({ items: [item, ...get().items] });
      return item;
    },
    async update(id, payload) {
      const item = await api.patch(`${endpoint}/${id}`, payload).then(unwrap);
      set({ items: get().items.map((entry) => (entry._id === id ? item : entry)) });
      return item;
    },
    async remove(id) {
      await api.delete(`${endpoint}/${id}`);
      set({ items: get().items.filter((entry) => entry._id !== id) });
    }
  }));
}
