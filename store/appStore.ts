import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppState = {
  showBalance: boolean;
  theme: "light" | "dark";
};

type AppActions = {
  toggleTheme: (theme: "light" | "dark") => void;
  toggleShowBalance: () => void;
};

const initialState: AppState = {
  showBalance: true,
  theme: "dark",
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,
      toggleTheme: (theme) => set((state) => ({ ...state, theme })),
      toggleShowBalance: () => set((state) => ({ ...state, showBalance: !state.showBalance })),
    }),
    {
      name: "financas-app-store",
      storage: createJSONStorage(() => Storage),
      partialize: (state) => ({ theme: state.theme, showBalance: state.showBalance }),
    },
  ),
);
