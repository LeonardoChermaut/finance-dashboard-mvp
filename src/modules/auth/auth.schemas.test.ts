import { forgotPasswordSchema, loginSchema, registerSchema } from './auth.schemas';

describe('Login Schema', () => {
  it('Validates correct login data', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '123' });
    expect(result.success).toBe(true);
  });

  it('Rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '123' });
    expect(result.success).toBe(false);
  });

  it('Rejects empty email', () => {
    const result = loginSchema.safeParse({ email: '', password: '123' });
    expect(result.success).toBe(false);
  });

  it('Rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('Rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('Register Schema', () => {
  const validRegisterData = {
    name: 'Joao',
    email: 'joao@test.com',
    password: '123456',
    confirmPassword: '123456',
    role: 'user' as const,
  };

  it('Validates correct register data', () => {
    const result = registerSchema.safeParse(validRegisterData);
    expect(result.success).toBe(true);
  });

  it('Rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, name: 'J' });
    expect(result.success).toBe(false);
  });

  it('Rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('Rejects password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, password: '12345' });
    expect(result.success).toBe(false);
  });

  it('Rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validRegisterData,
      confirmPassword: '654321',
    });
    expect(result.success).toBe(false);
  });

  it('Rejects invalid role', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, role: 'superadmin' });
    expect(result.success).toBe(false);
  });

  it('Accepts admin role', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, role: 'admin' });
    expect(result.success).toBe(true);
  });

  it('Rejects empty confirmPassword', () => {
    const result = registerSchema.safeParse({ ...validRegisterData, confirmPassword: '' });
    expect(result.success).toBe(false);
  });
});

describe('Forgot Password Schema', () => {
  it('Validates correct email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@test.com' });
    expect(result.success).toBe(true);
  });

  it('Rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('Rejects empty email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('Rejects missing email field', () => {
    const result = forgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('Rejects email without domain', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'test@' });
    expect(result.success).toBe(false);
  });
});
