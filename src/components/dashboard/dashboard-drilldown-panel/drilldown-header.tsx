'use client';

import { drilldownConfig } from '@/constants/drilldown';
import type { DrilldownCategory, DrilldownType } from '@/hooks/use-drilldown';
import { FileSpreadsheet, X } from 'lucide-react';
import {
  DrilldownActions,
  DrilldownClose,
  DrilldownExportBtn,
  DrilldownHeader as StyledDrilldownHeader,
  DrilldownTitle,
} from './dashboard-drilldown-panel.styled';

type DrilldownHeaderProps = {
  drilldownType: DrilldownType;
  onExportFiltered: (type: DrilldownCategory) => void;
  onClose: () => void;
};

export const DrilldownHeader = ({
  drilldownType,
  onExportFiltered,
  onClose,
}: DrilldownHeaderProps) => {
  if (drilldownType === null) {
    return null;
  }

  return (
    <StyledDrilldownHeader>
      <DrilldownTitle>{drilldownConfig[drilldownType]?.label}</DrilldownTitle>
      <DrilldownActions>
        <DrilldownExportBtn type="button" onClick={() => onExportFiltered(drilldownType)}>
          <FileSpreadsheet size={14} />
          Exportar Excel
        </DrilldownExportBtn>
        <DrilldownClose type="button" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </DrilldownClose>
      </DrilldownActions>
    </StyledDrilldownHeader>
  );
};
