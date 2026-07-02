'use client';

import { Card } from '@/components/ui/card';
import { useFilterStore } from '@/domains/filters';
import type { FilterOptions } from '@/domains/filters/filters.types';
import { ChevronDown, Search, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const ClearAllButton = styled.button`
  align-self: flex-end;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const AccordionHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(1)}`};
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 11px;
  font-weight: 700;
`;

const ChevronIcon = styled.span<{ readonly $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const AccordionContent = styled.div<{ readonly $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const DateField = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  flex: 1;
`;

const DateInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.colorScheme === 'dark' ? 'invert(1)' : 'none')};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(10)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.input};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryMuted};
    outline: none;
  }

  &::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.colorScheme === 'dark' ? 'invert(1)' : 'none')};
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.muted};
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.sidebarHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SelectActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SelectAllButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ClearSelectionButton = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Chip = styled.button<{ readonly $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: 999px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.text)};
  font-size: 13px;
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryHover : theme.colors.primaryMuted};
    color: ${({ theme, $active }) => ($active ? theme.colors.surface : theme.colors.primary)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ChipRemove = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  margin-left: ${({ theme }) => theme.spacing(1)};
  flex-shrink: 0;
`;

const ClearDateButton = styled.button`
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => `${theme.spacing(1)} 0`};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.danger};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const EmptyState = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: ${({ theme }) => `${theme.spacing(2)} 0`};
`;

type FilterBarProps = {
  readonly filterOptions: FilterOptions;
};

type AccordionSectionProps = {
  readonly title: string;
  readonly count?: number;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly children: React.ReactNode;
};

const AccordionSection = ({ title, count, isOpen, onToggle, children }: AccordionSectionProps) => {
  return (
    <div role="region" aria-label={title}>
      <AccordionHeader
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <HeaderLeft>
          {title}
          {count !== undefined && count > 0 ? <Badge>{count}</Badge> : null}
        </HeaderLeft>
        <ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </AccordionHeader>
      <AccordionContent
        $isOpen={isOpen}
        id={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        role="group"
      >
        {children}
      </AccordionContent>
    </div>
  );
};

const SearchableMultiSelect = ({
  label,
  options,
  selected,
  onToggle,
  onSelectAll,
  onClearAll,
  searchPlaceholder,
}: {
  readonly label: string;
  readonly options: readonly string[];
  readonly selected: readonly string[];
  readonly onToggle: (value: string) => void;
  readonly onSelectAll: () => void;
  readonly onClearAll: () => void;
  readonly searchPlaceholder: string;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (searchTerm === '') {
      return options;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(lowerSearchTerm));
  }, [options, searchTerm]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const allSelected = selected.length === options.length && options.length > 0;

  return (
    <>
      <SearchContainer>
        <SearchIcon>
          <Search size={14} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label={`Search ${label}`}
        />
        {searchTerm !== '' && (
          <ClearSearchButton
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${label} search`}
          >
            <X size={14} />
          </ClearSearchButton>
        )}
      </SearchContainer>
      <SelectActions>
        <SelectAllButton type="button" onClick={allSelected ? onClearAll : onSelectAll}>
          {allSelected ? 'Limpar todos' : 'Selecionar todos'}
        </SelectAllButton>
        {selected.length > 0 && (
          <ClearSelectionButton type="button" onClick={onClearAll}>
            Limpar seleção
          </ClearSelectionButton>
        )}
      </SelectActions>
      <Chips>
        {filteredOptions.length === 0 ? (
          <EmptyState>Nenhum resultado encontrado</EmptyState>
        ) : (
          filteredOptions.map((option) => {
            const isActive = selected.includes(option);
            return (
              <Chip
                key={option}
                type="button"
                $active={isActive}
                onClick={() => onToggle(option)}
                aria-pressed={isActive}
              >
                {option}
                {isActive ? (
                  <ChipRemove aria-hidden="true">
                    <X size={10} />
                  </ChipRemove>
                ) : null}
              </Chip>
            );
          })
        )}
      </Chips>
    </>
  );
};

