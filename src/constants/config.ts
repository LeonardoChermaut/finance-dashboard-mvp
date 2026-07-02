export const AUTHENTICATION_COOKIE_NAME = 'financial_dashboard_session';

export const PENDING_WINDOW_DAYS = 5;

export const env = {
  NEXT_PUBLIC_DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  NEXT_PUBLIC_API_USER: process.env.NEXT_PUBLIC_API_USER || '',
  NEXT_PUBLIC_API_PASS: process.env.NEXT_PUBLIC_API_PASS || '',
} as const;
