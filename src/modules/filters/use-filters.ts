import { useShallow } from 'zustand/react/shallow';
import { useFilterStore } from './use-filters-store';

export const useFilters = () =>
  useFilterStore(
    useShallow((state) => ({
      states: state.states,
      accounts: state.accounts,
      dateRange: state.dateRange,
      industries: state.industries,
      setStates: state.setStates,
      toggleState: state.toggleState,
      setAccounts: state.setAccounts,
      setDateRange: state.setDateRange,
      resetFilters: state.resetFilters,
      toggleAccount: state.toggleAccount,
      setIndustries: state.setIndustries,
      toggleIndustry: state.toggleIndustry,
    })),
  );
