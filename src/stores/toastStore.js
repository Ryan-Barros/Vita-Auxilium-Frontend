import { create } from "zustand";

export const useToastStore = create((set) => ({
  toast: null,

  showToast: (message, type = "info") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));