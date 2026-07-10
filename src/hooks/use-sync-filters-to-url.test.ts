import { renderHook } from '@testing-library/react';
import { useSyncFiltersToUrl } from './use-sync-filters-to-url';

const mockReplaceState = jest.fn();

Object.defineProperty(window, 'history', {
  value: { replaceState: mockReplaceState },
  writable: true,
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

const mockStoreState = {
  states: [] as string[],
  accounts: [] as string[],
  industries: [] as string[],
  dateRange: {
    startDate: null as string | null,
    endDate: null as string | null,
    startTime: null as string | null,
    endTime: null as string | null,
  },
};

jest.mock('@/modules/filters', () => ({
  useFilters: jest.fn(() => mockStoreState),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockStoreState.states = [];
  mockStoreState.accounts = [];
  mockStoreState.industries = [];
  mockStoreState.dateRange = {
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  };
});

describe('useSyncFiltersToUrl', () => {
  it('Does not call replaceState on first render', () => {
    renderHook(() => useSyncFiltersToUrl());
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it('Does not call replaceState when filters are empty on rerender', () => {
    const { rerender } = renderHook(() => useSyncFiltersToUrl());
    rerender();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it('Updates URL when dateRange has values', () => {
    const { rerender } = renderHook(() => useSyncFiltersToUrl());

    mockStoreState.dateRange = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      startTime: null,
      endTime: null,
    };
    rerender();

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('dateFrom=2024-01-01'),
    );
  });

  it('Updates URL when accounts are selected', () => {
    const { rerender } = renderHook(() => useSyncFiltersToUrl());

    mockStoreState.accounts = ['Acme', 'Beta'];
    rerender();

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('account=Acme%2CBeta'),
    );
  });

  it('Updates URL when states are selected', () => {
    const { rerender } = renderHook(() => useSyncFiltersToUrl());

    mockStoreState.states = ['SP', 'RJ'];
    rerender();

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('state=SP%2CRJ'),
    );
  });

  it('Produces clean URL without query string when all filters are empty', () => {
    const { rerender } = renderHook(() => useSyncFiltersToUrl());
    rerender();

    expect(mockReplaceState).not.toHaveBeenCalledWith(null, '', expect.stringContaining('?'));
  });
});
