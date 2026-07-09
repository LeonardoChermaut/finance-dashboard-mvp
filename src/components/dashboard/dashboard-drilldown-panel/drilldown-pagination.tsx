'use client';

import { getVisiblePages } from '@/utils/pagination';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  PaginationButton,
  PaginationButtons,
  PaginationContainer,
  PaginationInfo,
  PaginationPageButton,
} from './dashboard-drilldown-panel.styled';

type DrilldownPaginationProps = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
};

export const DrilldownPagination = ({
  currentPage,
  totalItems,
  totalPages,
  pageSize,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  goToFirstPage,
  goToLastPage,
}: DrilldownPaginationProps) => {
  const paginationStart = (currentPage - 1) * pageSize + 1;
  const paginationEnd = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <PaginationContainer>
      <PaginationInfo>
        {paginationStart}-{paginationEnd} de {totalItems} transacoes
      </PaginationInfo>
      <PaginationButtons>
        <PaginationButton
          type="button"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          aria-label="Primeira pagina"
        >
          <ChevronsLeft size={16} />
        </PaginationButton>
        <PaginationButton
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={16} />
        </PaginationButton>
        {getVisiblePages(currentPage, totalPages).map((page) => (
          <PaginationPageButton
            key={page}
            type="button"
            $active={page === currentPage}
            onClick={() => goToPage(page)}
            aria-label={`Pagina ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </PaginationPageButton>
        ))}
        <PaginationButton
          type="button"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          aria-label="Proxima pagina"
        >
          <ChevronRight size={16} />
        </PaginationButton>
        <PaginationButton
          type="button"
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          aria-label="Ultima pagina"
        >
          <ChevronsRight size={16} />
        </PaginationButton>
      </PaginationButtons>
    </PaginationContainer>
  );
};
