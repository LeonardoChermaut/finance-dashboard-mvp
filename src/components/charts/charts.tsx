'use client';

import { Card } from '@/components/ui/card';
import type {
  AccumulatedBalancePoint,
  MonthlyTotals,
} from '@/domains/transactions/transaction.types';
import { formatCentsToCurrency } from '@/lib/format';
import type { ChartOptions, TooltipItem } from 'chart.js';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import styled, { useTheme } from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
`;

const ChartTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
`;

const ChartDescription = styled.p`
  font-size: 13px;
  color: ${({ theme: appTheme }) => appTheme.colors.muted};
`;

const ChartArea = styled.div`
  height: 320px;
`;

type ChartsProps = {
  readonly monthlyTotals: readonly MonthlyTotals[];
  readonly accumulatedBalance: readonly AccumulatedBalancePoint[];
  readonly currency: string;
};

export const Charts = ({ monthlyTotals, accumulatedBalance, currency }: ChartsProps) => {
  const theme = useTheme();

  const barData = {
    labels: monthlyTotals.map((monthlyTotal) => monthlyTotal.month),
    datasets: [
      {
        label: 'Receitas',
        data: monthlyTotals.map((monthlyTotal) => monthlyTotal.depositInCents / 100),
        backgroundColor: theme.colors.income,
        stack: 'monthly',
      },
      {
        label: 'Despesas',
        data: monthlyTotals.map((monthlyTotal) => monthlyTotal.withdrawInCents / 100),
        backgroundColor: theme.colors.expense,
        stack: 'monthly',
      },
    ],
  };

  const lineData = {
    labels: accumulatedBalance.map((point) => point.month),
    datasets: [
      {
        label: 'Saldo acumulado',
        data: accumulatedBalance.map((point) => point.balanceInCents / 100),
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
        tension: 0.3,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
      y: {
        stacked: true,
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>): string => {
            const label = tooltipItem.dataset.label ?? '';
            const value = tooltipItem.parsed.y ?? 0;
            return `${label}: ${formatCentsToCurrency(Math.round(value * 100), currency)}`;
          },
        },
      },
    },
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
      y: {
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>): string => {
            const value = tooltipItem.parsed.y ?? 0;
            return formatCentsToCurrency(Math.round(value * 100), currency);
          },
        },
      },
    },
  };

  return (
    <Grid>
      <ChartCard>
        <ChartTitle>Receitas vs Despesas</ChartTitle>
        <ChartDescription>Divisao mensal de receitas e despesas.</ChartDescription>
        <ChartArea>
          <Bar data={barData} options={barOptions} />
        </ChartArea>
      </ChartCard>
      <ChartCard>
        <ChartTitle>Saldo Acumulado</ChartTitle>
        <ChartDescription>Evolucao do saldo ao longo do tempo.</ChartDescription>
        <ChartArea>
          <Line data={lineData} options={lineOptions} />
        </ChartArea>
      </ChartCard>
    </Grid>
  );
};
