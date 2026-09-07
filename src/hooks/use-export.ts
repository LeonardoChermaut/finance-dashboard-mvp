'use client';

import { useDelay } from '@/hooks/use-delay';
import { exportToExcel, exportToPdf } from '@/lib/export';
import { useFilters } from '@/modules/filters';
import type { Transaction } from '@/modules/transactions/transaction.types';
import { filterTransactionsByType } from '@/utils/transaction';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import type { DrilldownCategory } from './use-drilldown';

type ExportData = {
  totalCount: number;
  isExporting: boolean;
  filteredCount: number;
  showExportMenu: boolean;
  showExportDialog: boolean;
  hasActiveFilters: boolean;
  setShowExportMenu: Dispatch<SetStateAction<boolean>>;
  handleExportPdf: () => void;
  handleExportAll: () => void;
  openExportDialog: () => void;
  closeExportDialog: () => void;
  handleExportExcel: () => void;
  handleExportFiltered: (type?: DrilldownCategory) => void;
};

const buildSuffix = (type?: DrilldownCategory, isFiltered?: boolean): string => {
  const parts: string[] = [];
  if (isFiltered) {
    parts.push('filtrado');
  }

  if (type === 'income') {
    parts.push('receitas');
  } else if (type === 'expenses') {
    parts.push('despesas');
  } else if (type === 'pending') {
    parts.push('pendentes');
  }
  return parts.length > 0 ? parts.join('-') : 'export';
};

export const useExport = (
  filteredTransactions: readonly Transaction[],
  allTransactions: readonly Transaction[],
  currency: string,
): ExportData => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const { isLoading: isExporting, execute: executeExport } = useDelay<void>(2000);

  const { dateRange, accounts, industries, states } = useFilters();

  const hasActiveFilters = useMemo(() => {
    const hasDateRange = dateRange.startDate !== null || dateRange.endDate !== null;
    return hasDateRange || accounts.length > 0 || industries.length > 0 || states.length > 0;
  }, [dateRange, accounts, industries, states]);

  const filteredCount = filteredTransactions.length;
  const totalCount = allTransactions.length;

  const handleExportPdf = useCallback(() => {
    executeExport(async () => {
      exportToPdf();
      setShowExportMenu(false);
    });
  }, [executeExport]);

  const handleExportExcel = useCallback(() => {
    executeExport(async () => {
      const suffix = hasActiveFilters ? buildSuffix(undefined, true) : 'export';
      exportToExcel(filteredTransactions, currency, suffix);
      setShowExportMenu(false);
    });
  }, [executeExport, filteredTransactions, currency, hasActiveFilters]);

  const handleExportFiltered = useCallback(
    (type?: DrilldownCategory) => {
      executeExport(async () => {
        const transactions = type
          ? filterTransactionsByType(filteredTransactions, type)
          : filteredTransactions;
        const suffix = buildSuffix(type, true);
        exportToExcel(transactions, currency, suffix);
        setShowExportMenu(false);
        setShowExportDialog(false);
      });
    },
    [executeExport, filteredTransactions, currency],
  );

  const handleExportAll = useCallback(() => {
    executeExport(async () => {
      exportToExcel(allTransactions, currency, 'todos');
      setShowExportMenu(false);
      setShowExportDialog(false);
    });
  }, [executeExport, allTransactions, currency]);

  const openExportDialog = useCallback(() => {
    setShowExportDialog(true);
    setShowExportMenu(false);
  }, []);

  const closeExportDialog = useCallback(() => setShowExportDialog(false), []);

  return {
    isExporting,
    showExportMenu,
    showExportDialog,
    hasActiveFilters,
    filteredCount,
    totalCount,
    handleExportPdf,
    handleExportExcel,
    setShowExportMenu,
    handleExportFiltered,
    handleExportAll,
    openExportDialog,
    closeExportDialog,
  };
};
