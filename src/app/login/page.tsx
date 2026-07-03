'use client';

import {
  Heading,
  LoginCard,
  LogoContainer,
  LogoIcon,
  PageWrapper,
  Subtitle,
  Title,
} from '@/components/ui/auth-layout';
import { Button } from '@/components/ui/button';
import {
  ErrorMessage,
  FieldWrapper,
  Input,
  InputContainer,
  PasswordInput,
  PasswordToggle,
} from '@/components/ui/field';
import { Form, LinkButton, LinksContainer } from '@/components/ui/form';
import { env } from '@/constants/config';
import {
  createMockAuthService,
  createRealAuthService,
  setSessionCookie,
  useAuthStore,
} from '@/domains/auth';
import { useForm } from '@/hooks/use-form';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';
import { loginSchema } from '@/domains/auth/auth.schemas';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const getAuthService = () =>
  env.NEXT_PUBLIC_DATA_SOURCE === 'api' ? createRealAuthService() : createMockAuthService();

const LoginPage = () => {
  const router = useRouter();
  const authService = getAuthService();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();

  const { values, errors, handleChange, handleSubmit, setErrors } = useForm(loginSchema);

  const onSubmit = async (data: { email: string; password: string }): Promise<void> => {
    try {
      const { user } = await authService.login({ email: data.email, password: data.password });
      setSessionCookie();
      setAuthenticated(user);
      router.push(routes.dashboard);
    } catch {
      setErrors({ email: 'Credenciais invalidas. Tente novamente.' });
    }
  };

  return (
    <PageWrapper>
      <LoginCard>
        <Heading>
          <LogoContainer>
            <LogoIcon aria-hidden="true">F</LogoIcon>
            <Title>Financeiro</Title>
          </LogoContainer>
          <Subtitle>Entre com suas credenciais para acessar o painel financeiro.</Subtitle>
        </Heading>

        <Form
          onSubmit={(formEvent: FormEvent<HTMLFormElement>) => {
            formEvent.preventDefault();
            void handleSubmit(() => onSubmit(values));
          }}
        >
          <FieldWrapper htmlFor="login-email">
            Email
            <Input
              id="login-email"
              type="email"
              value={values.email ?? ''}
              autoComplete="email"
              placeholder="seu@email.com"
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </FieldWrapper>

          <FieldWrapper htmlFor="login-password">
            Senha
            <InputContainer>
              <PasswordInput
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password ?? ''}
                autoComplete="current-password"
                placeholder="Sua senha"
                onChange={(event) => handleChange('password', event.target.value)}
                required
              />
              <PasswordToggle
                type="button"
                onClick={togglePassword}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                tabIndex={-1}
              >
                <InputIcon size={18} />
              </PasswordToggle>
            </InputContainer>
          </FieldWrapper>

          {errors.email ? <ErrorMessage role="alert">{errors.email}</ErrorMessage> : null}

          <Button type="submit" disabled={!values.email || !values.password}>
            Entrar
          </Button>

          <LinksContainer>
            <LinkButton type="button" onClick={() => router.push(routes.forgotPassword)}>
              Esqueci minha senha
            </LinkButton>
            <LinkButton type="button" onClick={() => router.push(routes.register)}>
              Criar conta
            </LinkButton>
          </LinksContainer>
        </Form>
      </LoginCard>
    </PageWrapper>
  );
};

export default LoginPage;
