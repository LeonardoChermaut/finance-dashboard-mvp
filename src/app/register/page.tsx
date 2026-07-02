'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/domains/auth';
import { usePasswordVisibility } from '@/hooks';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
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
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

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
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  font-weight: 500;
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  font-weight: 500;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
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

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();

  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setHasError(false);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setHasError(true);
      setErrorMessage('As senhas nao coincidem.');
      return;
    }

    if (password.length < 6) {
      setHasError(true);
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setAuthenticated({ name, email, role });
    setIsSuccess(true);

    setTimeout(() => {
      router.push(routes.dashboard);
    }, 1500);
  };

  return (
    <PageWrapper>
      <LoginCard>
        <Heading>
          <LogoContainer>
            <LogoIcon aria-hidden="true">F</LogoIcon>
            <Title>Criar Conta</Title>
          </LogoContainer>
          <Subtitle>Preencha os dados abaixo para criar sua conta.</Subtitle>
        </Heading>

        {isSuccess ? (
          <SuccessMessage role="status">Conta criada com sucesso! Redirecionando...</SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FieldWrapper htmlFor="register-name">
              Nome completo
              <Input
                id="register-name"
                type="text"
                value={name}
                autoComplete="name"
                placeholder="Seu nome"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </FieldWrapper>

            <FieldWrapper htmlFor="register-email">
              Email
              <Input
                id="register-email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="seu@email.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </FieldWrapper>

            <FieldWrapper htmlFor="register-role">
              Perfil de acesso
              <Select
                id="register-role"
                value={role}
                onChange={(event) => setRole(event.target.value as 'admin' | 'user')}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Select>
            </FieldWrapper>

            <FieldWrapper htmlFor="register-password">
              Senha
              <InputContainer>
                <PasswordInput
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  autoComplete="new-password"
                  placeholder="Minimo 6 caracteres"
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

            <FieldWrapper htmlFor="register-confirm-password">
              Confirmar senha
              <Input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                autoComplete="new-password"
                placeholder="Repita a senha"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </FieldWrapper>

            {hasError ? <ErrorMessage role="alert">{errorMessage}</ErrorMessage> : null}

            <Button type="submit" disabled={!name || !email || !password || !confirmPassword}>
              Criar conta
            </Button>

            <LinksContainer>
              <LinkButton type="button" onClick={() => router.push(routes.login)}>
                Ja tem uma conta? Entrar
              </LinkButton>
            </LinksContainer>
          </Form>
        )}
      </LoginCard>
    </PageWrapper>
  );
};

export default RegisterPage;
