export type UserRole = 'admin' | 'user';

export type Credentials = Readonly<{
  email: string;
  password: string;
}>;

export type AuthSession = {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
};

export type AuthState = Readonly<{
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole } | null;

  clearAuth: () => void;
  setAuthenticated: (user: { name: string; email: string; role?: UserRole }) => void;
  updateUser: (updates: Partial<{ name: string; email: string; role: UserRole }>) => void;
}>;
