import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("token"),
  user: (() => {
    const t = localStorage.getItem("token");
    return t ? jwtDecode(t) : null;
  })(),

  setToken: (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    set({ token, user: jwtDecode(token) });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  isAuthenticated: () => !!localStorage.getItem("token"),
}));