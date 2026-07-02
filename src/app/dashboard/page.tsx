'use client';

import { Charts } from '@/components/charts/charts';
import { FilterBar } from '@/components/filter-bar/filter-bar';
import { Sidebar } from '@/components/sidebar/sidebar';
import { SummaryCards } from '@/components/summary-cards/summary-cards';
import { useFilterStore } from '@/domains/filters';
import { useDashboardData } from '@/domains/transactions/use-dashboard-data';
import { useClickOutside, usePagination } from '@/hooks';
import { breakpoints } from '@/lib/breakpoints';
import { exportToExcel, exportToPdf } from '@/lib/export';
import { formatCentsToCurrency } from '@/lib/format';
import { filterTransactionsByType } from '@/lib/utils';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Moon,
  Search,
  Sun,
  TrendingUp,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useThemeMode } from '@/theme';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (min-width: ${breakpoints.tablet}) {
    margin-left: 64px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(4)};
  padding-top: ${({ theme }) => theme.spacing(16)};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing(6)};
    padding-top: ${({ theme }) => theme.spacing(6)};
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 32px;
  }
`;

const PageDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const CurrentDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 500;
  white-space: nowrap;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-shrink: 0;
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background-color 0.15s ease, color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const ExportBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(4)}`};
  border-radius: ${({ theme }) => theme.radius.button};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.15s ease, transform 0.1s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ExportDropdown = styled.div`
  position: relative;
`;

const ExportMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  box-shadow: ${({ theme }) => theme.colors.cardHoverShadow};
  z-index: 20;
  min-width: 220px;
  overflow: hidden;
`;

const ExportMenuHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ExportMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const ExportMenuSeparator = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const QuickFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const QuickFilterButton = styled.button<{ readonly $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryMuted : theme.colors.surface};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryMuted : theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const FilterSection = styled.section``;

const SummarySection = styled.section``;

const ChartsSection = styled.section``;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

const DrilldownOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const DrilldownPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: ${({ theme }) => theme.spacing(6)};
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
`;

const DrilldownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrilldownTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const DrilldownActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const DrilldownExportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radius.button};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.success};
    outline-offset: 2px;
  }
`;

const DrilldownClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.muted};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DrilldownSearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DrilldownSearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
`;

const DrilldownSearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(10)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }
`;

const DrilldownClearSearch = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.muted};
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DrilldownTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  background-color: ${({ theme }) => theme.colors.primaryMuted};
  border-radius: ${({ theme }) => theme.radius.input};
`;

const DrilldownTotalLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DrilldownTotalValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TransactionAccount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TransactionMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const TransactionValue = styled.span<{ readonly $type: 'deposit' | 'withdraw' }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $type }) =>
    $type === 'deposit' ? theme.colors.income : theme.colors.expense};
