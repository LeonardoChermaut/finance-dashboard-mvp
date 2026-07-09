'use client';

import { Search, X } from 'lucide-react';
import {
  DrilldownClearSearch,
  DrilldownSearchContainer,
  DrilldownSearchIcon,
  DrilldownSearchInput,
} from './dashboard-drilldown-panel.styled';

type DrilldownSearchProps = {
  search: string;
  onSearchChange: (search: string) => void;
};

export const DrilldownSearch = ({ search, onSearchChange }: DrilldownSearchProps) => {
  return (
    <DrilldownSearchContainer>
      <DrilldownSearchIcon>
        <Search size={14} />
      </DrilldownSearchIcon>
      <DrilldownSearchInput
        type="text"
        placeholder="Buscar por conta, industria, estado ou data..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Buscar transacoes"
      />
      {search !== '' ? (
        <DrilldownClearSearch
          type="button"
          onClick={() => onSearchChange('')}
          aria-label="Limpar busca"
        >
          <X size={14} />
        </DrilldownClearSearch>
      ) : null}
    </DrilldownSearchContainer>
  );
};
