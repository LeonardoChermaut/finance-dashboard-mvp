import { renderHook } from '@testing-library/react';
import {
  useSearchParamsState,
  useSyncFiltersFromUrl,
  useUpdateSearchParams,
} from './use-search-params';

const mockPush = jest.fn();
const mockGet = jest.fn();
let mockSearchParamsString = '';

const mockSearchParams = {
  get: (key: string) => mockGet(key),
  toString: () => mockSearchParamsString,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/dashboard',
  useSearchParams: () => mockSearchParams,
}));

const mockSetDateRange = jest.fn();
const mockSetAccounts = jest.fn();
const mockSetIndustries = jest.fn();
const mockSetStates = jest.fn();

jest.mock('@/modules/filters', () => ({
  useFilterStore: jest.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      setDateRange: mockSetDateRange,
      setAccounts: mockSetAccounts,
      setIndustries: mockSetIndustries,
      setStates: mockSetStates,
    }),
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParamsString = '';
});

describe('useSearchParamsState', () => {
  it('Returns null for all params when none are set', () => {
    mockGet.mockReturnValue(null);
    const { result } = renderHook(() => useSearchParamsState());
    expect(result.current.dateFrom).toBeNull();
    expect(result.current.dateTo).toBeNull();
    expect(result.current.account).toBeNull();
    expect(result.current.industry).toBeNull();
    expect(result.current.state).toBeNull();
    expect(result.current.view).toBeNull();
  });

  it('Returns param values when they exist', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        account: 'Acme',
      };
      return params[key] ?? null;
    });
    const { result } = renderHook(() => useSearchParamsState());
    expect(result.current.dateFrom).toBe('2024-01-01');
    expect(result.current.dateTo).toBe('2024-12-31');
    expect(result.current.account).toBe('Acme');
  });
});

describe('useSyncFiltersFromUrl', () => {
  it('Does not call store setters when no URL params exist', () => {
    mockGet.mockReturnValue(null);
    renderHook(() => useSyncFiltersFromUrl());
    expect(mockSetDateRange).not.toHaveBeenCalled();
    expect(mockSetAccounts).not.toHaveBeenCalled();
  });

  it('Sets dateRange from URL params', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      };
      return params[key] ?? null;
    });
    renderHook(() => useSyncFiltersFromUrl());
    expect(mockSetDateRange).toHaveBeenCalledWith({
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      startTime: null,
      endTime: null,
    });
  });

  it('Sets accounts from comma-separated URL param', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = { account: 'Acme,Beta' };
      return params[key] ?? null;
    });
    renderHook(() => useSyncFiltersFromUrl());
    expect(mockSetAccounts).toHaveBeenCalledWith(['Acme', 'Beta']);
  });
});

describe('useUpdateSearchParams', () => {
  it('Returns a function', () => {
    const { result } = renderHook(() => useUpdateSearchParams());
    expect(typeof result.current).toBe('function');
  });

  it('Pushes new URL with updated params', () => {
    mockSearchParamsString = '';
    const { result } = renderHook(() => useUpdateSearchParams());
    result.current({ dateFrom: '2024-01-01' });
    expect(mockPush).toHaveBeenCalledWith('/dashboard?dateFrom=2024-01-01');
  });

  it('Removes param when value is empty string', () => {
    mockSearchParamsString = 'dateFrom=2024-01-01';
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = { dateFrom: '2024-01-01' };
      return params[key] ?? null;
    });
    const { result } = renderHook(() => useUpdateSearchParams());
    result.current({ dateFrom: '' });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('Removes param when value is undefined', () => {
    mockSearchParamsString = '';
    const { result } = renderHook(() => useUpdateSearchParams());
    result.current({ dateFrom: undefined });
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
