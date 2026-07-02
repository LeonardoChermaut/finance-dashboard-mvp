'use client';

import { applyFilters, deriveFilterOptions, useFilterStore } from '@/domains/filters';
import type { FilterOptions } from '@/domains/filters/filters.types';
import {
  calculateAccumulatedBalance,
  calculateFinancialSummary,
  calculateMonthlyTotals,
} from '@/domains/transactions/transaction-metrics';
import { getTransactionRepository } from '@/domains/transactions/transaction-repository-factory';
import type {
  AccumulatedBalancePoint,
  FinancialSummary,
  MonthlyTotals,
  Transaction,
} from '@/domains/transactions/transaction.types';
import { useEffect, useMemo, useState } from 'react';

type DashboardData = {
  currency: string;
  isLoading: boolean;
  error: string | null;
  summary: FinancialSummary;
  filterOptions: FilterOptions;
  monthlyTotals: readonly MonthlyTotals[];
  accumulatedBalance: readonly AccumulatedBalancePoint[];
  filteredTransactions: readonly Transaction[];
};

const DEFAULT_CURRENCY = 'BRL';

const emptySummary: FinancialSummary = {
  pendingCount: 0,
  incomeInCents: 0,
  balanceInCents: 0,
  expensesInCents: 0,
};
const emptyFilterOptions: FilterOptions = {
  maxDate: null,
  minDate: null,
  states: [],
  accounts: [],
  industries: [],
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

  const monthlyTotals = useMemo(() => {
    return calculateMonthlyTotals(filteredTransactions);
  }, [filteredTransactions]);

  const accumulatedBalance = useMemo(() => {
    return calculateAccumulatedBalance(filteredTransactions);
  }, [filteredTransactions]);

  const currency = transactions[0]?.currency ?? DEFAULT_CURRENCY;

  return {
    summary,
    monthlyTotals,
    accumulatedBalance,
    filterOptions: transactions.length > 0 ? filterOptions : emptyFilterOptions,
    currency,
    isLoading,
    error,
    filteredTransactions,
  };
};
