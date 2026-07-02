'use client';

import { Card } from '@/components/ui/card';
import type {
  AccumulatedBalancePoint,
  FinancialSummary,
  MonthlyTotals,
} from '@/domains/transactions/transaction.types';
import { formatCentsToCurrency } from '@/utils/format';
import type { ChartOptions, TooltipItem } from 'chart.js';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import styled, { useTheme } from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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

const FullWidthGrid = styled.div`
  grid-column: 1 / -1;
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

const DoughnutArea = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme: appTheme }) => appTheme.spacing(4)};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme: appTheme }) => appTheme.spacing(1)};
  text-align: center;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme: appTheme }) => appTheme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme: appTheme }) => appTheme.colors.text};
`;

type ChartsProps = {
  readonly monthlyTotals: readonly MonthlyTotals[];
  readonly accumulatedBalance: readonly AccumulatedBalancePoint[];
  readonly summary: FinancialSummary;
  readonly currency: string;
};

export const Charts = ({ monthlyTotals, accumulatedBalance, summary, currency }: ChartsProps) => {
  const theme = useTheme();

  const barData = {
    labels: monthlyTotals.map((monthlyTotal) => monthlyTotal.month),
    datasets: [
      {
        label: 'Receitas',
        data: monthlyTotals.map((monthlyTotal) => monthlyTotal.depositInCents / 100),
        backgroundColor: theme.colors.income,
        borderRadius: 4,
      },
      {
        label: 'Despesas',
        data: monthlyTotals.map((monthlyTotal) => monthlyTotal.withdrawInCents / 100),
        backgroundColor: theme.colors.expense,
        borderRadius: 4,
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
        backgroundColor: `${theme.colors.primary}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: theme.colors.primary,
        pointBorderColor: theme.colors.surface,
        pointBorderWidth: 2,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      ['x']: {
        ticks: { color: theme.colors.muted },
        grid: { display: false },
      },
      ['y']: {
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
          color: theme.colors.text,
        },
      },
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
      ['x']: {
        ticks: { color: theme.colors.muted },
        grid: { display: false },
      },
      ['y']: {
        ticks: { color: theme.colors.muted },
        grid: { color: theme.colors.border },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
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

  const doughnutData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [summary.incomeInCents / 100, summary.expensesInCents / 100],
        backgroundColor: [theme.colors.income, theme.colors.expense],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
          color: theme.colors.text,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>): string => {
            const label = tooltipItem.label ?? '';
            const value = tooltipItem.parsed ?? 0;
            return `${label}: ${formatCentsToCurrency(Math.round(value * 100), currency)}`;
          },
        },
      },
    },
  };

  return (
    <Grid>
      <FullWidthGrid>
        <ChartCard>
          <ChartTitle>Receitas vs Despesas</ChartTitle>
          <ChartDescription>Comparativo mensal entre receitas e despesas.</ChartDescription>
          <ChartArea>
            <Bar data={barData} options={barOptions} />
          </ChartArea>
        </ChartCard>
      </FullWidthGrid>
      <ChartCard>
        <ChartTitle>Saldo Acumulado</ChartTitle>
        <ChartDescription>Evolucao do saldo ao longo do tempo.</ChartDescription>
        <ChartArea>
          <Line data={lineData} options={lineOptions} />
        </ChartArea>
      </ChartCard>
      <ChartCard>
        <ChartTitle>Distribuicao</ChartTitle>
        <ChartDescription>Proporcao entre receitas e despesas.</ChartDescription>
        <DoughnutArea>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </DoughnutArea>
        <StatsGrid>
          <StatItem>
            <StatLabel>Receitas</StatLabel>
            <StatValue>{formatCentsToCurrency(summary.incomeInCents, currency)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Despesas</StatLabel>
            <StatValue>{formatCentsToCurrency(summary.expensesInCents, currency)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Pendentes</StatLabel>
            <StatValue>{summary.pendingCount}</StatValue>
          </StatItem>
        </StatsGrid>
      </ChartCard>
    </Grid>
  );
};
