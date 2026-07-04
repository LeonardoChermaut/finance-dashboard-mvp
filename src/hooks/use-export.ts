'use client';

import { useDelay } from '@/hooks/use-delay';
import { exportToExcel, exportToPdf } from '@/lib/export';
import type { Transaction } from '@/modules/transactions/transaction.types';
import { filterTransactionsByType } from '@/utils/transaction';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import type { DrilldownCategory } from './use-drilldown';

type ExportData = {
  isExporting: boolean;
  showExportMenu: boolean;
  handleExportPdf: () => void;
  handleExportExcel: () => void;
  setShowExportMenu: Dispatch<SetStateAction<boolean>>;
  handleExportFiltered: (type: DrilldownCategory) => void;
};

export const useExport = (
  filteredTransactions: readonly Transaction[],
  currency: string,
): ExportData => {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const { isLoading: isExporting, execute: executeExport } = useDelay<void>(2000);

  const handleExportPdf = useCallback(() => {
    executeExport(async () => {
      exportToPdf();
      setShowExportMenu(false);
    });
  }, [executeExport]);

  const handleExportExcel = useCallback(() => {
    executeExport(async () => {
      exportToExcel(filteredTransactions, currency);
      setShowExportMenu(false);
    });
  }, [executeExport, filteredTransactions, currency]);

  const handleExportFiltered = useCallback(
    (type: DrilldownCategory) => {
      executeExport(async () => {
        const filtered = filterTransactionsByType(filteredTransactions, type);
        exportToExcel(filtered, currency);
        setShowExportMenu(false);
      });
    },
    [executeExport, filteredTransactions, currency],
  );

  return {
    isExporting,
    showExportMenu,
    setShowExportMenu,
    handleExportPdf,
    handleExportExcel,
    handleExportFiltered,
  };
};
