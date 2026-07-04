import { AUTHENTICATION_COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from '@/constants/config';
import { api } from '@/lib/api';
import { MOCK_USERS } from '@/mocks/users';
import type { AuthSession, Credentials } from '@/modules/auth/auth.types';

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
