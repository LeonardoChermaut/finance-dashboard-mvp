import type { FilterOptions } from '@/modules/filters/filters.types';
import type { FinancialSummary } from '@/modules/transactions/transaction.types';
import { ArrowDownLeft, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';

export const DEFAULT_CURRENCY = 'BRL';

export const emptySummary: FinancialSummary = {
  pendingCount: 0,
  incomeInCents: 0,
  balanceInCents: 0,
  expensesInCents: 0,
} as const;

export const emptyFilterOptions: FilterOptions = {
  maxDate: null,
  minDate: null,
  states: [],
  accounts: [],
  industries: [],
};

export const summaryCardConfig = [
  {
    key: 'income',
    label: 'Receitas',
    tone: 'income' as const,
    icon: ArrowUpRight,
    description: 'Total de depositos recebidos',
  },
  {
    key: 'expenses',
    label: 'Despesas',
    tone: 'expenses' as const,
    icon: ArrowDownLeft,
    description: 'Total de saques realizados',
  },
  {
    key: 'pending',
    label: 'Pendentes',
    tone: 'pending' as const,
    icon: Clock,
    description: 'Transacoes dos ultimos 7 dias',
  },
  {
    key: 'balance',
    label: 'Saldo Total',
    tone: 'balance' as const,
    icon: TrendingUp,
    description: 'Receitas menos despesas',
  },
] as const;
