'use client';

import { usePagination } from '@/hooks/use-pagination';
import type { Transaction } from '@/modules/transactions/transaction.types';
import { filterTransactionsByType } from '@/utils/transaction';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type DrilldownCategory = 'income' | 'expenses' | 'pending' | 'balance';

export type DrilldownType = DrilldownCategory | null;

type DrilldownData = {
  drilldownType: DrilldownType;
  drilldownSearch: string;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  drilldownTotal: number;

  paginatedItems: readonly Transaction[];
  drilldownTransactions: readonly Transaction[];
  filteredDrilldownTransactions: readonly Transaction[];

  goToNextPage: () => void;
  goToLastPage: () => void;
  goToFirstPage: () => void;
  clearAllFilters: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  handleDrilldownClose: () => void;
  setDrilldownSearch: (search: string) => void;
  setDrilldownType: (type: DrilldownType) => void;
};

export const useDrilldown = (filteredTransactions: readonly Transaction[]): DrilldownData => {
  const router = useRouter();
  const pathname = usePathname();

  const [drilldownSearch, setDrilldownSearch] = useState<string>('');
  const [drilldownType, setDrilldownType] = useState<DrilldownType>(null);

  const drilldownTransactions = useMemo(() => {
    if (drilldownType === null) {
      return [];
    }
    return filterTransactionsByType(filteredTransactions, drilldownType);
  }, [filteredTransactions, drilldownType]);

  const filteredDrilldownTransactions = useMemo(() => {
    if (drilldownSearch === '') {
      return drilldownTransactions;
    }

    const lowerSearch = drilldownSearch.toLowerCase();

    return drilldownTransactions.filter((transaction) => {
      const dateStr = transaction.date.toLocaleDateString('pt-BR');
      const timeStr = transaction.date.toLocaleTimeString('pt-BR');
      const dateTimeStr = `${dateStr} ${timeStr}`;

      return (
        transaction.account.toLowerCase().includes(lowerSearch) ||
        transaction.industry.toLowerCase().includes(lowerSearch) ||
        transaction.state.toLowerCase().includes(lowerSearch) ||
        dateStr.toLowerCase().includes(lowerSearch) ||
        timeStr.toLowerCase().includes(lowerSearch) ||
        dateTimeStr.toLowerCase().includes(lowerSearch)
      );
    });
  }, [drilldownTransactions, drilldownSearch]);

  const {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    resetPage,
  } = usePagination(filteredDrilldownTransactions, 10);

  useEffect(() => {
    resetPage();
    setDrilldownSearch('');
  }, [drilldownType, resetPage]);

  const drilldownTotal = drilldownTransactions.reduce(
    (sum, transaction) => sum + transaction.amountInCents,
    0,
  );

  const handleDrilldownClose = useCallback(() => {
    setDrilldownType(null);
    setDrilldownSearch('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setDrilldownType(null);
    setDrilldownSearch('');
    router.replace(pathname);
  }, [router, pathname]);

  return {
    drilldownType,
    drilldownSearch,
    drilldownTransactions,
    filteredDrilldownTransactions,
    drilldownTotal,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setDrilldownType,
    setDrilldownSearch,
    handleDrilldownClose,
    clearAllFilters,
  };
};
