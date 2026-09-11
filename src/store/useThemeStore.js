import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: true, // Default to Dark Mode for 2026 AI SaaS experience
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
}));
