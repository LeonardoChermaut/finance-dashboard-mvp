'use client';

import { DEFAULT_CURRENCY, emptyFilterOptions, emptySummary } from '@/constants/dashboard';
import { useFilters } from '@/modules/filters';
import { applyFilters, deriveFilterOptions } from '@/modules/filters/apply-filters';
import type { FilterOptions } from '@/modules/filters/filters.types';
import {
  calculateAccumulatedBalance,
  calculateFinancialSummary,
  calculateMonthlyTotals,
} from '@/modules/transactions/transaction-metrics';
import type { ITransactionRepository } from '@/modules/transactions/transaction-repository';
import { getTransactionRepository } from '@/modules/transactions/transaction-repository-factory';
import type {
  AccumulatedBalancePoint,
  FinancialSummary,
  MonthlyTotals,
  Transaction,
} from '@/modules/transactions/transaction.types';
import { useEffect, useMemo, useState } from 'react';

type DashboardData = {
  currency: string;
  isLoading: boolean;
  error: string | null;
  summary: FinancialSummary;
  filterOptions: FilterOptions;
  previousSummary: FinancialSummary;
  monthlyTotals: MonthlyTotals[];
  filteredTransactions: Transaction[];
  accumulatedBalance: AccumulatedBalancePoint[];
};

export const useDashboardData = (repository?: ITransactionRepository): DashboardData => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { dateRange, accounts, industries, states } = useFilters();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (): Promise<void> => {
      try {
        const repo = repository ?? getTransactionRepository();
        const data = await repo.getAll();
        if (isMounted) {
          setTransactions(data);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Erro ao carregar dados';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [repository]);

  const filterOptions = useMemo(() => deriveFilterOptions(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () => applyFilters(transactions, { dateRange, accounts, industries, states }),
    [transactions, dateRange, accounts, industries, states],
  );

  const summary = useMemo(() => {
    if (isLoading) {
      return emptySummary;
    }

    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions, isLoading]);

  const previousSummary = useMemo(() => {
    if (isLoading || filteredTransactions.length === 0) {
      return emptySummary;
    }

    const midpoint = Math.floor(filteredTransactions.length / 2);
    const previousTransactions = filteredTransactions.slice(0, midpoint);

    return calculateFinancialSummary(previousTransactions);
  }, [filteredTransactions, isLoading]);

  const monthlyTotals = useMemo(
    () => calculateMonthlyTotals(filteredTransactions),
    [filteredTransactions],
  );

  const accumulatedBalance = useMemo(
    () => calculateAccumulatedBalance(filteredTransactions),
    [filteredTransactions],
  );

  const currency = transactions[0]?.currency ?? DEFAULT_CURRENCY;

  return {
    summary,
    previousSummary,
    monthlyTotals,
    accumulatedBalance,
    filterOptions: transactions.length > 0 ? filterOptions : emptyFilterOptions,
    currency,
    isLoading,
    error,
    filteredTransactions,
  };
};
