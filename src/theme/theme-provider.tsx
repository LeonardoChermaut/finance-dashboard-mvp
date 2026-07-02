'use client';

import { darkTheme } from '@/theme/dark-theme';
import { lightTheme } from '@/theme/light-theme';
import type { ThemeMode } from '@/theme/theme-storage';
import { getStoredTheme, storeTheme } from '@/theme/theme-storage';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

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

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== mode) {
      setMode(stored);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((previous) => {
      const next = previous === 'light' ? 'dark' : 'light';
      storeTheme(next);
      return next;
    });
  }, []);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
