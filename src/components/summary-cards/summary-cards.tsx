'use client';

import { Card } from '@/components/ui/card';
import type { FinancialSummary } from '@/domains/transactions/transaction.types';
import { formatCentsToCurrency } from '@/utils/format';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Grid = styled.div<{ readonly $isMobile: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ $isMobile }) =>
    $isMobile &&
    `
    grid-template-columns: 1fr;
  `}

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  position: relative;
  overflow: hidden;
  cursor: pointer;
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
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      ${({ theme }) => theme.colors.cardHoverShadow},
      0 0 20px ${({ theme }) => theme.colors.primaryMuted};

    &::before {
      opacity: 0.35;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardIcon = styled.div<{
  readonly $tone: 'income' | 'expense' | 'pending' | 'balance';
  readonly $balanceVariant?: 'positive' | 'negative' | 'zero';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ theme, $tone, $balanceVariant }) => {
    if ($tone === 'income') return theme.colors.incomeMuted;
    if ($tone === 'expense') return theme.colors.expenseMuted;
    if ($tone === 'pending') return theme.colors.warningMuted;
    if ($balanceVariant === 'negative') return theme.colors.dangerMuted;
    if ($balanceVariant === 'zero') return theme.colors.warningMuted;
    return theme.colors.successMuted;
  }};
  color: ${({ theme, $tone, $balanceVariant }) => {
    if ($tone === 'income') return theme.colors.income;
    if ($tone === 'expense') return theme.colors.expense;
    if ($tone === 'pending') return theme.colors.warning;
    if ($balanceVariant === 'negative') return theme.colors.danger;
    if ($balanceVariant === 'zero') return theme.colors.warning;
    return theme.colors.success;
  }};
`;

const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const TotalLabel = styled(CardLabel)`
  padding: 2px 8px;
  border-radius: 4px;
`;

const CardValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

const CardDescription = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

const CardVariation = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const NavigationButton = styled.button<{ readonly $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'left' ? 'left: -12px;' : 'right: -12px;')}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.sectionDivider};
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing(3)};

  @media (min-width: 1024px) {
    display: none;
  }
`;

const Dot = styled.button<{ readonly $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.border};

  &:hover {
    transform: scale(1.2);
  }
`;

const MobileCardContainer = styled.div`
  display: block;

  @media (min-width: 480px) {
    display: none;
  }
`;

const TabletCardContainer = styled.div`
  display: none;

  @media (min-width: 480px) and (max-width: 1023px) {
    display: block;
  }
`;

const DesktopCardContainer = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

type SummaryCardsProps = {
  readonly summary: FinancialSummary;
  readonly currency: string;
  readonly onCardClick?: (type: 'income' | 'expenses' | 'pending' | 'balance') => void;
};

const cardConfig = [
  {
    key: 'income',
    label: 'Receitas',
    tone: 'income' as const,
    icon: ArrowUpRight,
    description: 'Total de depositos recebidos',
    variation: '+12% vs período anterior',
  },
  {
    key: 'expenses',
    label: 'Despesas',
    tone: 'expense' as const,
    icon: ArrowDownLeft,
    description: 'Total de saques realizados',
    variation: '+8% vs período anterior',
  },
  {
    key: 'pending',
    label: 'Pendentes',
    tone: 'pending' as const,
    icon: Clock,
    description: 'Transações dos últimos 7 dias',
    variation: '-3 vs período anterior',
  },
  {
    key: 'balance',
    label: 'Saldo Total',
    tone: 'balance' as const,
    icon: TrendingUp,
    description: 'Receitas menos despesas',
    variation: '+15% vs período anterior',
  },
] as const;

const getLabel = (key: string, label: string) => {
  if (key === 'balance') {
    return <TotalLabel>{label}</TotalLabel>;
  }
  return <CardLabel>{label}</CardLabel>;
};

export const SummaryCards = ({ summary, currency, onCardClick }: SummaryCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const values: Record<string, { readonly amount: number; readonly tone?: 'income' | 'expense' }> =
    {
      income: { amount: summary.incomeInCents, tone: 'income' },
      expenses: { amount: summary.expensesInCents, tone: 'expense' },
      pending: { amount: summary.pendingCount },
      balance: { amount: summary.balanceInCents },
    };

  const handlePrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? cardConfig.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === cardConfig.length - 1 ? 0 : prev + 1));

  const renderCard = (config: (typeof cardConfig)[number]) => {
    const value = values[config.key];
    const displayValue =
      config.key === 'pending'
        ? String(value.amount)
        : formatCentsToCurrency(value.amount, currency);

    const balanceVariant =
      config.key === 'balance'
        ? value.amount > 0
          ? ('positive' as const)
          : value.amount < 0
            ? ('negative' as const)
            : ('zero' as const)
        : undefined;

    const Icon =
      config.key === 'balance' && balanceVariant === 'negative' ? TrendingDown : config.icon;

    return (
      <StyledCard
        key={config.key}
        role="button"
        tabIndex={0}
        onClick={() => onCardClick?.(config.key as 'income' | 'expenses' | 'pending' | 'balance')}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onCardClick?.(config.key as 'income' | 'expenses' | 'pending' | 'balance');
          }
        }}
        aria-label={`${config.label}: ${displayValue}. Clique para ver detalhes.`}
      >
        <CardHeader>
          {getLabel(config.key, config.label)}
          <CardIcon $tone={config.tone} $balanceVariant={balanceVariant}>
            <Icon size={20} />
          </CardIcon>
        </CardHeader>
        <CardValue>{displayValue}</CardValue>
        <CardDescription>{config.description}</CardDescription>
        <CardVariation>{config.variation}</CardVariation>
      </StyledCard>
    );
  };

  return (
    <>
      <MobileCardContainer>
        <CarouselContainer>
          <NavigationButton $direction="left" onClick={handlePrevious} aria-label="Anterior">
            <ChevronLeft size={16} />
          </NavigationButton>
          {renderCard(cardConfig[currentIndex])}
          <NavigationButton $direction="right" onClick={handleNext} aria-label="Próximo">
            <ChevronRight size={16} />
          </NavigationButton>
        </CarouselContainer>
        <DotsContainer>
          {cardConfig.map((config, index) => (
            <Dot
              key={config.key}
              $active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para ${config.label}`}
            />
          ))}
        </DotsContainer>
      </MobileCardContainer>

      <TabletCardContainer>
        <Grid $isMobile={false}>{cardConfig.slice(0, 2).map((config) => renderCard(config))}</Grid>
        <DotsContainer>
          {[0, 1].map((pageIndex) => (
            <Dot
              key={pageIndex}
              $active={currentIndex < 2 ? pageIndex === 0 : pageIndex === 1}
              onClick={() => setCurrentIndex(pageIndex === 0 ? 0 : 2)}
              aria-label={`Ir para pagina ${pageIndex + 1}`}
            />
          ))}
        </DotsContainer>
      </TabletCardContainer>

      <DesktopCardContainer>
        <Grid $isMobile={false}>{cardConfig.map((config) => renderCard(config))}</Grid>
      </DesktopCardContainer>
    </>
  );
};
