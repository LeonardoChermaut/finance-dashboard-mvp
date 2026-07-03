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
import { clearSessionCookie, createMockAuthService, useAuthStore } from '@/domains/auth';
import { useFilterStore } from '@/domains/filters';
import { useClickOutside } from '@/hooks';
import { routes } from '@/routes/routes';
import { useThemeMode } from '@/theme';
import { getInitials } from '@/utils/transaction';
import { ChevronLeft, Home, LayoutDashboard, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const SIDEBAR_STATE_KEY = 'financial_dashboard_sidebar_expanded';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const router = useRouter();
  const authService = createMockAuthService();

  const { user, clearAuth } = useAuthStore();
  const { resetFilters } = useFilterStore();
  const { mode, toggleTheme } = useThemeMode();

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY);
    if (stored !== null) {
      setIsExpanded(stored === 'true');
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((previous) => {
      const next = !previous;
      window.localStorage.setItem(SIDEBAR_STATE_KEY, String(next));
      return next;
    });
  }, []);

  const handleDashboard = useCallback(() => {
    router.push(routes.dashboard);
    setIsMobileOpen(false);
  }, [router]);

  const handleHome = useCallback(() => {
    router.push(routes.home);
    resetFilters();
    setIsMobileOpen(false);
  }, [router, resetFilters]);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    clearSessionCookie();
    clearAuth();
    resetFilters();
    router.push(routes.login);
    setIsMobileOpen(false);
  }, [authService, clearAuth, resetFilters, router]);

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

  const userName = user?.name ?? '';
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
            type="button"
            onClick={handleHome}
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
            aria-label="Início"
            onFocus={() => setHoveredItem('home')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>
              <Home size={18} />
            </NavIcon>
            <NavLabel $isExpanded={isExpanded}>Início</NavLabel>
            {showTooltip('home') && <Tooltip role="tooltip">Início</Tooltip>}
          </NavItem>

          <NavItem
            type="button"
            onClick={handleDashboard}
            $isActive
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
            <UserAvatarContainer $isExpanded={isExpanded}>
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
            $isExpanded={isExpanded}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            onFocus={() => setHoveredItem('logout')}
            onBlur={() => setHoveredItem(null)}
          >
            <NavIcon>
              <LogOut size={18} />
            </NavIcon>
            <FooterLabel $isExpanded={isExpanded}>Sair</FooterLabel>
            {showTooltip('logout') && <Tooltip role="tooltip">Sair</Tooltip>}
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};
