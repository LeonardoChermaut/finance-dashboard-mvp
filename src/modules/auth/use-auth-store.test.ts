import { useAuthStore } from './use-auth-store';

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe('Use Auth Store', () => {
  it('Initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('Sets authenticated with user data', () => {
    useAuthStore.getState().setAuthenticated({ name: 'Joao', email: 'joao@test.com' });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Joao');
    expect(state.user?.email).toBe('joao@test.com');
  });

  it('Defaults role to user when not provided', () => {
    useAuthStore.getState().setAuthenticated({ name: 'Joao', email: 'joao@test.com' });
    const state = useAuthStore.getState();
    expect(state.user?.role).toBe('user');
  });

  it('Preserves provided role', () => {
    useAuthStore.getState().setAuthenticated({
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin',
    });
    const state = useAuthStore.getState();
    expect(state.user?.role).toBe('admin');
  });

  it('Clears auth state', () => {
    useAuthStore.getState().setAuthenticated({ name: 'Joao', email: 'joao@test.com' });
    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('Updates user data partially', () => {
    useAuthStore.getState().setAuthenticated({ name: 'Joao', email: 'joao@test.com' });
    useAuthStore.getState().updateUser({ name: 'Joao Silva' });
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('Joao Silva');
    expect(state.user?.email).toBe('joao@test.com');
  });

  it('Does not crash when updating user while unauthenticated', () => {
    useAuthStore.getState().updateUser({ name: 'Test' });
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
  });
});
