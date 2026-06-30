import { create } from "zustand";

export const useUiStore = create((set) => ({
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  kanbanSort: { field: "position", direction: "asc" },
  setKanbanSort: (kanbanSort) => set({ kanbanSort })
}));
