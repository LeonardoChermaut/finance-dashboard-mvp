'use client';

import { DashboardDrilldownPanel } from '@/components/dashboard/dashboard-drilldown-panel';
import { DashboardExportBar } from '@/components/dashboard/dashboard-export-bar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardQuickFilters } from '@/components/dashboard/dashboard-quick-filters';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import {
  ContentWrapper,
  MainContent,
  SectionDescription,
  SectionTitle,
} from '@/components/dashboard/dashboard.styled';
import type { DrilldownType } from '@/hooks';
import {
  useClickOutside,
  useDrilldown,
  useExport,
  useLocalStorage,
  useQuickFilters,
  useSyncFiltersFromUrl,
  useSyncFiltersToUrl,
} from '@/hooks';
import { useAuthStore } from '@/modules/auth';
import { useFilters } from '@/modules/filters';
import { getTransactionRepository } from '@/modules/transactions/transaction-repository-factory';
import { useDashboardData } from '@/modules/transactions/use-dashboard-data';
import { formatDate } from '@/utils/date';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const DynamicCharts = dynamic(
  () => import('@/components/charts/charts').then((module) => ({ default: module.Charts })),
  { ssr: false, loading: () => null },
);

const DynamicSummaryCards = dynamic(
  () =>
    import('@/components/summary-cards/summary-cards').then((module) => ({
      default: module.SummaryCards,
    })),
  { ssr: false, loading: () => null },
);

const dateFilterInitialState = {
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
} as const;

const DynamicFilterBar = dynamic(
  () =>
    import('@/components/filter-bar/filter-bar').then((module) => ({
      default: module.FilterBar,
    })),
  { ssr: false, loading: () => null },
);

const repository = getTransactionRepository();

const DashboardContent = () => {
  const user = useAuthStore((state) => state.user);
  const [showWelcomeToast, setShowWelcomeToast] = useLocalStorage('showWelcomeToast', false);

  useEffect(() => {
    if (showWelcomeToast) {
      setShowWelcomeToast(false);
      toast.success(`Bem-vindo, ${user?.name ?? 'usuario'}!`);
    }
  }, [showWelcomeToast, setShowWelcomeToast, user?.name]);

  const {
    summary,
    previousSummary,
    monthlyTotals,
    accumulatedBalance,
    filterOptions,
    currency,
    isLoading,
    filteredTransactions,
  } = useDashboardData(repository);
  const [currentDate] = useState<string>(() => formatDate(new Date()));
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const { dateRange, setDateRange } = useFilters();

  const isDateRangeActive = dateRange.startDate !== null || dateRange.endDate !== null;

  useSyncFiltersFromUrl();
  useSyncFiltersToUrl();

  const { activeQuickFilter, handleQuickFilter } = useQuickFilters();

  const {
    isExporting,
    showExportMenu,
    setShowExportMenu,
    handleExportPdf,
    handleExportExcel,
    handleExportFiltered,
  } = useExport(filteredTransactions, currency);

  useClickOutside(exportMenuRef, showExportMenu, () => setShowExportMenu(false));

  const {
    drilldownType,
    drilldownSearch,
    drilldownTransactions,
    filteredDrilldownTransactions,
    drilldownTotal,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setDrilldownType,
    setDrilldownSearch,
    handleDrilldownClose,
  } = useDrilldown(filteredTransactions);

  const handleCardClick = useCallback(
    (type: DrilldownType): void => {
      setDrilldownType(type);
    },
    [setDrilldownType],
  );

  const handleBarClick = useCallback(
    (month: string): void => {
      const [year, monthNumber] = month.split('-');
      const startDate = `${year}-${monthNumber}-01`;
      const lastDay = new Date(Number(year), Number(monthNumber), 0).getDate();
      const endDate = `${year}-${monthNumber}-${String(lastDay).padStart(2, '0')}`;
      setDateRange({ startDate, endDate, startTime: null, endTime: null });
    },
    [setDateRange],
  );

  const handleClearDateFilter = (): void => setDateRange(dateFilterInitialState);

  if (isLoading) {
    return (
      <MainContent>
        <ContentWrapper>
          <DashboardSkeleton />
        </ContentWrapper>
      </MainContent>
    );
  }

  return (
    <>
      <MainContent>
        <ContentWrapper data-dashboard-content>
          <DashboardHeader currentDate={currentDate} />

          <DashboardExportBar
            isExporting={isExporting}
            showExportMenu={showExportMenu}
            exportMenuRef={exportMenuRef}
            onToggleMenu={() => setShowExportMenu((prev) => !prev)}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            onExportFiltered={handleExportFiltered}
          />

          <DashboardQuickFilters
            activeQuickFilter={activeQuickFilter}
            onQuickFilter={handleQuickFilter}
          />

          <section aria-label="Filtros">
            <DynamicFilterBar filterOptions={filterOptions} />
          </section>

          <section aria-label="Resumo financeiro">
            <DynamicSummaryCards
              summary={summary}
              previousSummary={previousSummary}
              currency={currency}
              onCardClick={handleCardClick}
            />
          </section>

          <section aria-label="Graficos">
            <SectionTitle>Analises</SectionTitle>
            <SectionDescription>
              Receitas, despesas e saldo acumulado ao longo do tempo.
            </SectionDescription>
            <DynamicCharts
              monthlyTotals={monthlyTotals}
              accumulatedBalance={accumulatedBalance}
              summary={summary}
              currency={currency}
              isDateRangeActive={isDateRangeActive}
              onBarClick={handleBarClick}
              onDoughnutClick={handleCardClick}
              onClearFilter={handleClearDateFilter}
            />
          </section>
        </ContentWrapper>
      </MainContent>

      <DashboardDrilldownPanel
        data={{
          type: drilldownType,
          search: drilldownSearch,
          transactions: drilldownTransactions,
          filteredTransactions: filteredDrilldownTransactions,
          paginatedTransactions: paginatedItems,
          total: drilldownTotal,
          currency,
        }}
        actions={{
          onSearchChange: setDrilldownSearch,
          onClose: handleDrilldownClose,
          onExportFiltered: handleExportFiltered,
          goToPage,
          goToNextPage,
          goToPreviousPage,
          goToFirstPage,
          goToLastPage,
        }}
        pagination={{ currentPage, pageSize, totalItems, totalPages }}
      />
    </>
  );
};

const DashboardPage = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;
