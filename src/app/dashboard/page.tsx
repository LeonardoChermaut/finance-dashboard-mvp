'use client';

import { Charts } from '@/components/charts/charts';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { FilterBar } from '@/components/filter-bar/filter-bar';
import { Sidebar } from '@/components/sidebar/sidebar';
import { SummaryCards } from '@/components/summary-cards/summary-cards';
import { drilldownConfig } from '@/constants/drilldown';
import { useDashboardData } from '@/domains/transactions/use-dashboard-data';
import {
  useClickOutside,
  useDrilldown,
  useExport,
  useModalScroll,
  useQuickFilters,
  useSyncFiltersFromUrl,
  useSyncFiltersToUrl,
} from '@/hooks';
import { useThemeMode } from '@/theme';
import { formatDate } from '@/utils/date';
import { formatCentsToCurrency } from '@/utils/format';
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
import { Suspense, useRef } from 'react';
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
  Layout,
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

const getVisiblePages = (current: number, total: number): readonly number[] => {
  if (total <= 5) {
    return Array.from({ length: total }, (_unused, index) => index + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  }
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }

  return [current - 2, current - 1, current, current + 1, current + 2];
};

const DashboardContent = () => {
  const {
    summary,
    monthlyTotals,
    accumulatedBalance,
    filterOptions,
    currency,
    isLoading,
    filteredTransactions,
  } = useDashboardData();
  const { mode, toggleTheme } = useThemeMode();
  const exportMenuRef = useRef<HTMLDivElement>(null);

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

  useModalScroll(drilldownType !== null);
  useClickOutside(exportMenuRef, showExportMenu, () => setShowExportMenu(false));

  const paginationStart = (currentPage - 1) * pageSize + 1;
  const paginationEnd = Math.min(currentPage * pageSize, totalItems);

  const handleCardClick = (type: 'income' | 'expenses' | 'pending' | 'balance') => {
    setDrilldownType(type);
  };

  if (isLoading) {
    return (
      <Layout>
        <Sidebar />
        <MainContent>
          <ContentWrapper>
            <DashboardSkeleton />
          </ContentWrapper>
        </MainContent>
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar />
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
              <CurrentDate>{formatDate(new Date())}</CurrentDate>
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
            <FilterBar filterOptions={filterOptions} />
          </FilterSection>

          <SummarySection aria-label="Resumo financeiro">
            <SummaryCards summary={summary} currency={currency} onCardClick={handleCardClick} />
          </SummarySection>

          <ChartsSection aria-label="Graficos">
            <SectionTitle>Analises</SectionTitle>
            <SectionDescription>
              Receitas, despesas e saldo acumulado ao longo do tempo.
            </SectionDescription>
            <Charts
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
                placeholder="Buscar por conta, indústria, estado ou data..."
                value={drilldownSearch}
                onChange={(event) => setDrilldownSearch(event.target.value)}
                aria-label="Buscar transações"
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
    </Layout>
  );
};

const DashboardPage = () => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;
