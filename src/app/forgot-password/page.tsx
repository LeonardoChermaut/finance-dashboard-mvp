'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing(3)} 0`};
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSuccess(true);
  };

  return (
    <PageWrapper>
      <LoginCard>
        <Heading>
          <LogoContainer>
            <LogoIcon aria-hidden="true">F</LogoIcon>
            <Title>Recuperar Senha</Title>
          </LogoContainer>
          <Subtitle>
            Informe seu email e enviaremos as instrucoes para redefinir sua senha.
          </Subtitle>
        </Heading>

        {isSuccess ? (
          <SuccessMessage role="status">
            Se o email estiver cadastrado, voce recebera as instrucoes de recuperacao em breve.
          </SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FieldWrapper htmlFor="forgot-email">
              Email
              <Input
                id="forgot-email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="seu@email.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </FieldWrapper>

            <Button type="submit" disabled={!email}>
              Enviar instrucoes
            </Button>

            <LinksContainer>
              <LinkButton type="button" onClick={() => router.push(routes.login)}>
                Voltar ao login
              </LinkButton>
            </LinksContainer>
          </Form>
        )}
      </LoginCard>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
