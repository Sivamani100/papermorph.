import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme before React renders
const savedTheme = localStorage.getItem('papermorph-user');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    if (parsed.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Default to light theme if parsing fails
    document.documentElement.classList.remove('dark');
  }
} else {
  // Default to light theme
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
