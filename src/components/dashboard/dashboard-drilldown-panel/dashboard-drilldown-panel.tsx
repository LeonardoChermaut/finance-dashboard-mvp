'use client';

import type { DrilldownCategory, DrilldownType } from '@/hooks/use-drilldown';
import type { Transaction } from '@/modules/transactions/transaction.types';
import { DrilldownHeader } from './drilldown-header';
import { DrilldownPagination } from './drilldown-pagination';
import { DrilldownSearch } from './drilldown-search';
import { DrilldownTotal } from './drilldown-total';
import { DrilldownTransactions } from './drilldown-transactions';
import { DrilldownOverlay, DrilldownPanel } from './dashboard-drilldown-panel.styled';

export type DrilldownData = {
  type: DrilldownType;
  search: string;
  transactions: readonly Transaction[];
  filteredTransactions: readonly Transaction[];
  paginatedTransactions: readonly Transaction[];
  total: number;
  currency: string;
};

export type DrilldownPaginationState = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type DrilldownActions = {
  onSearchChange: (search: string) => void;
  onClose: () => void;
  onExportFiltered: (type: DrilldownCategory) => void;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
};

type DashboardDrilldownPanelProps = {
  data: DrilldownData;
  pagination: DrilldownPaginationState;
  actions: DrilldownActions;
};

export const DashboardDrilldownPanel = ({
  data,
  pagination,
  actions,
}: DashboardDrilldownPanelProps) => {
  if (data.type === null) {
    return null;
  }

  return (
    <DrilldownOverlay>
      <DrilldownPanel>
        <DrilldownHeader
          drilldownType={data.type}
          onExportFiltered={actions.onExportFiltered}
          onClose={actions.onClose}
        />

        <DrilldownSearch search={data.search} onSearchChange={actions.onSearchChange} />

        <DrilldownTotal
          drilldownType={data.type}
          total={data.total}
          transactionCount={data.transactions.length}
          currency={data.currency}
        />

        <DrilldownTransactions
          transactions={data.paginatedTransactions}
          hasFilteredTransactions={data.filteredTransactions.length > 0}
          currency={data.currency}
        />

        <DrilldownPagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          goToPage={actions.goToPage}
          goToNextPage={actions.goToNextPage}
          goToPreviousPage={actions.goToPreviousPage}
          goToFirstPage={actions.goToFirstPage}
          goToLastPage={actions.goToLastPage}
        />
      </DrilldownPanel>
    </DrilldownOverlay>
  );
};
