import { create } from "zustand";

const STORAGE_KEY = "vita_auxilium_active_environment";

function loadInitialEnvironment() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const useEnvironmentStore = create((set) => ({
  currentEnvironment: loadInitialEnvironment(),

  selectEnvironment: (environment) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(environment));
    } catch (e) {
      console.warn("Não foi possível salvar o ambiente no sessionStorage", e);
    }
    set({ currentEnvironment: environment });
  },

  clearEnvironment: () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Não foi possível remover o ambiente do sessionStorage", e);
    }
    set({ currentEnvironment: null });
  },
}));
