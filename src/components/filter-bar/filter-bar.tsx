'use client';

import { useFilterStore } from '@/modules/filters';
import type { FilterOptions } from '@/modules/filters/filters.types';
import { ChevronDown, Search, X } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import {
  AccordionContent,
  AccordionHeader,
  Badge,
  ChevronIcon,
  Chip,
  ChipRemove,
  Chips,
  ClearAllButton,
  ClearDateButton,
  ClearSearchButton,
  ClearSelectionButton,
  DateField,
  DateInput,
  DateRow,
  EmptyState,
  HeaderLeft,
  SearchContainer,
  SearchIcon,
  SearchInput,
  SelectActions,
  SelectAllButton,
  Wrapper,
} from './filter-bar.styled';

type FilterBarProps = {
  filterOptions: FilterOptions;
};

type AccordionSectionProps = {
  title: string;
  count?: number;
  isOpen: boolean;
  children: ReactNode;
  onToggle: () => void;
};

type SearchableMultiSelectProps = {
  label: string;
  options: string[];
  selected: string[];
  searchPlaceholder: string;
  onSelectAll: () => void;
  onClearAll: () => void;
  onToggle: (value: string) => void;
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
}: SearchableMultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (searchTerm === '') {
      return options;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(lowerSearchTerm));
  }, [options, searchTerm]);

  const handleClear = useCallback(() => setSearchTerm(''), []);

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
    dates: false,
    accounts: false,
    industries: false,
    states: false,
  });

  const states = useFilterStore((state) => state.states);
  const accounts = useFilterStore((state) => state.accounts);
  const dateRange = useFilterStore((state) => state.dateRange);
  const industries = useFilterStore((state) => state.industries);
  const toggleState = useFilterStore((state) => state.toggleState);
  const toggleAccount = useFilterStore((state) => state.toggleAccount);
  const toggleIndustry = useFilterStore((state) => state.toggleIndustry);

  const setStates = useFilterStore((state) => state.setStates);
  const setAccounts = useFilterStore((state) => state.setAccounts);
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setIndustries = useFilterStore((state) => state.setIndustries);

  const hasActiveFilters =
    dateRange.startDate !== null ||
    dateRange.endDate !== null ||
    accounts.length > 0 ||
    industries.length > 0 ||
    states.length > 0;

  const toggleSection = useCallback(
    (section: string) =>
      setOpenSections((previous) => ({ ...previous, [section]: !previous[section] })),
    [],
  );

  const hasDateRange = dateRange.startDate !== null || dateRange.endDate !== null;

  const handleClearDates = useCallback(
    () => setDateRange({ startDate: null, endDate: null, startTime: null, endTime: null }),
    [setDateRange],
  );

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
