import { act, renderHook } from '@testing-library/react';
import { useQuickFilters } from './use-quick-filters';

const mockSetDateRange = jest.fn();
const mockResetFilters = jest.fn();

jest.mock('@/modules/filters', () => ({
  useFilterStore: jest.fn((selector) =>
    selector({
      setDateRange: mockSetDateRange,
      resetFilters: mockResetFilters,
    }),
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-06-15T12:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useQuickFilters', () => {
  it('Starts with no active quick filter', () => {
    const { result } = renderHook(() => useQuickFilters());
    expect(result.current.activeQuickFilter).toBeNull();
  });

  it('Sets active filter and calls setDateRange for 7d period', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('7d'));
    expect(result.current.activeQuickFilter).toBe('7d');
    expect(mockSetDateRange).toHaveBeenCalledTimes(1);
  });

  it('Computes correct start date for 1m period', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('1m'));
    const call = mockSetDateRange.mock.calls[0][0];
    expect(call.startDate).toBe('2024-05-15');
    expect(call.endDate).toBe('2024-06-15');
  });

  it('Computes correct start date for 3m period', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('3m'));
    const call = mockSetDateRange.mock.calls[0][0];
    expect(call.startDate).toBe('2024-03-15');
  });

  it('Computes correct start date for 1y period', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('1y'));
    const call = mockSetDateRange.mock.calls[0][0];
    expect(call.startDate).toBe('2023-06-15');
  });

  it('Resets filters when same period is selected twice', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('7d'));
    act(() => result.current.handleQuickFilter('7d'));
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
    expect(result.current.activeQuickFilter).toBeNull();
  });

  it('Switches to new filter when different period is selected', () => {
    const { result } = renderHook(() => useQuickFilters());
    act(() => result.current.handleQuickFilter('7d'));
    act(() => result.current.handleQuickFilter('1m'));
    expect(result.current.activeQuickFilter).toBe('1m');
    expect(mockSetDateRange).toHaveBeenCalledTimes(2);
    expect(mockResetFilters).not.toHaveBeenCalled();
  });
});
