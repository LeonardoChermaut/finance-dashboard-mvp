export const themeRadius = {
  input: '12px',
  card: '16px',
  button: '12px',
  drawer: '20px',
} as const;

export const themeSpacing = (multiplier: number): string => `${multiplier * 4}px`;
