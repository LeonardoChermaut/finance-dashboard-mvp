export const theme = {
  colors: {
    background: '#f1f5f9',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    primary: '#0f766e',
    income: '#0f766e',
    expense: '#dc2626',
  },
  radius: '12px',
  spacing: (multiplier: number): string => `${multiplier * 4}px`,
} as const;

export type AppTheme = typeof theme;
