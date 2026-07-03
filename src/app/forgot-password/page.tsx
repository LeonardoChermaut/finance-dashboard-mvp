'use client';

import {
  FieldWrapper,
  Form,
  Heading,
  Input,
  LinkButton,
  LinksContainer,
  LoginCard,
  LogoContainer,
  LogoIcon,
  PageWrapper,
  Subtitle,
  SuccessMessage,
  Title,
} from '@/app/forgot-password/forget-password.styled';
import { Button } from '@/components/ui/button';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
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
