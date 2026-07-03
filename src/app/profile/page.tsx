'use client';

import {
  Avatar,
  AvatarSection,
  BackButton,
  Divider,
  FieldWrapper,
  Form,
  Input,
  InputIcon,
  Layout,
  MainContent,
  ProfileCard,
  ProfileHeader,
  RoleBadge,
  Select,
  SuccessMessage,
  UserEmail,
  UserName,
} from '@/app/profile/profile.styled';
import { Sidebar } from '@/components/sidebar/sidebar';
import { Button } from '@/components/ui/button';

import { useAuthStore, type UserRole } from '@/domains/auth';
import { routes } from '@/routes/routes';
import { ArrowLeft, Mail, Save, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

const ProfilePage = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'user');

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
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
