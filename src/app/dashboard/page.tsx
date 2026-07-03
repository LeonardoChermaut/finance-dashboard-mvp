'use client';

import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { drilldownConfig } from '@/constants/drilldown';
import { useDashboardData } from '@/domains/transactions/use-dashboard-data';
import {
  useClickOutside,
  useDrilldown,
  useExport,
  useQuickFilters,
  useSyncFiltersFromUrl,
  useSyncFiltersToUrl,
} from '@/hooks';
import type { DrilldownType } from '@/hooks';
import { useThemeMode } from '@/theme';
import { formatDate } from '@/utils/date';
import { formatCentsToCurrency } from '@/utils/format';
import { getVisiblePages } from '@/utils/pagination';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  ChartsSection,
  ContentWrapper,
  CurrentDate,
  DrilldownActions,
  DrilldownClearSearch,
  DrilldownClose,
  DrilldownExportBtn,
  DrilldownHeader,
  DrilldownOverlay,
  DrilldownPanel,
  DrilldownSearchContainer,
  DrilldownSearchIcon,
  DrilldownSearchInput,
  DrilldownTitle,
  DrilldownTotal,
  DrilldownTotalLabel,
  DrilldownTotalValue,
  ExportBar,
  ExportButton,
  ExportDropdown,
  ExportMenu,
  ExportMenuHeader,
  ExportMenuItem,
  ExportMenuSeparator,
  FilterSection,
  HeaderActions,
  HeaderText,
  HeaderTop,
  LoadingWrapper,
  MainContent,
  PageDescription,
  PageHeader,
  PageTitle,
  PaginationButton,
  PaginationButtons,
  PaginationContainer,
  PaginationInfo,
  PaginationPageButton,
  QuickFilterButton,
  QuickFilters,
  SectionDescription,
  SectionTitle,
  SummarySection,
  ThemeToggle,
  TransactionAccount,
  TransactionInfo,
  TransactionItem,
  TransactionList,
  TransactionMeta,
  TransactionValue,
} from './dashboard.styled';

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

const DynamicFilterBar = dynamic(
  () =>
    import('@/components/filter-bar/filter-bar').then((module) => ({
      default: module.FilterBar,
    })),
  { ssr: false, loading: () => null },
);

