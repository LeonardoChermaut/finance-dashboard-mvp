'use client';

import { useFilters } from '@/modules/filters';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const useSyncFiltersToUrl = (): void => {
  const pathname = usePathname();
  const hasSyncedRef = useRef(false);

  const { dateRange, accounts, industries, states } = useFilters();

  useEffect(() => {
    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;
      return;
    }

    const params = new URLSearchParams();

    if (dateRange.startDate !== null) {
      params.set('dateFrom', dateRange.startDate);
    }
    if (dateRange.endDate !== null) {
      params.set('dateTo', dateRange.endDate);
    }
    if (dateRange.startTime !== null) {
      params.set('startTime', dateRange.startTime);
    }
    if (dateRange.endTime !== null) {
      params.set('endTime', dateRange.endTime);
    }
    if (accounts.length > 0) {
      params.set('account', accounts.join(','));
    }
    if (industries.length > 0) {
      params.set('industry', industries.join(','));
    }
    if (states.length > 0) {
      params.set('state', states.join(','));
    }

    const queryString = params.toString();
    const newUrl = queryString !== '' ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, '', newUrl);
  }, [dateRange, accounts, industries, states, pathname]);
};
