'use client';

import { useFilterStore } from '@/domains/filters';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type UrlSyncData = {
  syncToUrl: () => void;
};

export const useUrlSync = (): UrlSyncData => {
  const router = useRouter();
  const pathname = usePathname();
  const syncFromStoreRef = useRef(false);

  const dateRange = useFilterStore((state) => state.dateRange);
  const accounts = useFilterStore((state) => state.accounts);
  const industries = useFilterStore((state) => state.industries);
  const states = useFilterStore((state) => state.states);

  useEffect(() => {
    if (!syncFromStoreRef.current) {
      syncFromStoreRef.current = true;
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
    router.replace(newUrl);
  }, [dateRange, accounts, industries, states, router, pathname]);

  const syncToUrl = () => {
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
    router.replace(newUrl);
  };

  return {
    syncToUrl,
  };
};
