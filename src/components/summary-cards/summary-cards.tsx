'use client';

import { summaryCardConfig } from '@/constants/dashboard';
import type { FinancialSummary } from '@/domains/transactions/transaction.types';
import { formatCentsToCurrency } from '@/utils/format';
import { calculatePendingVariation, calculateVariation } from '@/utils/variation';
import { ChevronLeft, ChevronRight, TrendingDown } from 'lucide-react';
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
  previousSummary: FinancialSummary;
  currency: string;
  onCardClick?: (type: 'income' | 'expenses' | 'pending' | 'balance') => void;
};

const getLabel = (key: string, label: string) => {
  if (key === 'balance') {
    return <TotalLabel>{label}</TotalLabel>;
  }
  return <CardLabel>{label}</CardLabel>;
};

export const SummaryCards = ({
  summary,
  previousSummary,
  currency,
  onCardClick,
}: SummaryCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const variations: Record<string, string> = {
    income: calculateVariation(summary.incomeInCents, previousSummary.incomeInCents),
    expenses: calculateVariation(summary.expensesInCents, previousSummary.expensesInCents),
    pending: calculatePendingVariation(summary.pendingCount, previousSummary.pendingCount),
    balance: calculateVariation(summary.balanceInCents, previousSummary.balanceInCents),
  };

  const handlePrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? summaryCardConfig.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === summaryCardConfig.length - 1 ? 0 : prev + 1));

  const renderCard = (config: (typeof summaryCardConfig)[number]) => {
    const getAmount = (): number => {
      if (config.key === 'income') {
        return summary.incomeInCents;
      }
      if (config.key === 'expenses') {
        return summary.expensesInCents;
      }
      return summary.balanceInCents;
    };

    const displayValue =
      config.key === 'pending'
        ? String(summary.pendingCount)
        : formatCentsToCurrency(getAmount(), currency);

    const getBalanceVariant = (): 'positive' | 'negative' | 'zero' | undefined => {
      if (config.key !== 'balance') {
        return undefined;
      }
      if (summary.balanceInCents > 0) {
        return 'positive';
      }
      if (summary.balanceInCents < 0) {
        return 'negative';
      }
      return 'zero';
    };

    const balanceVariant = getBalanceVariant();
    const Icon = balanceVariant === 'negative' ? TrendingDown : config.icon;

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
        <CardVariation>{variations[config.key]}</CardVariation>
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
          {renderCard(summaryCardConfig[currentIndex])}
          <NavigationButton $direction="right" onClick={handleNext} aria-label="Próximo">
            <ChevronRight size={16} />
          </NavigationButton>
        </CarouselContainer>
        <DotsContainer>
          {summaryCardConfig.map((config, index) => (
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
        <Grid $isMobile={false}>
          {summaryCardConfig.slice(0, 2).map((config) => renderCard(config))}
        </Grid>
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
        <Grid $isMobile={false}>{summaryCardConfig.map((config) => renderCard(config))}</Grid>
      </DesktopCardContainer>
    </>
  );
};
