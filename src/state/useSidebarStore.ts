import { create } from 'zustand';

interface SidebarState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  leftCollapsed: false,
  rightCollapsed: false,
  setLeftCollapsed: (collapsed) => set({ leftCollapsed: collapsed }),
  setRightCollapsed: (collapsed) => set({ rightCollapsed: collapsed }),
}));
