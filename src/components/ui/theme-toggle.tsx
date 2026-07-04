'use client';

import { useThemeMode } from '@/theme';
import { Moon, Sun } from 'lucide-react';
import type { ComponentProps } from 'react';

type ThemeToggleProps = Omit<ComponentProps<'button'>, 'onClick' | 'aria-label'> & {
  $size?: number;
};

export const ThemeToggle = ({ $size = 18, ...rest }: ThemeToggleProps) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      {...rest}
    >
      {mode === 'light' ? <Moon size={$size} /> : <Sun size={$size} />}
    </button>
  );
};
