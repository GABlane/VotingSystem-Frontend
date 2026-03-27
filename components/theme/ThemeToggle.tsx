'use client';

import { useThemeStore } from '@/store/theme';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const icons = {
    light: '☀️',
    dark: '🌙',
    system: '💻',
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn-secondary text-sm flex items-center gap-2"
      title={`Current theme: ${theme}`}
    >
      <span>{icons[theme]}</span>
      <span className="hidden md:inline">Theme</span>
    </button>
  );
}
