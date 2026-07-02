import { AUTHENTICATION_COOKIE_NAME } from '@/constants/config';
import type { AuthSession, Credentials } from '@/domains/auth/auth.types';
import { api } from '@/lib/api';
import { MOCK_USERS } from '@/mocks/users';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

export type AuthService = Readonly<{
  login: (credentials: Credentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
}>;

export const createMockAuthService = (): AuthService => ({
  login: (credentials: Credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (user) => user.email === credentials.email && user.password === credentials.password,
        );

        if (user) {
          resolve({ user: { name: user.name, email: user.email } });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 300);
    });
  },
  logout: () => new Promise((resolve) => setTimeout(resolve, 100)),
});

export const createRealAuthService = (): AuthService => ({
  login: async (credentials: Credentials) =>
    await api.post<AuthSession, Credentials>('/auth/login', credentials),
  logout: async () => await Promise.resolve(),
});

export const setSessionCookie = (): void => {
  document.cookie = `${AUTHENTICATION_COOKIE_NAME}=authenticated; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const clearSessionCookie = (): void => {
  document.cookie = `${AUTHENTICATION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};