export const FilterBar = ({ filterOptions }: FilterBarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dates: true,
    accounts: false,
    industries: false,
    states: false,
  });

  const dateRange = useFilterStore((state) => state.dateRange);
  const accounts = useFilterStore((state) => state.accounts);
  const industries = useFilterStore((state) => state.industries);
  const states = useFilterStore((state) => state.states);
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const toggleAccount = useFilterStore((state) => state.toggleAccount);
  const toggleIndustry = useFilterStore((state) => state.toggleIndustry);
  const toggleState = useFilterStore((state) => state.toggleState);
  const setAccounts = useFilterStore((state) => state.setAccounts);
  const setIndustries = useFilterStore((state) => state.setIndustries);
  const setStates = useFilterStore((state) => state.setStates);

  const hasActiveFilters =
    dateRange.startDate !== null ||
    dateRange.endDate !== null ||
    accounts.length > 0 ||
    industries.length > 0 ||
    states.length > 0;

  const toggleSection = useCallback((section: string) => {
    setOpenSections((previous) => ({ ...previous, [section]: !previous[section] }));
  }, []);

  const hasDateRange = dateRange.startDate !== null || dateRange.endDate !== null;

  const handleClearDates = useCallback(() => {
    setDateRange({ startDate: null, endDate: null, startTime: null, endTime: null });
  }, [setDateRange]);

  return (
    <Wrapper as="section" aria-label="Filtros">
      {hasActiveFilters ? (
        <ClearAllButton type="button" onClick={resetFilters}>
          Limpar filtro
        </ClearAllButton>
      ) : null}
      <AccordionSection
        title="Datas"
        count={hasDateRange ? 1 : undefined}
        isOpen={openSections.dates}
        onToggle={() => toggleSection('dates')}
      >
        <DateRow>
          <DateField htmlFor="filter-date-start">
            Início
            <DateInput
              id="filter-date-start"
              type="date"
              value={dateRange.startDate ?? ''}
              min={filterOptions.minDate ?? undefined}
              max={filterOptions.maxDate ?? undefined}
              onChange={(event) =>
                setDateRange({
                  ...dateRange,
                  startDate: event.target.value === '' ? null : event.target.value,
                })
              }
            />
          </DateField>
          <DateField htmlFor="filter-date-end">
            Fim
            <DateInput
              id="filter-date-end"
              type="date"
              value={dateRange.endDate ?? ''}
              min={filterOptions.minDate ?? undefined}
              max={filterOptions.maxDate ?? undefined}
              onChange={(event) =>
                setDateRange({
                  ...dateRange,
                  endDate: event.target.value === '' ? null : event.target.value,
                })
              }
            />
          </DateField>
        </DateRow>
        {hasDateRange ? (
          <ClearDateButton type="button" onClick={handleClearDates}>
            Limpar datas
          </ClearDateButton>
        ) : null}
      </AccordionSection>

      <AccordionSection
        title="Contas"
        count={accounts.length}
        isOpen={openSections.accounts}
        onToggle={() => toggleSection('accounts')}
      >
        <SearchableMultiSelect
          label="contas"
          options={filterOptions.accounts}
          selected={accounts}
          onToggle={toggleAccount}
          onSelectAll={() => setAccounts(filterOptions.accounts)}
          onClearAll={() => setAccounts([])}
          searchPlaceholder="Buscar contas..."
        />
      </AccordionSection>

      <AccordionSection
        title="Industrias"
        count={industries.length}
        isOpen={openSections.industries}
        onToggle={() => toggleSection('industries')}
      >
        <SearchableMultiSelect
          label="industrias"
          options={filterOptions.industries}
          selected={industries}
          onToggle={toggleIndustry}
          onSelectAll={() => setIndustries(filterOptions.industries)}
          onClearAll={() => setIndustries([])}
          searchPlaceholder="Buscar industrias..."
        />
      </AccordionSection>

      <AccordionSection
        title="Estados"
        count={states.length}
        isOpen={openSections.states}
        onToggle={() => toggleSection('states')}
      >
        <SearchableMultiSelect
          label="estados"
          options={filterOptions.states}
          selected={states}
          onToggle={toggleState}
          onSelectAll={() => setStates(filterOptions.states)}
          onClearAll={() => setStates([])}
          searchPlaceholder="Buscar estados..."
        />
      </AccordionSection>
    </Wrapper>
  );
};
