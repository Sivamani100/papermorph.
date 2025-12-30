import { useEffect } from 'react';
import { useUserStore } from '@/state/useUserStore';

const ThemeInitializer = () => {
  const { theme, colorTheme, setTheme, setColorTheme } = useUserStore();

  useEffect(() => {
    // Apply theme to DOM on initial load and when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Apply color theme to DOM on initial load and when color theme changes
    document.documentElement.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-red');
    document.documentElement.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);

  // Apply theme immediately on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('papermorph-user');
    if (storedTheme) {
      const parsedTheme = JSON.parse(storedTheme);
      if (parsedTheme.state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Apply stored color theme
      if (parsedTheme.state?.colorTheme) {
        document.documentElement.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-red');
        document.documentElement.classList.add(`theme-${parsedTheme.state.colorTheme}`);
      }
    } else {
      // Apply default color theme (orange) if nothing is stored
      document.documentElement.classList.add('theme-orange');
    }
  }, []);

  return null;
};

export default ThemeInitializer;
