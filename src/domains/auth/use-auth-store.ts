import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

export type AuthState = Readonly<{
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole } | null;

  clearAuth: () => void;
  setAuthenticated: (user: { name: string; email: string; role?: UserRole }) => void;
  updateUser: (updates: Partial<{ name: string; email: string; role: UserRole }>) => void;
}>;

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
    { name: 'financial_dashboard_session' },
  ),
);
