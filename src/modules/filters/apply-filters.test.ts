import { applyFilters, deriveFilterOptions } from '@/modules/filters/apply-filters';
import type { FilterState } from '@/modules/filters/filters.types';
import type { Transaction } from '@/modules/transactions/transaction.types';

const buildTransaction = (overrides: Partial<Transaction>): Transaction => {
  return Object.freeze({
    id: '0-1',
    date: new Date('2024-01-15T12:00:00.000Z'),
    amountInCents: 10000,
    transactionType: 'deposit',
    currency: 'BRL',
    account: 'Conta Corrente',
    industry: 'Tecnologia',
    state: 'SP',
    isPending: false,
    ...overrides,
  });
};

const buildFilterState = (overrides: Partial<FilterState>): FilterState => {
  return {
    accounts: [],
    industries: [],
    states: [],
    dateRange: { startDate: null, endDate: null, startTime: null, endTime: null },
    ...overrides,
  };
};

const transactions = Object.freeze([
  buildTransaction({
    date: new Date('2024-01-10T12:00:00.000Z'),
    account: 'Conta Corrente',
    industry: 'Tecnologia',
    state: 'SP',
  }),

  buildTransaction({
    date: new Date('2024-02-10T12:00:00.000Z'),
    account: 'Conta Poupanca',
    industry: 'Varejo',
    state: 'RJ',
  }),

  buildTransaction({
    date: new Date('2024-03-10T12:00:00.000Z'),
    account: 'Conta Corrente',
    industry: 'Saude',
    state: 'MG',
  }),
]);

describe('deriveFilterOptions', () => {
  it('Derive filter options from transactions', () => {
    const options = deriveFilterOptions(transactions);

    expect(options.accounts).toEqual(['Conta Corrente', 'Conta Poupanca']);
    expect(options.industries).toEqual(['Saude', 'Tecnologia', 'Varejo']);
    expect(options.states).toEqual(['MG', 'RJ', 'SP']);
    expect(options.minDate).toBe('2024-01-10');
    expect(options.maxDate).toBe('2024-03-10');
  });

  it('Derive empty filter options for empty transactions list', () => {
    const options = deriveFilterOptions(Object.freeze([]));

    expect(options.accounts).toEqual([]);
    expect(options.minDate).toBeNull();
    expect(options.maxDate).toBeNull();
  });
});

describe('applyFilters', () => {
  it('Return all transactions without filters', () => {
    const result = applyFilters(transactions, buildFilterState({}));

    expect(result).toHaveLength(3);
  });

  it('Filter by selected account', () => {
    const result = applyFilters(transactions, buildFilterState({ accounts: ['Conta Corrente'] }));

    expect(result).toHaveLength(2);
    expect(result.every((transaction) => transaction.account === 'Conta Corrente')).toBe(true);
  });

  it('Filter by date range (inclusive)', () => {
    const result = applyFilters(
      transactions,
      buildFilterState({
        dateRange: {
          startDate: '2024-02-01',
          endDate: '2024-02-28',
          startTime: null,
          endTime: null,
        },
      }),
    );

    expect(result).toHaveLength(1);
    expect(result[0].state).toBe('RJ');
  });

  it('Combine multiple filters cumulatively', () => {
    const result = applyFilters(
      transactions,
      buildFilterState({ accounts: ['Conta Corrente'], states: ['MG'] }),
    );

    expect(result).toHaveLength(1);
    expect(result[0].industry).toBe('Saude');
  });
});
