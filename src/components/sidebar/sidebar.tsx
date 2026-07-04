'use client';

import {
  Avatar,
  CollapseButton,
  FooterItem,
  FooterLabel,
  LogoIcon,
  LogoText,
  LogoWrapper,
  LogoutButton,
  MobileToggle,
  NavIcon,
  NavItem,
  NavLabel,
  SidebarContainer,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarOverlay,
  Tooltip,
  UserAvatarContainer,
  UserEmail,
  UserInfo,
  UserName,
} from '@/components/sidebar/sidebar.styled';
import { SIDEBAR_STATE_KEY, USER_NAME_STORAGE_KEY } from '@/constants/config';
import { useClickOutside, useDelay, useLocalStorage } from '@/hooks';
import { clearSessionCookie, getAuthService, useAuthStore } from '@/modules/auth';
import { useFilterStore } from '@/modules/filters';
import { routes } from '@/routes/routes';
import { useThemeMode } from '@/theme';
import { getInitials } from '@/utils/string';
import { ChevronLeft, Home, LayoutDashboard, LogOut, Menu, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [shouldResetFilters, setShouldResetFilters] = useState<boolean>(false);

  const { resetFilters } = useFilterStore();
  const { user, clearAuth } = useAuthStore();
  const { mode, toggleTheme } = useThemeMode();

  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const [persistedName] = useLocalStorage<string>(USER_NAME_STORAGE_KEY, '');
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>(SIDEBAR_STATE_KEY, false);

  const { isLoading: isLoggingOut, execute: executeLogout } = useDelay<void>(2000);

  const authService = useMemo(() => getAuthService(), []);

  useEffect(() => {
    if (shouldResetFilters && pathname === routes.home) {
      resetFilters();
      setShouldResetFilters(false);
    }
  }, [shouldResetFilters, pathname, resetFilters]);

  useEffect(() => {
    if (isMobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, -parseInt(scrollY || '0', 10));
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleExpanded = useCallback(() => setIsExpanded((previous) => !previous), [setIsExpanded]);

  const handleHomeClick = useCallback(() => {
    setShouldResetFilters(true);
    setIsMobileOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await executeLogout(async () => {
      await authService.logout();
      clearSessionCookie();
      clearAuth();
      resetFilters();
      setIsMobileOpen(false);
      window.location.href = routes.login;
    });
  }, [authService, clearAuth, resetFilters, executeLogout]);

  useClickOutside(sidebarRef, isMobileOpen, () => setIsMobileOpen(false));

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  const userName = persistedName || (user?.name ?? '');
  const userEmail = user?.email ?? '';
  const initials = getInitials(userName);

  const showTooltip = (key: string) => !isExpanded && hoveredItem === key;

  return (
    <>
      <MobileToggle
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Abrir menu de navegacao"
      >
        <Menu size={20} />
      </MobileToggle>

      {isMobileOpen && <SidebarOverlay onClick={() => setIsMobileOpen(false)} aria-hidden="true" />}

      <SidebarContainer
        ref={sidebarRef}
        $isExpanded={isExpanded}
        $isMobileOpen={isMobileOpen}
        role="navigation"
        aria-label="Navegação principal"
      >
        <SidebarHeader $isExpanded={isExpanded}>
          <LogoWrapper>
            <LogoIcon aria-hidden="true">F</LogoIcon>
            <LogoText $isExpanded={isExpanded}>Financeiro</LogoText>
          </LogoWrapper>
          <CollapseButton
            type="button"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
          >
            <ChevronLeft
              size={16}
              style={{
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav $isExpanded={isExpanded}>
          <NavItem
            as={Link}
            href={routes.home}
            onClick={handleHomeClick}
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label="Inicio"
            onFocus={() => setHoveredItem('home')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>
              <Home size={18} />
            </NavIcon>
            <NavLabel $isExpanded={isExpanded}>Inicio</NavLabel>
            {showTooltip('home') && <Tooltip role="tooltip">Inicio</Tooltip>}
          </NavItem>

          <NavItem
            as={Link}
            href={routes.dashboard}
            onClick={() => setIsMobileOpen(false)}
            $isActive={pathname === routes.dashboard}
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label="Painel"
            onFocus={() => setHoveredItem('dashboard')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>
              <LayoutDashboard size={18} />
            </NavIcon>
            <NavLabel $isExpanded={isExpanded}>Painel</NavLabel>

            {showTooltip('dashboard') && <Tooltip role="tooltip">Painel</Tooltip>}
          </NavItem>
        </SidebarNav>

        <SidebarFooter $isExpanded={isExpanded}>
          <FooterItem
            type="button"
            onClick={toggleTheme}
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('theme')}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            onFocus={() => setHoveredItem('theme')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>{mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}</NavIcon>
            <FooterLabel $isExpanded={isExpanded}>
              {mode === 'light' ? 'Modo escuro' : 'Modo claro'}
            </FooterLabel>
            {showTooltip('theme') && (
              <Tooltip role="tooltip">{mode === 'light' ? 'Modo escuro' : 'Modo claro'}</Tooltip>
            )}
          </FooterItem>

          {user ? (
            <UserAvatarContainer
              as={Link}
              href={routes.profile}
              onClick={() => setIsMobileOpen(false)}
              $isExpanded={isExpanded}
            >
              <Avatar aria-hidden="true">{initials}</Avatar>
              <UserInfo $isExpanded={isExpanded}>
                <UserName>{userName}</UserName>
                <UserEmail>{userEmail}</UserEmail>
              </UserInfo>
            </UserAvatarContainer>
          ) : null}

          <LogoutButton
            type="button"
            aria-label="Sair"
            onClick={handleLogout}
            disabled={isLoggingOut}
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => setHoveredItem('logout')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>
              <LogOut size={18} />
            </NavIcon>
            <FooterLabel $isExpanded={isExpanded}>
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </FooterLabel>
            {showTooltip('logout') && (
              <Tooltip role="tooltip">{isLoggingOut ? 'Saindo...' : 'Sair'}</Tooltip>
            )}
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};
