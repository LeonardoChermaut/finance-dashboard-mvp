import {
  AUTHENTICATED_COOKIE_VALUE,
  AUTHENTICATION_COOKIE_NAME,
  COOKIE_MAX_AGE_SECONDS,
} from '@/constants/config';

export const setSessionCookie = (): void => {
  document.cookie = `${AUTHENTICATION_COOKIE_NAME}=${AUTHENTICATED_COOKIE_VALUE}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const clearSessionCookie = (): void => {
  document.cookie = `${AUTHENTICATION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};
