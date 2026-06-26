import { create } from "zustand";
import { api, unwrap } from "../../services/api.js";

export const useNotesStore = create((set, get) => ({
  items: [],
  loading: false,
  error: "",
  activeNote: null,
  async fetch(projectId, q = "") {
    if (!projectId) {
      set({ items: [], activeNote: null, loading: false });
      return;
    }
    set({ loading: true, error: "" });
    try {
      const items = await api.get("/notes", { params: { projectId, q } }).then(unwrap);
      set({ items, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || "Unable to load notes", loading: false });
    }
  },
  async create(payload) {
    const item = await api.post("/notes", payload).then(unwrap);
    set({ items: [item, ...get().items] });
    return item;
  },
  async read(id) {
    const activeNote = await api.get(`/notes/${id}`).then(unwrap);
    set({ activeNote });
  },
  async saveActive(content) {
    const note = get().activeNote;
    if (!note) return;
    const activeNote = await api.patch(`/notes/${note._id}`, { content, title: note.title, path: note.path }).then(unwrap);
    set({ activeNote: { ...activeNote, content } });
  },
  async updateNote(id, payload) {
    const note = await api.patch(`/notes/${id}`, payload).then(unwrap);
    const content = get().activeNote?._id === id ? get().activeNote.content : undefined;
    set({
      items: get().items.map((entry) => (entry._id === id ? note : entry)),
      activeNote: get().activeNote?._id === id ? { ...note, content } : get().activeNote
    });
    return note;
  },
  async remove(id) {
    await api.delete(`/notes/${id}`);
    set({ items: get().items.filter((entry) => entry._id !== id), activeNote: get().activeNote?._id === id ? null : get().activeNote });
  }
}));
