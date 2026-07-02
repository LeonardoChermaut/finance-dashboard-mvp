'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar/sidebar';
import { useAuthStore, type UserRole } from '@/domains/auth';
import { routes } from '@/routes/routes';
import { breakpoints } from '@/lib/breakpoints';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing(4)};

  @media (min-width: ${breakpoints.tablet}) {
    margin-left: 64px;
    padding: ${({ theme }) => theme.spacing(8)};
  }
`;

const ProfileCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 480px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.15s ease;
  align-self: flex-start;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
`;

const UserName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const RoleBadge = styled.span<{ readonly $role: UserRole }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ theme, $role }) =>
    $role === 'admin' ? theme.colors.secondaryMuted : theme.colors.primaryMuted};
  color: ${({ theme, $role }) =>
    $role === 'admin' ? theme.colors.secondary : theme.colors.primary};
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

const InputIcon = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.muted};
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 13px;
  font-weight: 500;
  text-align: center;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();

  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'user');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      router.push(routes.login);
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    updateUser({ name, email, role });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <Layout>
      <Sidebar />
      <MainContent>
        <ProfileCard>
          <ProfileHeader>
            <BackButton type="button" onClick={() => router.push(routes.dashboard)}>
              <ArrowLeft size={16} />
              Voltar ao dashboard
            </BackButton>

            <AvatarSection>
              <Avatar aria-hidden="true">{initials}</Avatar>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <RoleBadge $role={user.role}>
                <Shield size={12} />
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </RoleBadge>
            </AvatarSection>
          </ProfileHeader>

          <Divider />

          <Form onSubmit={handleSubmit}>
            <FieldWrapper htmlFor="profile-name">
              <InputIcon>
                <User size={14} />
                Nome completo
              </InputIcon>
              <Input
                id="profile-name"
                type="text"
                value={name}
                autoComplete="name"
                placeholder="Seu nome"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </FieldWrapper>

            <FieldWrapper htmlFor="profile-email">
              <InputIcon>
                <Mail size={14} />
                Email
              </InputIcon>
              <Input
                id="profile-email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="seu@email.com"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </FieldWrapper>

            <FieldWrapper htmlFor="profile-role">
              <InputIcon>
                <Shield size={14} />
                Perfil de acesso
              </InputIcon>
              <Select
                id="profile-role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Select>
            </FieldWrapper>

            {isSuccess ? (
              <SuccessMessage role="status">Perfil atualizado com sucesso!</SuccessMessage>
            ) : null}

            <Button type="submit">
              <Save size={16} />
              Salvar alteracoes
            </Button>
          </Form>
        </ProfileCard>
      </MainContent>
    </Layout>
  );
};

export default ProfilePage;
