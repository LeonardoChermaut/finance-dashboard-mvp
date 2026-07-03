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
import { FieldWrapper, Input } from '@/components/ui/field';
import { Form, LinkButton, LinksContainer, SuccessMessage } from '@/components/ui/form';
import { forgotPasswordSchema } from '@/domains/auth/auth.schemas';
import { useForm } from '@/hooks/use-form';
import { routes } from '@/routes/routes';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const { values, isSubmitting, handleChange, handleSubmit } = useForm(forgotPasswordSchema);

  const onSubmit = async (): Promise<void> => {};

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

        <Form
          onSubmit={(formEvent: FormEvent<HTMLFormElement>) => {
            formEvent.preventDefault();
            void handleSubmit(() => onSubmit());
          }}
        >
          <FieldWrapper htmlFor="forgot-email">
            Email
            <Input
              id="forgot-email"
              type="email"
              value={values.email ?? ''}
              autoComplete="email"
              placeholder="seu@email.com"
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </FieldWrapper>

          <Button type="submit" disabled={!values.email}>
            Enviar instrucoes
          </Button>

          <LinksContainer $justify="center">
            <LinkButton type="button" onClick={() => router.push(routes.login)}>
              Voltar ao login
            </LinkButton>
          </LinksContainer>
        </Form>

        {isSubmitting ? (
          <SuccessMessage $padding role="status">
            Se o email estiver cadastrado, você receberá as instruções de recuperação em breve.
          </SuccessMessage>
        ) : null}
      </LoginCard>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
