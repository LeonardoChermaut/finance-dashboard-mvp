import type { FilterOptions, FilterState } from '@/domains/filters/filters.types';
import type { Transaction } from '@/domains/transactions/transaction.types';
import { formatDateToInputValue } from '@/lib/date';

const buildSortedUniqueValues = (values: readonly string[]): readonly string[] => {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
};

export const deriveFilterOptions = (transactions: readonly Transaction[]): FilterOptions => {
  if (transactions.length === 0) {
    return {
      accounts: [],
      industries: [],
      states: [],
      minDate: null,
      maxDate: null,
    };
  }

  const inputDates = transactions
    .map((transaction) => formatDateToInputValue(transaction.date))
    .sort((left, right) => left.localeCompare(right));

  return {
    accounts: buildSortedUniqueValues(transactions.map((transaction) => transaction.account)),
    industries: buildSortedUniqueValues(transactions.map((transaction) => transaction.industry)),
    states: buildSortedUniqueValues(transactions.map((transaction) => transaction.state)),
    minDate: inputDates[0],
    maxDate: inputDates[inputDates.length - 1],
  };
};

const matchesSelection = (value: string, selectedValues: readonly string[]): boolean => {
  if (selectedValues.length === 0) {
    return true;
  }
  return selectedValues.includes(value);
};

const matchesDateRange = (transaction: Transaction, filterState: FilterState): boolean => {
  const transactionDate = formatDateToInputValue(transaction.date);
  if (filterState.dateRange.startDate && transactionDate < filterState.dateRange.startDate) {
    return false;
  }
  if (filterState.dateRange.endDate && transactionDate > filterState.dateRange.endDate) {
    return false;
  }
  return true;
};

export const applyFilters = (
  transactions: readonly Transaction[],
  filterState: FilterState,
): readonly Transaction[] => {
  return transactions.filter((transaction) => {
    return (
      matchesDateRange(transaction, filterState) &&
      matchesSelection(transaction.account, filterState.accounts) &&
      matchesSelection(transaction.industry, filterState.industries) &&
      matchesSelection(transaction.state, filterState.states)
    );
  });
};
