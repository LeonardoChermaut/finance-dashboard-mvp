'use client';

import {
  ErrorMessage,
  FieldWrapper,
  Form,
  Heading,
  Input,
  InputContainer,
  LinkButton,
  LinksContainer,
  LoginCard,
  LogoContainer,
  LogoIcon,
  PageWrapper,
  PasswordInput,
  PasswordToggle,
  Subtitle,
  Title,
} from '@/app/login/login.styled';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import {
  createMockAuthService,
  createRealAuthService,
  setSessionCookie,
  useAuthStore,
} from '@/domains/auth';
import { usePasswordVisibility } from '@/hooks';
import { routes } from '@/routes/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

const getAuthService = () =>
  env.NEXT_PUBLIC_DATA_SOURCE === 'api' ? createRealAuthService() : createMockAuthService();

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const router = useRouter();
  const authService = getAuthService();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setHasError(false);

    try {
      const { user } = await authService.login({ email, password });
      setSessionCookie();
      setAuthenticated(user);
      router.push(routes.dashboard);
    } catch {
      setHasError(true);
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

        <Form onSubmit={handleSubmit}>
          <FieldWrapper htmlFor="login-email">
            Email
            <Input
              id="login-email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="seu@email.com"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </FieldWrapper>

          <FieldWrapper htmlFor="login-password">
            Senha
            <InputContainer>
              <PasswordInput
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                placeholder="Sua senha"
                onChange={(event) => setPassword(event.target.value)}
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

          {hasError ? (
            <ErrorMessage role="alert">Credenciais invalidas. Tente novamente.</ErrorMessage>
          ) : null}

          <Button type="submit" disabled={!email || !password}>
            Entrar
          </Button>

          <LinksContainer>
            <Link href={routes.forgotPassword} passHref>
              <LinkButton as="a">Esqueci minha senha</LinkButton>
            </Link>
            <Link href={routes.register} passHref>
              <LinkButton as="a">Criar conta</LinkButton>
            </Link>
          </LinksContainer>
        </Form>
      </LoginCard>
    </PageWrapper>
  );
};

export default LoginPage;
