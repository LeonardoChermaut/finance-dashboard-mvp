'use client';

import {
  Avatar,
  AvatarSection,
  BackButton,
  Divider,
  InputIcon,
  Layout,
  MainContent,
  ProfileCard,
  ProfileHeader,
  RoleBadge,
  Tooltip,
  TooltipContainer,
  UserEmail,
  UserName,
} from '@/app/profile/profile.styled';
import { Sidebar } from '@/components/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { FieldWrapper, Form, Input, Select, SuccessMessage } from '@/components/ui';
import {
  NAME_CHANGE_LIMIT,
  NAME_CHANGES_STORAGE_KEY,
  USER_NAME_STORAGE_KEY,
} from '@/constants/config';
import { useLocalStorage } from '@/hooks';

import { useAuthStore, type UserRole } from '@/modules/auth';
import { routes } from '@/routes/routes';
import { filterRecentTimestamps } from '@/utils/profile';
import { getInitials } from '@/utils/string';
import { AlertTriangle, ArrowLeft, Mail, Save, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

const ProfilePage = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [nameChangeTimestamps, setNameChangeTimestamps] = useLocalStorage<number[]>(
    NAME_CHANGES_STORAGE_KEY,
    [],
  );

  const [persistedName, setPersistedName] = useLocalStorage<string>(
    USER_NAME_STORAGE_KEY,
    user?.name ?? '',
  );

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [name, setName] = useState<string>(persistedName || (user?.name ?? ''));
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'user');

  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push(routes.login);
    }
  }, [isHydrated, user, router]);

  const nameChangeInfo = useMemo(() => {
    const recentTimestamps = filterRecentTimestamps(nameChangeTimestamps);
    const remaining = NAME_CHANGE_LIMIT - recentTimestamps.length;

    return {
      canChange: remaining > 0,
      remaining,
      timestamps: recentTimestamps,
    };
  }, [nameChangeTimestamps]);

  if (!isHydrated || !user) {
    return null;
  }

  const initials = getInitials(persistedName || user.name);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nameChanged = name !== user.name;

    if (nameChanged) {
      if (!nameChangeInfo.canChange) {
        return;
      }

      setNameChangeTimestamps([...nameChangeInfo.timestamps, Date.now()]);
      setPersistedName(name);
    }

    updateUser({ name, email, role });
    setIsSuccess(true);
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
              <UserName>{persistedName || user.name}</UserName>
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
                {nameChangeInfo.remaining <= 1 && nameChangeInfo.remaining > 0 ? (
                  <TooltipContainer>
                    <AlertTriangle size={14} color="currentColor" />
                    <Tooltip>
                      {nameChangeInfo.remaining === 1
                        ? 'Ultima alteracao de nome disponivel esta semana'
                        : `Restam ${nameChangeInfo.remaining} alteracoes esta semana`}
                    </Tooltip>
                  </TooltipContainer>
                ) : null}
                {!nameChangeInfo.canChange ? (
                  <TooltipContainer>
                    <AlertTriangle size={14} color="currentColor" />
                    <Tooltip>
                      Limite de alteracoes atingido. Tente novamente na proxima semana.
                    </Tooltip>
                  </TooltipContainer>
                ) : null}
              </InputIcon>
              <Input
                id="profile-name"
                type="text"
                value={name}
                autoComplete="name"
                placeholder="Seu nome"
                disabled={!nameChangeInfo.canChange && name !== user.name}
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
