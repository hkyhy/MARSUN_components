import { create } from 'zustand';

interface AppState {
  siderCollapsed: boolean;
  toggleSider: () => void;
  setSiderCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  siderCollapsed: false,

  toggleSider: () => set((state) => ({ siderCollapsed: !state.siderCollapsed })),

  setSiderCollapsed: (collapsed) => set({ siderCollapsed: collapsed }),
}));
