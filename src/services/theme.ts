import { useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'srijantech_theme';

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light') return 'light';
    return 'dark'; // default theme
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }

  window.dispatchEvent(new CustomEvent('srijantech_theme_changed', { detail: { theme } }));
}

export function toggleTheme(): ThemeMode {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function useTheme(): {
  theme: ThemeMode;
  isDark: boolean;
  toggle: () => void;
  setTheme: (t: ThemeMode) => void;
} {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    // Ensure document reflects stored theme immediately on mount
    applyTheme(theme);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
      } else {
        setThemeState(getStoredTheme());
      }
    };

    window.addEventListener('srijantech_theme_changed', handleThemeChange);
    return () => {
      window.removeEventListener('srijantech_theme_changed', handleThemeChange);
    };
  }, []);

  const toggle = () => {
    toggleTheme();
  };

  const setTheme = (t: ThemeMode) => {
    applyTheme(t);
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggle,
    setTheme,
  };
}
