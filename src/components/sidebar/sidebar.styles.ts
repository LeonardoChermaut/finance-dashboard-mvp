import { breakpoints } from '@/constants/breakpoints';
import styled, { css, keyframes } from 'styled-components';

const EXPANDED_WIDTH = '240px';
const COLLAPSED_WIDTH = '64px';
const SIDEBAR_TRANSITION = '0.3s cubic-bezier(0.4, 0, 0.2, 1)';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const SidebarOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 40;
  animation: ${fadeIn} 0.2s ease;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

type SidebarContainerProps = {
  readonly $isExpanded: boolean;
  readonly $isMobileOpen: boolean;
};

export const SidebarContainer = styled.aside<SidebarContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.sidebarSurface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  transition:
    transform ${SIDEBAR_TRANSITION},
    width ${SIDEBAR_TRANSITION};
  overflow: hidden;
  width: ${EXPANDED_WIDTH};

  @media (max-width: ${breakpoints.tablet}) {
    width: ${EXPANDED_WIDTH};
    animation: ${({ $isMobileOpen }) => ($isMobileOpen ? slideIn : 'none')} 0.3s ease;
    transform: ${({ $isMobileOpen }) => ($isMobileOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }

  @media (min-width: ${breakpoints.tablet}) {
    width: ${({ $isExpanded }) => ($isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH)};
    transform: translateX(0);
  }
`;

export const SidebarHeader = styled.div<{ readonly $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) => ($isExpanded ? 'space-between' : 'center')};
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(5)} ${theme.spacing(4)}` : `${theme.spacing(5)} 0`};
  min-height: 64px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  overflow: hidden;
  min-width: 0;
  flex-shrink: 1;
`;

export const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`;

const sidebarTextCollapsed = css`
  opacity: 0;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
`;

export const LogoText = styled.span<{ readonly $isExpanded: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.sidebarText};
  white-space: nowrap;
  transition:
    opacity 0.2s ease,
    width 0.2s ease;
  overflow: hidden;
  min-width: 0;

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) => !$isExpanded && sidebarTextCollapsed}
  }
`;

export const CollapseButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.sidebarMuted};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.sidebarText};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.border};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
  }
`;

export const SidebarNav = styled.nav<{ readonly $isExpanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme, $isExpanded }) => ($isExpanded ? `0 ${theme.spacing(3)}` : '0')};
  flex: 1;
`;

type NavItemProps = {
  readonly $isActive?: boolean;
  readonly $isExpanded: boolean;
};

export const NavItem = styled.button<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme, $isExpanded }) => ($isExpanded ? theme.spacing(3) : '0')};
  width: 100%;
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(3)} ${theme.spacing(3)}` : `${theme.spacing(3)} 0`};
  justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.sidebarActive : theme.colors.sidebarText};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primaryMuted : 'transparent'};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  white-space: nowrap;
  position: relative;

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primaryMuted : theme.colors.sidebarHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) =>
      !$isExpanded &&
      css`
        padding-left: 0;
        padding-right: 0;
      `}
  }
`;

export const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export const NavLabel = styled.span<{ readonly $isExpanded: boolean }>`
  white-space: nowrap;
  transition:
    opacity 0.2s ease,
    width 0.2s ease;
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) => !$isExpanded && sidebarTextCollapsed}
  }
`;

export const SidebarFooter = styled.div<{ readonly $isExpanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(3)} ${theme.spacing(3)}` : `${theme.spacing(3)} 0`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

type FooterItemProps = {
  readonly $isExpanded: boolean;
};

export const FooterItem = styled.button<FooterItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme, $isExpanded }) => ($isExpanded ? theme.spacing(3) : '0')};
  width: 100%;
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(3)} ${theme.spacing(3)}` : `${theme.spacing(3)} 0`};
  justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.sidebarText};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) =>
      !$isExpanded &&
      css`
        padding-left: 0;
        padding-right: 0;
      `}
  }
`;

export const FooterLabel = styled.span<{ readonly $isExpanded: boolean }>`
  white-space: nowrap;
  transition:
    opacity 0.2s ease,
    width 0.2s ease;
  overflow: hidden;

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) => !$isExpanded && sidebarTextCollapsed}
  }
`;

export const LogoutButton = styled.button<{ readonly $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme, $isExpanded }) => ($isExpanded ? theme.spacing(3) : '0')};
  width: 100%;
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(3)} ${theme.spacing(3)}` : `${theme.spacing(3)} 0`};
  justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => theme.colors.dangerMuted};
  transition: background-color 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerMuted};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) =>
      !$isExpanded &&
      css`
        padding-left: 0;
        padding-right: 0;
      `}
  }
`;

export const Tooltip = styled.span`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 60;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const UserAvatarContainer = styled.div<{ readonly $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme, $isExpanded }) => ($isExpanded ? theme.spacing(3) : '0')};
  padding: ${({ theme, $isExpanded }) =>
    $isExpanded ? `${theme.spacing(2)} ${theme.spacing(3)}` : `${theme.spacing(2)} 0`};
  justify-content: ${({ $isExpanded }) => ($isExpanded ? 'flex-start' : 'center')};
  border-radius: 10px;
  transition: background-color 0.15s ease;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const UserInfo = styled.div<{ readonly $isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    opacity 0.2s ease,
    width 0.2s ease;
  min-width: 0;

  @media (min-width: ${breakpoints.tablet}) {
    ${({ $isExpanded }) => !$isExpanded && sidebarTextCollapsed}
  }
`;

export const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.sidebarText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.sidebarMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MobileToggle = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing(3)};
  left: ${({ theme }) => theme.spacing(3)};
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;
