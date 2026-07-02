'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/domains/auth';
import { routes } from '@/routes/routes';
import { useThemeMode } from '@/theme';
import {
  ArrowRight,
  BarChart3,
  Bell,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Lock,
  Moon,
  Sun,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(4)}`};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(6)}`};
  }
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
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

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing(10)} ${theme.spacing(4)}`};
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease;

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(6)}`};
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primaryMuted};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media (min-width: 768px) {
    font-size: 52px;
  }
`;

const HeroHighlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const HeroDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 560px;
  margin-bottom: ${({ theme }) => theme.spacing(8)};

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    ${({ theme }) => theme.colors.border},
    transparent
  );
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => `${theme.spacing(10)} ${theme.spacing(4)}`};
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(6)}`};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};

  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 500;
`;

const FeaturesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => `${theme.spacing(12)} ${theme.spacing(4)}`};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.sectionDivider};

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(6)}`};
  }
`;

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const SectionDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(8)};

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing(5)};
  }
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(6)};
  position: relative;
  overflow: hidden;
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 0%,
      ${({ theme }) => theme.colors.primaryMuted} 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      ${({ theme }) => theme.colors.cardHoverShadow},
      0 0 20px ${({ theme }) => theme.colors.primaryMuted};

    &::before {
      opacity: 0.3;
    }
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.primaryMuted};
  color: ${({ theme }) => theme.colors.primary};
  position: relative;
  z-index: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  z-index: 1;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const CtaSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing(16)} ${theme.spacing(4)}`};
  max-width: 700px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing(20)} ${theme.spacing(6)}`};
  }
`;

const CtaTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  @media (min-width: 768px) {
    font-size: 36px;
  }
`;

const CtaDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(8)} ${theme.spacing(4)}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FooterText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const FooterLink = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const features = [
  {
    icon: BarChart3,
    title: 'Graficos em Tempo Real',
    description: 'Visualize receitas, despesas e saldo acumulado com graficos interativos e responsivos.',
  },
  {
    icon: Filter,
    title: 'Filtros Dinamicos',
    description: 'Filtre por datas, contas, industrias e estados. Todos os dados atualizam instantaneamente.',
  },
  {
    icon: Wallet,
    title: 'Cards de Resumo',
    description: 'Resumo visual com receitas, despesas, pendencias e saldo total em um unico painel.',
  },
  {
    icon: Lock,
    title: 'Sessao Segura',
    description: 'Autenticacao mockada com persistencia de sessao e protecao de rotas no servidor.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Tema claro e escuro com persistencia da escolha do usuario e transicoes suaves.',
  },
  {
    icon: Bell,
    title: 'Transacoes Pendentes',
    description: 'Identificacao automatica de transacoes recentes com indicador visual de pendencia.',
  },
];

const stats = [
  { value: '50k+', label: 'Transacoes' },
  { value: '4', label: 'Cards de Resumo' },
  { value: '2', label: 'Graficos Interativos' },
  { value: '100%', label: 'Responsivo' },
];

const HomePage = () => {
  const { mode, toggleTheme } = useThemeMode();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <PageWrapper>
      <Nav>
        <NavLogo>
          <LogoIcon aria-hidden="true">F</LogoIcon>
          <LogoText>Financeiro</LogoText>
        </NavLogo>
        <NavActions>
          <ThemeButton
            type="button"
            onClick={toggleTheme}
            aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </ThemeButton>
          <Link href={isAuthenticated ? routes.dashboard : routes.login} passHref>
            <Button as="span">
              {isAuthenticated ? 'Dashboard' : 'Entrar'}
              <ArrowRight size={16} />
            </Button>
          </Link>
        </NavActions>
      </Nav>

      <HeroSection>
        <HeroBadge>
          <TrendingUp size={14} />
          Dashboard Financeiro MVP
        </HeroBadge>
        <HeroTitle>
          Controle financeiro <HeroHighlight>simples e poderoso</HeroHighlight>
        </HeroTitle>
        <HeroDescription>
          Acompanhe suas receitas, despesas e saldo acumulado com uma interface moderna,
          responsiva e com suporte completo a tema claro e escuro.
        </HeroDescription>
        <HeroActions>
          <Link href={isAuthenticated ? routes.dashboard : routes.login} passHref>
            <Button as="span">
              {isAuthenticated ? 'Ir para o Dashboard' : 'Comecar Agora'}
              <ChevronRight size={16} />
            </Button>
          </Link>
          <SecondaryButton as="a" href="#features">
            Saiba Mais
          </SecondaryButton>
        </HeroActions>
      </HeroSection>

      <SectionDivider />

      <StatsSection>
        {stats.map((stat) => (
          <StatItem key={stat.label}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsSection>

      <SectionDivider />

      <FeaturesSection id="features">
        <SectionLabel>Funcionalidades</SectionLabel>
        <SectionTitle>Tudo que voce precisa</SectionTitle>
        <SectionDescription>
          Um sistema financeiro completo com visual profissional, filtros dinamicos e
          graficos reativos.
        </SectionDescription>
        <FeaturesGrid>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <FeatureCard key={feature.title}>
                <FeatureIcon>
                  <Icon size={24} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            );
          })}
        </FeaturesGrid>
      </FeaturesSection>

      <SectionDivider />

      <CtaSection>
        <CtaTitle>Pronto para comecar?</CtaTitle>
        <CtaDescription>
          Acesse o dashboard com as credenciais mockadas e explore todos os recursos disponiveis.
        </CtaDescription>
        <Link href={isAuthenticated ? routes.dashboard : routes.login} passHref>
          <Button as="span">
            <LayoutDashboard size={16} />
            {isAuthenticated ? 'Abrir Dashboard' : 'Acessar Agora'}
          </Button>
        </Link>
      </CtaSection>

      <Footer>
        <FooterText>Dashboard Financeiro MVP — Projeto de demonstracao</FooterText>
        <FooterLinks>
          <ThemeButton
            type="button"
            onClick={toggleTheme}
            aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </ThemeButton>
          {!isAuthenticated ? (
            <Link href={routes.login} passHref>
              <FooterLink as="a">Entrar</FooterLink>
            </Link>
          ) : null}
        </FooterLinks>
      </Footer>
    </PageWrapper>
  );
};

export default HomePage;
