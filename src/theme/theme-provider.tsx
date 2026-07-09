'use client';

import { THEME_STORAGE_KEY } from '@/constants/config';
import { useLocalStorage } from '@/hooks';
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
}>;

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {}

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useLocalStorage<ThemeMode>(THEME_STORAGE_KEY, getInitialTheme());
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const toggleTheme = useCallback(
    () => setMode((previous) => (previous === 'light' ? 'dark' : 'light')),
    [setMode],
  );

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${mode}`);
    setIsHydrated(true);
  }, [mode]);

  if (!isHydrated) {
    return <StyledThemeProvider theme={lightTheme}>{children}</StyledThemeProvider>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
