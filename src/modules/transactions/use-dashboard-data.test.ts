import { renderHook, waitFor } from '@testing-library/react';
import type { Transaction } from '@/modules/transactions/transaction.types';
import { useDashboardData } from './use-dashboard-data';

const SAMPLE_TRANSACTIONS: readonly Transaction[] = Object.freeze([
  Object.freeze({
    id: '1',
    date: new Date('2024-01-10'),
    amountInCents: 5000,
    transactionType: 'deposit' as const,
    currency: 'BRL',
    account: 'Acme Corp',
    industry: 'Retail',
    state: 'SP',
    isPending: false,
  }),
  Object.freeze({
    id: '2',
    date: new Date('2024-02-15'),
    amountInCents: 3000,
    transactionType: 'withdraw' as const,
    currency: 'BRL',
    account: 'Beta Inc',
    industry: 'Tech',
    state: 'RJ',
    isPending: true,
  }),
  Object.freeze({
    id: '3',
    date: new Date('2024-03-20'),
    amountInCents: 8000,
    transactionType: 'deposit' as const,
    currency: 'BRL',
    account: 'Acme Corp',
    industry: 'Retail',
    state: 'SP',
    isPending: false,
  }),
]);

const createMockRepository = (transactions: readonly Transaction[] = []) => ({
  getAll: jest.fn().mockResolvedValue([...transactions]),
});

jest.mock('@/modules/transactions/transaction-repository-factory', () => ({
  getTransactionRepository: jest.fn(),
}));

jest.mock('@/modules/filters', () => ({
  useFilters: jest.fn(() => ({
    states: [],
    accounts: [],
    industries: [],
    dateRange: { startDate: null, endDate: null, startTime: null, endTime: null },
  })),
}));

const getTransactionRepositoryMock = jest.mocked(
  require('@/modules/transactions/transaction-repository-factory').getTransactionRepository,
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useDashboardData', () => {
  it('Starts with isLoading true and empty state', () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository());
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.summary.incomeInCents).toBe(0);
    expect(result.current.filteredTransactions).toEqual([]);
  });

  it('Loads transactions and sets isLoading to false', async () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository(SAMPLE_TRANSACTIONS));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.filteredTransactions).toHaveLength(3);
  });

  it('Sets error message when repository throws', async () => {
    getTransactionRepositoryMock.mockReturnValue({
      getAll: jest.fn().mockRejectedValue(new Error('Network error')),
    });
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe('Network error');
  });

  it('Calculates financial summary from loaded transactions', async () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository(SAMPLE_TRANSACTIONS));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.summary.incomeInCents).toBe(13000);
    expect(result.current.summary.expensesInCents).toBe(3000);
    expect(result.current.summary.balanceInCents).toBe(10000);
    expect(result.current.summary.pendingCount).toBe(1);
  });

  it('Returns default currency from first transaction', async () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository(SAMPLE_TRANSACTIONS));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.currency).toBe('BRL');
  });

  it('Returns default summary when loading', () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository());
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.summary).toEqual({
      pendingCount: 0,
      incomeInCents: 0,
      expensesInCents: 0,
      balanceInCents: 0,
    });
  });

  it('Computes monthly totals from transactions', async () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository(SAMPLE_TRANSACTIONS));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.monthlyTotals.length).toBeGreaterThan(0);
    expect(result.current.monthlyTotals[0]).toHaveProperty('month');
    expect(result.current.monthlyTotals[0]).toHaveProperty('depositInCents');
    expect(result.current.monthlyTotals[0]).toHaveProperty('withdrawInCents');
  });

  it('Computes accumulated balance from transactions', async () => {
    getTransactionRepositoryMock.mockReturnValue(createMockRepository(SAMPLE_TRANSACTIONS));
    const { result } = renderHook(() => useDashboardData());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.accumulatedBalance.length).toBeGreaterThan(0);
    expect(result.current.accumulatedBalance[0]).toHaveProperty('month');
    expect(result.current.accumulatedBalance[0]).toHaveProperty('balanceInCents');
  });
});
