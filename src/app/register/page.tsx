'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/domains/auth';
import { usePasswordVisibility } from '@/hooks';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import { useCallback, useState, type FormEvent } from 'react';

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
  Select,
  Subtitle,
  SuccessMessage,
  Title,
} from '@/app/register/register.styled';

const RegisterPage = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const router = useRouter();

  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
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
    },
    [name, email, password, confirmPassword, role],
  );

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
