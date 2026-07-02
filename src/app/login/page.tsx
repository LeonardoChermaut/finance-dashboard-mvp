'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createMockAuthService, setSessionCookie, useAuthStore } from '@/domains/auth';
import { usePasswordVisibility } from '@/hooks';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';

const PageWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 400px;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 18px;
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const FieldWrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const LinkButton = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  font-weight: 500;
`;

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();

  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const authService = createMockAuthService();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
