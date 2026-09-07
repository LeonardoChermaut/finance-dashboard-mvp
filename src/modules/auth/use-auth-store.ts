import { AUTHENTICATION_COOKIE_NAME, USER_NAME_STORAGE_KEY } from '@/constants/config';
import type { AuthState } from '@/modules/auth/auth.types';
import { clearSessionCookie, hasSessionCookie } from '@/modules/auth/session-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getPersistedName = (): string | null => {
  try {
    return localStorage.getItem(USER_NAME_STORAGE_KEY)?.replace(/"/g, '') ?? null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      clearAuth: () => {
        clearSessionCookie();
        try {
          localStorage.removeItem(USER_NAME_STORAGE_KEY);
        } catch {}
        set({ isAuthenticated: false, user: null });
      },

      setAuthenticated: (user) =>
        set((state) => ({
          isAuthenticated: true,
          user: {
            name: state.user?.name ?? getPersistedName() ?? user.name,
            email: user.email,
            role: user.role ?? state.user?.role ?? 'user',
          },
        })),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),

    {
      name: AUTHENTICATION_COOKIE_NAME,
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          return persistedState as AuthState;
        }
        return persistedState as AuthState;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        if (typeof window !== 'undefined' && !hasSessionCookie()) {
          state.clearAuth();
          return;
        }

        if (!state.isAuthenticated) {
          clearSessionCookie();
        }
      },
    },
  ),
);
