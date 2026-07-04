import {
  clearSessionCookie,
  createMockAuthService,
  setSessionCookie,
} from '@/modules/auth/auth-service';

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
});

describe('createMockAuthService', () => {
  const authService = createMockAuthService();

  it('Returns auth session for valid credentials', async () => {
    const session = await authService.login({
      email: 'admin@empresa.com',
      password: 'admin123',
    });

    expect(session).toEqual({
      user: { name: 'Admin', email: 'admin@empresa.com' },
    });
  });

  it('Throws error for invalid credentials', async () => {
    await expect(
      authService.login({ email: 'wrong@example.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('Resolves logout without error', async () => {
    await expect(authService.logout()).resolves.toBeUndefined();
  });

  it('Returns session with user object containing name and email', async () => {
    const session = await authService.login({
      email: 'admin@empresa.com',
      password: 'admin123',
    });

    expect(session.user).toHaveProperty('name');
    expect(session.user).toHaveProperty('email');
    expect(typeof session.user.name).toBe('string');
    expect(typeof session.user.email).toBe('string');
  });

  it('Rejects with error message for non-existent user', async () => {
    await expect(
      authService.login({ email: 'nonexistent@example.com', password: 'password123' }),
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('setSessionCookie', () => {
  it('Sets authentication cookie', () => {
    setSessionCookie();

    expect(document.cookie).toContain('financial_dashboard_session=authenticated');
    expect(document.cookie).toContain('path=/');
    expect(document.cookie).toContain('SameSite=Lax');
  });
});

describe('clearSessionCookie', () => {
  it('Clears authentication cookie', () => {
    document.cookie = 'financial_dashboard_session=authenticated; path=/';
    clearSessionCookie();

    expect(document.cookie).not.toContain('financial_dashboard_session=authenticated');
  });
});
