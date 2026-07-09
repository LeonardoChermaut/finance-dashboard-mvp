'use client';

import { Sidebar } from '@/components/sidebar/sidebar';
import { LogoIcon } from '@/components/ui/auth-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/modules/auth';
import { routes } from '@/routes/routes';
import {
  ArrowRight,
  BarChart3,
  Bell,
  ChevronRight,
  Filter,
  LayoutDashboard,
  Lock,
  Moon,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  CtaDescription,
  CtaSection,
  CtaTitle,
  FeaturesGrid,
  FeaturesSection,
  Footer,
  FooterText,
  HeroActions,
  HeroBadge,
  HeroDescription,
  HeroHighlight,
  HeroSection,
  HeroTitle,
  LogoText,
  Nav,
  NavActions,
  NavLogo,
  PageWrapper,
  SectionDescription,
  SectionDivider,
  SectionLabel,
  SectionTitle,
  StatsSection,
  StatItem,
  StatLabel,
  StatValue,
} from './page.styled';

const ThemeButton = styled(ThemeToggle)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
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

const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }
`;

const AuthenticatedLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const AuthenticatedContent = styled.main`
  flex: 1;
  margin-left: 64px;
  transition: margin-left 0.3s ease;
`;

const features = [
  {
    icon: BarChart3,
    title: 'Graficos em Tempo Real',
    description:
      'Visualize receitas, despesas e saldo acumulado com graficos interativos e responsivos.',
  },
  {
    icon: Filter,
    title: 'Filtros Dinamicos',
    description:
      'Filtre por datas, contas, industrias e estados. Todos os dados atualizam instantaneamente.',
  },
  {
    icon: Wallet,
    title: 'Cards de Resumo',
    description:
      'Resumo visual com receitas, despesas, pendencias e saldo total em um unico painel.',
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
    description:
      'Identificacao automatica de transacoes recentes com indicador visual de pendencia.',
  },
];

const stats = [
  { value: '50k+', label: 'Transacoes' },
  { value: '4', label: 'Cards de Resumo' },
  { value: '2', label: 'Graficos Interativos' },
  { value: '100%', label: 'Responsivo' },
] as const;

const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Sidebar />
        <AuthenticatedContent>
          <PageWrapper>
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
                <Link href={routes.dashboard} passHref>
                  <Button as="span">
                    Ir para o Dashboard
                    <ChevronRight size={16} />
                  </Button>
                </Link>
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
                Um sistema financeiro completo com visual profissional, filtros dinamicos e graficos
                reativos.
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
                Acesse o dashboard com as credenciais mockadas e explore todos os recursos
                disponiveis.
              </CtaDescription>
              <Link href={routes.dashboard} passHref>
                <Button as="span">
                  <LayoutDashboard size={16} />
                  Abrir Dashboard
                </Button>
              </Link>
            </CtaSection>

            <Footer>
              <FooterText>Dashboard Financeiro MVP — Projeto de demonstracao</FooterText>
            </Footer>
          </PageWrapper>
        </AuthenticatedContent>
      </AuthenticatedLayout>
    );
  }

  return (
    <PageWrapper>
      <Nav>
        <NavLogo>
          <LogoIcon aria-hidden="true">F</LogoIcon>
          <LogoText>Financeiro</LogoText>
        </NavLogo>
        <NavActions>
          <ThemeButton />
          <Link href={routes.login} passHref>
            <Button as="span">
              Entrar
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
          Acompanhe suas receitas, despesas e saldo acumulado com uma interface moderna, responsiva
          e com suporte completo a tema claro e escuro.
        </HeroDescription>
        <HeroActions>
          <Link href={routes.login} passHref>
            <Button as="span">
              Comecar Agora
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
          Um sistema financeiro completo com visual profissional, filtros dinamicos e graficos
          reativos.
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
        <Link href={routes.login} passHref>
          <Button as="span">
            <LayoutDashboard size={16} />
            Acessar Agora
          </Button>
        </Link>
      </CtaSection>

      <Footer>
        <FooterText>Dashboard Financeiro MVP — Projeto de demonstracao</FooterText>
      </Footer>
    </PageWrapper>
  );
};

export default HomePage;
