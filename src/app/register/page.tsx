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
  Select,
} from '@/components/ui/field';
import { Form, LinkButton, LinksContainer, SuccessMessage } from '@/components/ui/form';
import { useForm } from '@/hooks/use-form';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';
import { registerSchema } from '@/modules/auth/auth.schemas';
import { setSessionCookie, useAuthStore } from '@/modules/auth';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const RegisterPage = () => {
  const router = useRouter();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { showPassword, togglePassword, InputIcon } = usePasswordVisibility();

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(registerSchema);

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user';
  }): Promise<void> => {
    setSessionCookie();
    setAuthenticated({ name: data.name, email: data.email, role: data.role });

    setTimeout(() => {
      window.location.href = routes.dashboard;
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

        <Form
          onSubmit={(formEvent: FormEvent<HTMLFormElement>) => {
            formEvent.preventDefault();
            void handleSubmit(() => onSubmit(values));
          }}
        >
          <FieldWrapper htmlFor="register-name">
            Nome completo
            <Input
              id="register-name"
              type="text"
              value={values.name ?? ''}
              autoComplete="name"
              placeholder="Seu nome"
              onChange={(event) => handleChange('name', event.target.value)}
              required
            />
          </FieldWrapper>

          <FieldWrapper htmlFor="register-email">
            Email
            <Input
              id="register-email"
              type="email"
              value={values.email ?? ''}
              autoComplete="email"
              placeholder="seu@email.com"
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </FieldWrapper>

          <FieldWrapper htmlFor="register-role">
            Perfil de acesso
            <Select
              id="register-role"
              value={values.role ?? 'user'}
              onChange={(event) => handleChange('role', event.target.value)}
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
                value={values.password ?? ''}
                autoComplete="new-password"
                placeholder="Minimo 6 caracteres"
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

          <FieldWrapper htmlFor="register-confirm-password">
            Confirmar senha
            <Input
              id="register-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={values.confirmPassword ?? ''}
              autoComplete="new-password"
              placeholder="Repita a senha"
              onChange={(event) => handleChange('confirmPassword', event.target.value)}
              required
            />
          </FieldWrapper>

          {errors.name || errors.email || errors.password || errors.confirmPassword ? (
            <ErrorMessage role="alert">
              {errors.name ?? errors.email ?? errors.password ?? errors.confirmPassword}
            </ErrorMessage>
          ) : null}

          <Button
            type="submit"
            disabled={!values.name || !values.email || !values.password || !values.confirmPassword}
          >
            Criar conta
          </Button>

          <LinksContainer $justify="center">
            <LinkButton type="button" onClick={() => router.push(routes.login)}>
              Ja tem uma conta? Entrar
            </LinkButton>
          </LinksContainer>
        </Form>

        {isSubmitting ? (
          <SuccessMessage role="status">Conta criada com sucesso! Redirecionando...</SuccessMessage>
        ) : null}
      </LoginCard>
    </PageWrapper>
  );
};

export default RegisterPage;
