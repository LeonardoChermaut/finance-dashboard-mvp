export const AUTHENTICATED_COOKIE_VALUE = 'authenticated';
export const NAME_CHANGE_LIMIT = 3;
export const API_PAGE_SIZE = 10000;
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;
export const NAME_CHANGE_WINDOW_MS = 24 * 60 * 60 * 1000;

export const THEME_STORAGE_KEY = 'financial_dashboard_theme';
export const FILTERS_STORAGE_KEY = 'financial_dashboard_filters';
export const AUTHENTICATION_COOKIE_NAME = 'financial_dashboard_session';
export const NAME_CHANGES_STORAGE_KEY = 'financial_dashboard_name_changes';
export const USER_NAME_STORAGE_KEY = 'financial_dashboard_user_name';

export const PROTECTED_ROUTES = ['/dashboard', '/profile'] as const;
export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/confirm-email'] as const;

export const env = {
  NEXT_PUBLIC_DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  NEXT_PUBLIC_API_USER: process.env.NEXT_PUBLIC_API_USER || '',
  NEXT_PUBLIC_API_PASS: process.env.NEXT_PUBLIC_API_PASS || '',
} as const;