const DashboardContent = () => {
  const {
    summary,
    previousSummary,
    monthlyTotals,
    accumulatedBalance,
    filterOptions,
    currency,
    isLoading,
    filteredTransactions,
  } = useDashboardData();
  const { mode, toggleTheme } = useThemeMode();
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  useSyncFiltersFromUrl();
  useSyncFiltersToUrl();
  const { activeQuickFilter, handleQuickFilter } = useQuickFilters();
  const {
    showExportMenu,
    setShowExportMenu,
    handleExportPdf,
    handleExportExcel,
    handleExportFiltered,
  } = useExport(filteredTransactions, currency);
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

  useClickOutside(exportMenuRef, showExportMenu, () => setShowExportMenu(false));

  const handleCardClick = (type: DrilldownType) => setDrilldownType(type);

  const paginationStart = (currentPage - 1) * pageSize + 1;
  const paginationEnd = Math.min(currentPage * pageSize, totalItems);

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
          <PageHeader>
            <HeaderTop>
              <HeaderText>
                <PageTitle>Visão Geral</PageTitle>
                <PageDescription>
                  Resumo financeiro atualizado conforme os filtros selecionados.
                </PageDescription>
              </HeaderText>
              <CurrentDate>{currentDate}</CurrentDate>
            </HeaderTop>
            <HeaderActions>
              <ThemeToggle
                type="button"
                onClick={toggleTheme}
                aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              >
                {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </ThemeToggle>
            </HeaderActions>
          </PageHeader>

          <ExportBar>
            <ExportDropdown ref={exportMenuRef}>
              <ExportButton
                type="button"
                onClick={() => setShowExportMenu((prev) => !prev)}
                aria-label="Exportar dados"
              >
                <Download size={16} />
                Exportar
              </ExportButton>
              {showExportMenu ? (
                <ExportMenu>
                  <ExportMenuHeader>Formato</ExportMenuHeader>
                  <ExportMenuItem type="button" onClick={handleExportPdf}>
                    <FileText size={16} />
                    Exportar como PDF
                  </ExportMenuItem>
                  <ExportMenuItem type="button" onClick={handleExportExcel}>
                    <FileSpreadsheet size={16} />
                    Exportar como Excel
                  </ExportMenuItem>
                  <ExportMenuSeparator />
                  <ExportMenuHeader>Filtrar por</ExportMenuHeader>
                  <ExportMenuItem type="button" onClick={() => handleExportFiltered('income')}>
                    <ArrowUpRight size={16} />
                    Apenas Receitas
                  </ExportMenuItem>
                  <ExportMenuItem type="button" onClick={() => handleExportFiltered('expenses')}>
                    <ArrowDownLeft size={16} />
                    Apenas Despesas
                  </ExportMenuItem>
                  <ExportMenuItem type="button" onClick={() => handleExportFiltered('pending')}>
                    <Clock size={16} />
                    Apenas Pendentes
                  </ExportMenuItem>
                </ExportMenu>
              ) : null}
            </ExportDropdown>
          </ExportBar>

          <QuickFilters aria-label="Filtros rapidos">
            <QuickFilterButton
              type="button"
              $active={activeQuickFilter === '7d'}
              onClick={() => handleQuickFilter('7d')}
            >
              <Calendar size={12} />
              Ultimos 7 dias
            </QuickFilterButton>
            <QuickFilterButton
              type="button"
              $active={activeQuickFilter === '1m'}
              onClick={() => handleQuickFilter('1m')}
            >
              <Calendar size={12} />
              Ultimo mes
            </QuickFilterButton>
            <QuickFilterButton
              type="button"
              $active={activeQuickFilter === '3m'}
              onClick={() => handleQuickFilter('3m')}
            >
              <Calendar size={12} />
              Ultimo trimestre
            </QuickFilterButton>
            <QuickFilterButton
              type="button"
              $active={activeQuickFilter === '1y'}
              onClick={() => handleQuickFilter('1y')}
            >
              <Calendar size={12} />
              Ano atual
            </QuickFilterButton>
          </QuickFilters>

          <FilterSection aria-label="Filtros">
            <DynamicFilterBar filterOptions={filterOptions} />
          </FilterSection>

          <SummarySection aria-label="Resumo financeiro">
            <DynamicSummaryCards
              summary={summary}
              previousSummary={previousSummary}
              currency={currency}
              onCardClick={handleCardClick}
            />
          </SummarySection>

          <ChartsSection aria-label="Graficos">
            <SectionTitle>Analises</SectionTitle>
            <SectionDescription>
              Receitas, despesas e saldo acumulado ao longo do tempo.
            </SectionDescription>
            <DynamicCharts
              monthlyTotals={monthlyTotals}
              accumulatedBalance={accumulatedBalance}
              summary={summary}
              currency={currency}
            />
          </ChartsSection>
        </ContentWrapper>
      </MainContent>

      {drilldownType !== null ? (
        <DrilldownOverlay>
          <DrilldownPanel>
            <DrilldownHeader>
              <DrilldownTitle>{drilldownConfig[drilldownType]?.label}</DrilldownTitle>
              <DrilldownActions>
                <DrilldownExportBtn
                  type="button"
                  onClick={() => handleExportFiltered(drilldownType)}
                >
                  <FileSpreadsheet size={14} />
                  Exportar Excel
                </DrilldownExportBtn>
                <DrilldownClose type="button" onClick={handleDrilldownClose} aria-label="Fechar">
                  <X size={18} />
                </DrilldownClose>
              </DrilldownActions>
            </DrilldownHeader>

            <DrilldownSearchContainer>
              <DrilldownSearchIcon>
                <Search size={14} />
              </DrilldownSearchIcon>
              <DrilldownSearchInput
                type="text"
                placeholder="Buscar por conta, industria, estado ou data..."
                value={drilldownSearch}
                onChange={(event) => setDrilldownSearch(event.target.value)}
                aria-label="Buscar transacoes"
              />
              {drilldownSearch !== '' ? (
                <DrilldownClearSearch
                  type="button"
                  onClick={() => setDrilldownSearch('')}
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </DrilldownClearSearch>
              ) : null}
            </DrilldownSearchContainer>

            <DrilldownTotal>
              <DrilldownTotalLabel>Total</DrilldownTotalLabel>
              <DrilldownTotalValue>
                {drilldownType === 'pending'
                  ? String(drilldownTransactions.length)
                  : formatCentsToCurrency(drilldownTotal, currency)}
              </DrilldownTotalValue>
            </DrilldownTotal>

            <TransactionList>
              {paginatedItems.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <TransactionInfo>
                    <TransactionAccount>{transaction.account}</TransactionAccount>
                    <TransactionMeta>
                      {transaction.date.toLocaleDateString('pt-BR')} - {transaction.industry} -{' '}
                      {transaction.state}
                    </TransactionMeta>
                  </TransactionInfo>
                  <TransactionValue $type={transaction.transactionType}>
                    {transaction.transactionType === 'deposit' ? '+' : '-'}{' '}
                    {formatCentsToCurrency(transaction.amountInCents, currency)}
                  </TransactionValue>
                </TransactionItem>
              ))}
              {filteredDrilldownTransactions.length === 0 ? (
                <LoadingWrapper>Nenhuma transacao encontrada</LoadingWrapper>
              ) : null}
            </TransactionList>

            {totalItems > 0 ? (
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
            ) : null}
          </DrilldownPanel>
        </DrilldownOverlay>
      ) : null}
    </>
  );
};

const DashboardPage = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;
