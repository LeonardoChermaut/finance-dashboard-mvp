'use client';

import { DEFAULT_CURRENCY, emptyFilterOptions, emptySummary } from '@/constants/dashboard';
import { applyFilters, deriveFilterOptions, useFilterStore } from '@/modules/filters';
import type { FilterOptions } from '@/modules/filters/filters.types';
import {
  calculateAccumulatedBalance,
  calculateFinancialSummary,
  calculateMonthlyTotals,
} from '@/modules/transactions/transaction-metrics';
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
  monthlyTotals: readonly MonthlyTotals[];
  accumulatedBalance: readonly AccumulatedBalancePoint[];
  filteredTransactions: readonly Transaction[];
};

export const useDashboardData = (): DashboardData => {
  const [transactions, setTransactions] = useState<readonly Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const states = useFilterStore((state) => state.states);
  const accounts = useFilterStore((state) => state.accounts);
  const dateRange = useFilterStore((state) => state.dateRange);
  const industries = useFilterStore((state) => state.industries);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (): Promise<void> => {
      try {
        const data = await getTransactionRepository().getAll();
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
  }, []);

  const filterOptions = useMemo(() => {
    return deriveFilterOptions(transactions);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return applyFilters(transactions, {
      dateRange,
      accounts,
      industries,
      states,
    });
  }, [transactions, dateRange, accounts, industries, states]);

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

  const monthlyTotals = useMemo(() => {
    return calculateMonthlyTotals(filteredTransactions);
  }, [filteredTransactions]);

  const accumulatedBalance = useMemo(() => {
    return calculateAccumulatedBalance(filteredTransactions);
  }, [filteredTransactions]);

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
