'use client';

import type { Transaction } from '@/domains/transactions/transaction.types';
import { usePagination } from '@/hooks/use-pagination';
import { filterTransactionsByType } from '@/utils/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export type DrilldownType = 'income' | 'expenses' | 'pending' | 'balance' | null;

type DrilldownData = {
  drilldownType: DrilldownType;
  drilldownSearch: string;
  drilldownTransactions: readonly Transaction[];
  filteredDrilldownTransactions: readonly Transaction[];
  drilldownTotal: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  paginatedItems: readonly Transaction[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setDrilldownType: (type: DrilldownType) => void;
  setDrilldownSearch: (search: string) => void;
  handleDrilldownClose: () => void;
  clearAllFilters: () => void;
};

const isValidDrilldownType = (value: string | null): value is DrilldownType => {
  return value === 'income' || value === 'expenses' || value === 'pending' || value === 'balance';
};

export const useDrilldown = (filteredTransactions: readonly Transaction[]): DrilldownData => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialType = searchParams.get('type');
  const [drilldownType, setDrilldownType] = useState<DrilldownType>(
    isValidDrilldownType(initialType) ? initialType : null,
  );
  const [drilldownSearch, setDrilldownSearch] = useState<string>('');

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
  } = usePagination(filteredDrilldownTransactions, 10);

  const drilldownTotal = drilldownTransactions.reduce(
    (sum, transaction) => sum + transaction.amountInCents,
    0,
  );

  const removeTypeFromUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');
    const queryString = params.toString();
    const newUrl = queryString !== '' ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl);
  }, [searchParams, router, pathname]);

  const handleDrilldownClose = useCallback(() => {
    setDrilldownType(null);
    setDrilldownSearch('');
    removeTypeFromUrl();
  }, [removeTypeFromUrl]);

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
