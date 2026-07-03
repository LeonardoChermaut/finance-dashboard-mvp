export const AUTHENTICATION_COOKIE_NAME = 'financial_dashboard_session';
export const SIDEBAR_STATE_KEY = 'financial_dashboard_sidebar_expanded';
export const THEME_STORAGE_KEY = 'financial_dashboard_theme';

export const env = {
  NEXT_PUBLIC_DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  NEXT_PUBLIC_API_USER: process.env.NEXT_PUBLIC_API_USER || '',
  NEXT_PUBLIC_API_PASS: process.env.NEXT_PUBLIC_API_PASS || '',
} as const;
