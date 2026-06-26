import { create } from "zustand";

export const useUiStore = create((set) => ({
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  kanbanSort: { field: "priority", direction: "desc" },
  setKanbanSort: (kanbanSort) => set({ kanbanSort })
}));
