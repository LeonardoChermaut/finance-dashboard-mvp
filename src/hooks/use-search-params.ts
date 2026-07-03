'use client';

import { useFilterStore } from '@/domains/filters';
import type { DateRange } from '@/domains/filters/filters.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

type DashboardSearchParams = {
  dateFrom: string | null;
  dateTo: string | null;
  startTime: string | null;
  endTime: string | null;
  account: string | null;
  industry: string | null;
  state: string | null;
  view: string | null;
};

type UpdateSearchParamsInput = Partial<DashboardSearchParams>;

export const useSearchParamsState = (): DashboardSearchParams => {
  const searchParams = useSearchParams();

  return {
    dateFrom: searchParams.get('dateFrom'),
    dateTo: searchParams.get('dateTo'),
    startTime: searchParams.get('startTime'),
    endTime: searchParams.get('endTime'),
    account: searchParams.get('account'),
    industry: searchParams.get('industry'),
    state: searchParams.get('state'),
    view: searchParams.get('view'),
  };
};

export const useSyncFiltersFromUrl = (): void => {
  const searchParams = useSearchParams();
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const setAccounts = useFilterStore((state) => state.setAccounts);
  const setIndustries = useFilterStore((state) => state.setIndustries);
  const setStates = useFilterStore((state) => state.setStates);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) {
      return;
    }
    hasSyncedRef.current = true;

    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const account = searchParams.get('account');
    const industry = searchParams.get('industry');
    const stateParam = searchParams.get('state');

    const hasUrlParams =
      dateFrom !== null ||
      dateTo !== null ||
      startTime !== null ||
      endTime !== null ||
      account !== null ||
      industry !== null ||
      stateParam !== null;

    if (!hasUrlParams) {
      return;
    }

    const dateRange: DateRange = {
      startDate: dateFrom,
      endDate: dateTo,
      startTime,
      endTime,
    };
    setDateRange(dateRange);

    if (account !== null) {
      setAccounts(account.split(',').filter((value) => value !== ''));
    }
    if (industry !== null) {
      setIndustries(industry.split(',').filter((value) => value !== ''));
    }
    if (stateParam !== null) {
      setStates(stateParam.split(',').filter((value) => value !== ''));
    }
  }, [searchParams, setDateRange, setAccounts, setIndustries, setStates]);
};

export const useUpdateSearchParams = (): ((input: UpdateSearchParamsInput) => void) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (input: UpdateSearchParamsInput) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(input).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, value ?? '');
        }
      });

      const queryString = params.toString();
      const newUrl = queryString !== '' ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl);
    },
    [router, pathname, searchParams],
  );

  return updateSearchParams;
};
