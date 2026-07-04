import { AUTHENTICATION_COOKIE_NAME } from '@/constants/config';
import type { AuthState } from '@/modules/auth/auth.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      clearAuth: () => set({ isAuthenticated: false, user: null }),

      setAuthenticated: (user) =>
        set({ isAuthenticated: true, user: { ...user, role: user.role ?? 'user' } }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),

    { name: AUTHENTICATION_COOKIE_NAME },
  ),
);