`;

const TransactionBadge = styled.span<{ readonly $pending: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ theme, $pending }) =>
    $pending ? theme.colors.warningMuted : theme.colors.successMuted};
  color: ${({ theme, $pending }) =>
    $pending ? theme.colors.warning : theme.colors.success};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaginationInfo = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const PaginationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const PaginationPageButton = styled.button<{ readonly $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.textSecondary)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.sidebarHover};
    color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.text)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getQuickRange = (period: string): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];

  switch (period) {
    case '7d': {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { startDate: start.toISOString().split('T')[0], endDate };
    }
    case '1m': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return { startDate: start.toISOString().split('T')[0], endDate };
    }
    case '3m': {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      return { startDate: start.toISOString().split('T')[0], endDate };
    }
    case '1y': {
      return { startDate: `${now.getFullYear()}-01-01`, endDate };
    }
    default:
      return { startDate: endDate, endDate };
  }
};

type DrilldownType = 'income' | 'expenses' | 'pending' | 'balance' | null;

const DashboardPage = () => {
  const { summary, monthlyTotals, accumulatedBalance, filterOptions, currency, isLoading, filteredTransactions } =
    useDashboardData();
  const { mode, toggleTheme } = useThemeMode();
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [drilldownType, setDrilldownType] = useState<DrilldownType>(null);
  const [drilldownSearch, setDrilldownSearch] = useState<string>('');
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const setDateRange = useFilterStore((state) => state.setDateRange);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  useClickOutside(exportMenuRef, showExportMenu, () => setShowExportMenu(false));

  const handleQuickFilter = useCallback(
    (period: string) => {
      if (activeQuickFilter === period) {
        resetFilters();
        setActiveQuickFilter(null);
        return;
      }
      const range = getQuickRange(period);
      setDateRange({ startDate: range.startDate, endDate: range.endDate });
      setActiveQuickFilter(period);
    },
    [activeQuickFilter, setDateRange, resetFilters],
  );

  const handleExportPdf = useCallback(() => {
    exportToPdf();
    setShowExportMenu(false);
  }, []);

  const handleExportExcel = useCallback(() => {
    exportToExcel(filteredTransactions, currency);
    setShowExportMenu(false);
  }, [filteredTransactions, currency]);

  const handleExportFiltered = useCallback(
    (type: DrilldownType) => {
      if (type === null) {
        return;
      }
      const filtered = filterTransactionsByType(filteredTransactions, type);
      exportToExcel(filtered, currency);
    },
    [filteredTransactions, currency],
  );

  const drilldownTransactions = useMemo(() => {
    if (drilldownType === null) {
      return [];
    }
    return filterTransactionsByType(filteredTransactions, drilldownType);
  }, [filteredTransactions, drilldownType]);

  const filteredDrilldownTransactions = useMemo(() => {
    if (drilldownSearch === '') {
      return drilldownTransactions;
    }
    const lowerSearch = drilldownSearch.toLowerCase();
    return drilldownTransactions.filter(
      (transaction) =>
        transaction.account.toLowerCase().includes(lowerSearch) ||
        transaction.industry.toLowerCase().includes(lowerSearch) ||
        transaction.state.toLowerCase().includes(lowerSearch),
    );
  }, [drilldownTransactions, drilldownSearch]);

  const {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredDrilldownTransactions, 10);

  const drilldownTotal = drilldownTransactions.reduce(
    (sum, transaction) => sum + transaction.amountInCents,
    0,
  );

  const drilldownConfig: Record<
    string,
    { label: string; icon: typeof ArrowUpRight; color: string }
  > = {
    income: { label: 'Receitas', icon: ArrowUpRight, color: 'income' },
    expenses: { label: 'Despesas', icon: ArrowDownLeft, color: 'expense' },
    pending: { label: 'Pendentes', icon: Clock, color: 'warning' },
    balance: { label: 'Saldo Total', icon: TrendingUp, color: 'secondary' },
  };

  const handleDrilldownClose = useCallback(() => {
    setDrilldownType(null);
    setDrilldownSearch('');
  }, []);

  const paginationStart = (currentPage - 1) * pageSize + 1;
  const paginationEnd = Math.min(currentPage * pageSize, totalItems);

  if (isLoading) {
    return (
      <Layout>
        <Sidebar />
        <MainContent>
          <ContentWrapper>
            <LoadingWrapper>Carregando...</LoadingWrapper>
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
                <PageTitle>Visao Geral</PageTitle>
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
                  <ExportMenuItem type="button" onClick={() => { handleExportFiltered('income'); setShowExportMenu(false); }}>
                    <ArrowUpRight size={16} />
                    Apenas Receitas
                  </ExportMenuItem>
                  <ExportMenuItem type="button" onClick={() => { handleExportFiltered('expenses'); setShowExportMenu(false); }}>
                    <ArrowDownLeft size={16} />
                    Apenas Despesas
                  </ExportMenuItem>
                  <ExportMenuItem type="button" onClick={() => { handleExportFiltered('pending'); setShowExportMenu(false); }}>
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
            <SummaryCards
              summary={summary}
              currency={currency}
              onCardClick={(type) => setDrilldownType(type)}
            />
          </SummarySection>

          <ChartsSection aria-label="Graficos">
            <SectionTitle>Analises</SectionTitle>
            <SectionDescription>Receitas, despesas e saldo acumulado ao longo do tempo.</SectionDescription>
            <Charts
              monthlyTotals={monthlyTotals}
              accumulatedBalance={accumulatedBalance}
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
                <DrilldownClose
                  type="button"
                  onClick={handleDrilldownClose}
                  aria-label="Fechar"
                >
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
                placeholder="Buscar por conta, industria ou estado..."
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TransactionValue $type={transaction.transactionType}>
                      {transaction.transactionType === 'deposit' ? '+' : '-'}{' '}
                      {formatCentsToCurrency(transaction.amountInCents, currency)}
                    </TransactionValue>
                    {transaction.isPending ? (
                      <TransactionBadge $pending>Pendente</TransactionBadge>
                    ) : null}
                  </div>
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
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Pagina anterior"
                  >
                    <ChevronLeft size={16} />
                  </PaginationButton>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                </PaginationButtons>
              </PaginationContainer>
            ) : null}
          </DrilldownPanel>
        </DrilldownOverlay>
      ) : null}
    </Layout>
  );
};

export default DashboardPage;
