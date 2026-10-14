import { create } from "zustand";

type AppStateType = {
  showBalance: boolean;
  theme: "light" | "dark";
  toggleTheme: (theme: "light" | "dark") => void;
  toggleShowBalance: () => void;
};

const AppState: Partial<AppStateType> = {
  showBalance: false,
  theme: "dark",
};

export const useAppStore = create<Partial<AppStateType>>((set) => ({
  ...AppState,
  toggleTheme: (theme) => set((state) => ({ ...state, theme })),
  toggleShowBalance: () =>
    set((state) => ({ ...state, showBalance: !state.showBalance })),
}));
