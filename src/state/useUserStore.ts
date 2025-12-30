import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  colorTheme: 'orange' | 'blue' | 'green' | 'red';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setColorTheme: (colorTheme: 'orange' | 'blue' | 'green' | 'red') => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      theme: 'light',
      colorTheme: 'orange', // Default to orange theme

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setColorTheme: (colorTheme) => {
        set({ colorTheme });
        // Remove all color theme classes
        document.documentElement.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-red');
        // Add the new color theme class
        document.documentElement.classList.add(`theme-${colorTheme}`);
        // Store in localStorage for persistence
        localStorage.setItem('papermorph-color-theme', colorTheme);
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      login: async (email, password) => {
        set({ isLoading: true });
        // Placeholder - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        // Placeholder - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({
          user: {
            id: '1',
            email,
            name,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'papermorph-user',
      partialize: (state) => ({ theme: state.theme, colorTheme: state.colorTheme }),
    }
  )
);
