'use client';

import { Card } from '@/components/ui/card';
import type { FinancialSummary } from '@/domains/transactions/transaction.types';
import { formatCentsToCurrency } from '@/lib/format';
import { ArrowDownLeft, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

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

const CardIcon = styled.div<{ readonly $tone: 'income' | 'expense' | 'pending' | 'balance' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ theme, $tone }) => {
    if ($tone === 'income') return theme.colors.incomeMuted;
    if ($tone === 'expense') return theme.colors.expenseMuted;
    if ($tone === 'pending') return theme.colors.warningMuted;
    return theme.colors.secondaryMuted;
  }};
  color: ${({ theme, $tone }) => {
    if ($tone === 'income') return theme.colors.income;
    if ($tone === 'expense') return theme.colors.expense;
    if ($tone === 'pending') return theme.colors.warning;
    return theme.colors.secondary;
  }};
`;

const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CardValue = styled.p<{ readonly $tone?: 'income' | 'expense' }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme, $tone }) => {
    if ($tone === 'income') return theme.colors.income;
    if ($tone === 'expense') return theme.colors.expense;
    return theme.colors.text;
  }};
  line-height: 1.2;
`;

const CardDescription = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

const CardVariation = styled.span<{ readonly $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.success : theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing(1)};
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
    variation: '+12% vs periodo anterior',
    variationPositive: true,
  },
  {
    key: 'expenses',
    label: 'Despesas',
    tone: 'expense' as const,
    icon: ArrowDownLeft,
    description: 'Total de saques realizados',
    variation: '+8% vs periodo anterior',
    variationPositive: false,
  },
  {
    key: 'pending',
    label: 'Pendentes',
    tone: 'pending' as const,
    icon: Clock,
    description: 'Transacoes dos ultimos 5 dias',
    variation: '-3 vs periodo anterior',
    variationPositive: true,
  },
  {
    key: 'balance',
    label: 'Saldo Total',
    tone: 'balance' as const,
    icon: TrendingUp,
    description: 'Receitas menos despesas',
    variation: '+15% vs periodo anterior',
    variationPositive: true,
  },
] as const;

export const SummaryCards = ({ summary, currency, onCardClick }: SummaryCardsProps) => {
  const values: Record<string, { readonly amount: number; readonly tone?: 'income' | 'expense' }> = {
    income: { amount: summary.incomeInCents, tone: 'income' },
    expenses: { amount: summary.expensesInCents, tone: 'expense' },
    pending: { amount: summary.pendingCount },
    balance: { amount: summary.balanceInCents },
  };

  return (
    <Grid>
      {cardConfig.map((config) => {
        const Icon = config.icon;
        const value = values[config.key];
        const displayValue =
          config.key === 'pending'
            ? String(value.amount)
            : formatCentsToCurrency(value.amount, currency);

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
              <CardLabel>{config.label}</CardLabel>
              <CardIcon $tone={config.tone}>
                <Icon size={20} />
              </CardIcon>
            </CardHeader>
            <CardValue $tone={value.tone}>{displayValue}</CardValue>
            <CardDescription>{config.description}</CardDescription>
            <CardVariation $positive={config.variationPositive}>{config.variation}</CardVariation>
          </StyledCard>
        );
      })}
    </Grid>
  );
};
