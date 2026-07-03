import { ArrowDownLeft, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';

export const drilldownConfig: Record<
  string,
  { label: string; icon: typeof ArrowUpRight; color: string }
> = {
  income: { label: 'Receitas', icon: ArrowUpRight, color: 'income' },
  expenses: { label: 'Despesas', icon: ArrowDownLeft, color: 'expense' },
  pending: { label: 'Pendentes', icon: Clock, color: 'warning' },
  balance: { label: 'Saldo Total', icon: TrendingUp, color: 'secondary' },
} as const;
