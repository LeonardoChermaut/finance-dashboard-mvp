import { useCallback, useMemo, useState } from 'react';

type PaginationResult<T> = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly paginatedItems: readonly T[];
  readonly goToPage: (page: number) => void;
  readonly goToNextPage: () => void;
  readonly goToPreviousPage: () => void;
  readonly goToFirstPage: () => void;
  readonly goToLastPage: () => void;
  readonly setPageSize: (size: number) => void;
};

export const usePagination = <T>(
  items: readonly T[],
  initialPageSize: number = 10,
): PaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, safeCurrentPage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clampedPage);
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    goToPage(safeCurrentPage + 1);
  }, [goToPage, safeCurrentPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(safeCurrentPage - 1);
  }, [goToPage, safeCurrentPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
  };
};
