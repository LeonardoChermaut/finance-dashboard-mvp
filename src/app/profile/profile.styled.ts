import { Card } from '@/components/ui/card';
import { breakpoints } from '@/constants/breakpoints';
import { UserRole } from '@/modules/auth';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.main`
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

export const ProfileCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 480px;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const BackButton = styled.button`
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

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Avatar = styled.div`
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

export const UserName = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const UserEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

export const RoleBadge = styled.span<{ $role: UserRole }>`
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

export const InputIcon = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.muted};
`;

export const TooltipContainer = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing(2)};
  cursor: help;
`;

export const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.input};
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 10;

  ${TooltipContainer}:hover & {
    opacity: 1;
  }
`;
