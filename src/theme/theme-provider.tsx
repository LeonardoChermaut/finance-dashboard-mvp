'use client';

import { THEME_STORAGE_KEY } from '@/constants/config';
import { darkTheme } from '@/theme/dark-theme';
import { lightTheme } from '@/theme/light-theme';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = Readonly<{
  mode: ThemeMode;
  toggleTheme: () => void;
}>;

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = (): ThemeContextValue => useContext(ThemeContext);

type ThemeProviderProps = Readonly<{
  children: ReactNode;
  initialTheme?: ThemeMode;
}>;

export const ThemeProvider = ({ children, initialTheme = 'light' }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(initialTheme);

  const applyThemeToDom = useCallback((targetMode: ThemeMode) => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${targetMode}`);
    document.documentElement.setAttribute('data-theme', targetMode);
    document.documentElement.style.colorScheme = targetMode;
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${targetMode}`);
  }, []);

  const persistTheme = useCallback((targetMode: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(targetMode));
      document.cookie = `${THEME_STORAGE_KEY}=${targetMode}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((previous) => {
      const nextMode = previous === 'light' ? 'dark' : 'light';
      persistTheme(nextMode);
      return nextMode;
    });
  }, [persistTheme]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = stored.replace(/"/g, '') as ThemeMode;
        if ((parsed === 'dark' || parsed === 'light') && parsed !== mode) {
          setMode(parsed);
          return;
        }
      }

      if (
        !stored &&
        window.matchMedia?.('(prefers-color-scheme: dark)')?.matches &&
        mode !== 'dark'
      ) {
        setMode('dark');
      }
    } catch {}
  }, []);

  useEffect(() => {
    applyThemeToDom(mode);
  }, [mode, applyThemeToDom]);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
