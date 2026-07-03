'use client';

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
import {
  CardDescription,
  CardHeader,
  CardIcon,
  CardLabel,
  CardValue,
  CardVariation,
  CarouselContainer,
  DesktopCardContainer,
  Dot,
  DotsContainer,
  Grid,
  MobileCardContainer,
  NavigationButton,
  StyledCard,
  TabletCardContainer,
  TotalLabel,
} from './summary-cards.styled';

type SummaryCardsProps = {
  summary: FinancialSummary;
  currency: string;
  onCardClick?: (type: 'income' | 'expenses' | 'pending' | 'balance') => void;
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
