import { act, renderHook } from '@testing-library/react';
import { usePagination } from './use-pagination';

const SAMPLE_ITEMS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

describe('usePagination', () => {
  it('Initializes with page 1 and default page size 10', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalItems).toBe(15);
    expect(result.current.totalPages).toBe(2);
  });

  it('Returns correct paginated items for first page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    expect(result.current.paginatedItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('Navigates to next page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toEqual([11, 12, 13, 14, 15]);
  });

  it('Navigates to previous page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToNextPage();
    });
    act(() => {
      result.current.goToPreviousPage();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('Navigates to first page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToNextPage();
    });
    act(() => {
      result.current.goToFirstPage();
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('Navigates to last page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToLastPage();
    });
    expect(result.current.currentPage).toBe(2);
  });

  it('Clamps page to valid range when going beyond last page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToPage(100);
    });
    expect(result.current.currentPage).toBe(2);
  });

  it('Clamps page to 1 when going below first page', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToPage(-5);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('Resets page to 1 when page size changes', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToNextPage();
    });
    expect(result.current.currentPage).toBe(2);
    act(() => {
      result.current.setPageSize(5);
    });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(5);
  });

  it('Recalculates total pages when page size changes', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    expect(result.current.totalPages).toBe(2);
    act(() => {
      result.current.setPageSize(5);
    });
    expect(result.current.totalPages).toBe(3);
  });

  it('Returns all items when page size exceeds total items', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.setPageSize(20);
    });
    expect(result.current.paginatedItems).toEqual(SAMPLE_ITEMS);
    expect(result.current.totalPages).toBe(1);
  });

  it('Handles empty array', () => {
    const { result } = renderHook(() => usePagination([]));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toEqual([]);
  });

  it('ResetPage returns to page 1', () => {
    const { result } = renderHook(() => usePagination(SAMPLE_ITEMS));
    act(() => {
      result.current.goToNextPage();
    });
    expect(result.current.currentPage).toBe(2);
    act(() => {
      result.current.resetPage();
    });
    expect(result.current.currentPage).toBe(1);
  });
});
