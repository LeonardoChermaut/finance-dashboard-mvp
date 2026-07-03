'use client';

import type { Transaction } from '@/domains/transactions/transaction.types';
import { exportToExcel, exportToPdf } from '@/lib/export';
import { filterTransactionsByType } from '@/utils/transaction';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type ExportData = {
  showExportMenu: boolean;
  handleExportPdf: () => void;
  handleExportExcel: () => void;
  setShowExportMenu: Dispatch<SetStateAction<boolean>>;
  handleExportFiltered: (type: 'income' | 'expenses' | 'pending' | 'balance') => void;
};

export const useExport = (
  filteredTransactions: readonly Transaction[],
  currency: string,
): ExportData => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  const handleExportPdf = useCallback(() => {
    exportToPdf();
    setShowExportMenu(false);
  }, []);

  const handleExportExcel = useCallback(() => {
    exportToExcel(filteredTransactions, currency);
    setShowExportMenu(false);
  }, [filteredTransactions, currency]);

  const handleExportFiltered = useCallback(
    (type: 'income' | 'expenses' | 'pending' | 'balance') => {
      const filtered = filterTransactionsByType(filteredTransactions, type);
      exportToExcel(filtered, currency);
      setShowExportMenu(false);
    },
    [filteredTransactions, currency],
  );

  return {
    showExportMenu,
    setShowExportMenu,
    handleExportPdf,
    handleExportExcel,
    handleExportFiltered,
  };
};
