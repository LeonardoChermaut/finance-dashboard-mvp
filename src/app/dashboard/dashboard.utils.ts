import { ArrowDownLeft, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getVisiblePages = (current: number, total: number): readonly number[] => {
  if (total <= 5) {
    return Array.from({ length: total }, (_unused, index) => index + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  }
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }

  return [current - 2, current - 1, current, current + 1, current + 2];
};

export const drilldownConfig: Record<
  string,
  { label: string; icon: typeof ArrowUpRight; color: string }
> = {
  income: { label: 'Receitas', icon: ArrowUpRight, color: 'income' },
  expenses: { label: 'Despesas', icon: ArrowDownLeft, color: 'expense' },
  pending: { label: 'Pendentes', icon: Clock, color: 'warning' },
  balance: { label: 'Saldo Total', icon: TrendingUp, color: 'secondary' },
} as const;
