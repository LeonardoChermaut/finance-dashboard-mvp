import type { Transaction } from '@/modules/transactions/transaction.types';
import { act, renderHook } from '@testing-library/react';
import { useDrilldown } from './use-drilldown';

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

const mockReplace = jest.fn();
const mockPathname = '/dashboard';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockPathname,
}));

beforeEach(() => jest.clearAllMocks());

describe('useDrilldown', () => {
  it('Starts with drilldownType set to null', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    expect(result.current.drilldownType).toBeNull();
  });

  it('Starts with empty drilldownSearch', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    expect(result.current.drilldownSearch).toBe('');
  });

  it('Returns empty drilldownTransactions when no type is selected', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    expect(result.current.drilldownTransactions).toEqual([]);
  });

  it('Filters transactions by income type', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => {
      result.current.setDrilldownType('income');
    });
    expect(result.current.drilldownTransactions).toHaveLength(2);
    expect(
      result.current.drilldownTransactions.every(
        (transaction) => transaction.transactionType === 'deposit',
      ),
    ).toBe(true);
  });

  it('Filters transactions by expenses type', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => {
      result.current.setDrilldownType('expenses');
    });
    expect(result.current.drilldownTransactions).toHaveLength(1);
    expect(result.current.drilldownTransactions[0].transactionType).toBe('withdraw');
  });

  it('Filters transactions by pending status', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('pending'));
    expect(result.current.drilldownTransactions).toHaveLength(1);
    expect(result.current.drilldownTransactions[0].isPending).toBe(true);
  });

  it('Calculates drilldownTotal as sum of filtered amounts', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('income'));
    expect(result.current.drilldownTotal).toBe(13000);
  });

  it('Resets drilldownSearch when type changes', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('income'));
    act(() => result.current.setDrilldownSearch('Acme'));
    act(() => result.current.setDrilldownType('expenses'));
    expect(result.current.drilldownSearch).toBe('');
  });

  it('Filters by search term matching account name', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('income'));
    act(() => result.current.setDrilldownSearch('Acme'));
    expect(result.current.filteredDrilldownTransactions).toHaveLength(2);
  });

  it('Clears all filters and calls router.replace', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('income'));
    act(() => result.current.clearAllFilters());
    expect(result.current.drilldownType).toBeNull();
    expect(result.current.drilldownSearch).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(mockPathname);
  });

  it('HandleDrilldownClose resets type and search', () => {
    const { result } = renderHook(() => useDrilldown(SAMPLE_TRANSACTIONS));
    act(() => result.current.setDrilldownType('income'));
    act(() => result.current.setDrilldownSearch('test'));
    act(() => result.current.handleDrilldownClose());
    expect(result.current.drilldownType).toBeNull();
    expect(result.current.drilldownSearch).toBe('');
  });
});
