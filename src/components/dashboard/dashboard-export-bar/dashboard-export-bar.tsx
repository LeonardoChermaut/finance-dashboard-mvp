'use client';

import type { DrilldownCategory } from '@/hooks/use-drilldown';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import type { RefObject } from 'react';
import {
  ExportBar,
  ExportButton,
  ExportDropdown,
  ExportMenu,
  ExportMenuHeader,
  ExportMenuItem,
  ExportMenuSeparator,
} from './dashboard-export-bar.styled';

type DashboardExportBarProps = {
  isExporting: boolean;
  showExportMenu: boolean;
  exportMenuRef: RefObject<HTMLDivElement | null>;
  onToggleMenu: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onExportFiltered: (type: DrilldownCategory) => void;
};

export const DashboardExportBar = ({
  isExporting,
  showExportMenu,
  exportMenuRef,
  onToggleMenu,
  onExportPdf,
  onExportExcel,
  onExportFiltered,
}: DashboardExportBarProps) => (
  <ExportBar>
    <ExportDropdown ref={exportMenuRef}>
      <ExportButton
        type="button"
        onClick={onToggleMenu}
        disabled={isExporting}
        aria-label="Exportar dados"
      >
        <Download size={16} />
        {isExporting ? 'Exportando...' : 'Exportar'}
      </ExportButton>
      {showExportMenu ? (
        <ExportMenu>
          <ExportMenuHeader>Formato</ExportMenuHeader>
          <ExportMenuItem type="button" onClick={onExportPdf} disabled={isExporting}>
            <FileText size={16} />
            Exportar como PDF
          </ExportMenuItem>
          <ExportMenuItem type="button" onClick={onExportExcel} disabled={isExporting}>
            <FileSpreadsheet size={16} />
            Exportar como Excel
          </ExportMenuItem>
          <ExportMenuSeparator />
          <ExportMenuHeader>Filtrar por</ExportMenuHeader>
          <ExportMenuItem
            type="button"
            onClick={() => onExportFiltered('income')}
            disabled={isExporting}
          >
            <ArrowUpRight size={16} />
            Apenas Receitas
          </ExportMenuItem>
          <ExportMenuItem
            type="button"
            onClick={() => onExportFiltered('expenses')}
            disabled={isExporting}
          >
            <ArrowDownLeft size={16} />
            Apenas Despesas
          </ExportMenuItem>
          <ExportMenuItem
            type="button"
            onClick={() => onExportFiltered('pending')}
            disabled={isExporting}
          >
            <Clock size={16} />
            Apenas Pendentes
          </ExportMenuItem>
        </ExportMenu>
      ) : null}
    </ExportDropdown>
  </ExportBar>
);
