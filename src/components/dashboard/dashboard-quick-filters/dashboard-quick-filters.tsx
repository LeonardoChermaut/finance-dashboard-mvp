'use client';

import type { QuickFilterPeriod } from '@/hooks/use-quick-filters';
import { Calendar } from 'lucide-react';
import { QuickFilterButton, QuickFilters } from './dashboard-quick-filters.styled';

type DashboardQuickFiltersProps = {
  activeQuickFilter: string | null;
  onQuickFilter: (filter: QuickFilterPeriod) => void;
};

export const DashboardQuickFilters = ({
  activeQuickFilter,
  onQuickFilter,
}: DashboardQuickFiltersProps) => (
  <QuickFilters aria-label="Filtros rapidos">
    <QuickFilterButton
      type="button"
      $active={activeQuickFilter === '7d'}
      onClick={() => onQuickFilter('7d')}
    >
      <Calendar size={12} />
      Ultimos 7 dias
    </QuickFilterButton>
    <QuickFilterButton
      type="button"
      $active={activeQuickFilter === '1m'}
      onClick={() => onQuickFilter('1m')}
    >
      <Calendar size={12} />
      Ultimo mes
    </QuickFilterButton>
    <QuickFilterButton
      type="button"
      $active={activeQuickFilter === '3m'}
      onClick={() => onQuickFilter('3m')}
    >
      <Calendar size={12} />
      Ultimo trimestre
    </QuickFilterButton>
    <QuickFilterButton
      type="button"
      $active={activeQuickFilter === '1y'}
      onClick={() => onQuickFilter('1y')}
    >
      <Calendar size={12} />
      Ano atual
    </QuickFilterButton>
  </QuickFilters>
);
