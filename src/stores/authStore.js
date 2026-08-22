import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  status: 'idle',

  fetchUser: async () => {
    set({ status: 'loading' });
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data, status: 'authenticated' });
    } catch {
      set({ user: null, status: 'unauthenticated' });
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, status: 'unauthenticated' });
  },
}));
