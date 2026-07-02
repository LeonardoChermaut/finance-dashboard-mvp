export type AuthSession = {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
};

export interface AuthApiService {
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
}
