import { FILTERS_STORAGE_KEY } from '@/constants/config';
import type { DateRange, FilterState } from '@/modules/filters/filters.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptyFilterState: FilterState = {
  dateRange: { startDate: null, endDate: null, startTime: null, endTime: null },
  accounts: [],
  industries: [],
  states: [],
};

type FilterStore = FilterState & {
  resetFilters: () => void;
  toggleState: (state: string) => void;
  toggleAccount: (account: string) => void;
  toggleIndustry: (industry: string) => void;
  setDateRange: (dateRange: DateRange) => void;
  setStates: (states: string[]) => void;
  setAccounts: (accounts: string[]) => void;
  setIndustries: (industries: string[]) => void;
};

const toggleValue = (values: string[], value: string): string[] => {
  if (values.includes(value)) {
    return values.filter((currentValue) => currentValue !== value);
  }
  return [...values, value];
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...emptyFilterState,
      setDateRange: (dateRange) => set({ dateRange }),
      toggleAccount: (account) =>
        set((state) => ({ accounts: toggleValue(state.accounts, account) })),
      toggleIndustry: (industry) =>
        set((state) => ({ industries: toggleValue(state.industries, industry) })),
      toggleState: (stateName) =>
        set((state) => ({ states: toggleValue(state.states, stateName) })),
      setAccounts: (accounts) => set({ accounts }),
      setIndustries: (industries) => set({ industries }),
      setStates: (states) => set({ states }),
      resetFilters: () => set({ ...emptyFilterState }),
    }),
    { name: FILTERS_STORAGE_KEY },
  ),
);
