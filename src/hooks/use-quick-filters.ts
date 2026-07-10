'use client';

import { useFilters } from '@/modules/filters';
import { useCallback, useState } from 'react';

export type QuickFilterPeriod = '7d' | '1m' | '3m' | '1y';

type QuickFilterData = {
  activeQuickFilter: string | null;
  handleQuickFilter: (period: QuickFilterPeriod) => void;
};

const getQuickRange = (period: QuickFilterPeriod): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '7d': {
      startDate.setDate(endDate.getDate() - 7);
      break;
    }
    case '1m': {
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    }
    case '3m': {
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    }
    case '1y': {
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    }
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const useQuickFilters = (): QuickFilterData => {
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const { setDateRange, resetFilters } = useFilters();

  const handleQuickFilter = useCallback(
    (period: QuickFilterPeriod) => {
      if (activeQuickFilter === period) {
        resetFilters();
        setActiveQuickFilter(null);
        return;
      }
      const range = getQuickRange(period);
      setDateRange({
        startDate: range.startDate,
        endDate: range.endDate,
        startTime: null,
        endTime: null,
      });
      setActiveQuickFilter(period);
    },
    [activeQuickFilter, setDateRange, resetFilters],
  );

  return {
    activeQuickFilter,
    handleQuickFilter,
  };
};
