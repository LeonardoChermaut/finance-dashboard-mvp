'use client';

import type { DrilldownCategory } from '@/hooks/use-drilldown';
import { FileSpreadsheet, Filter, Layers } from 'lucide-react';
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOption,
  DialogTitle,
  Overlay,
} from './export-dialog.styled';

type ExportDialogProps = {
  isOpen: boolean;
  filteredCount: number;
  totalCount: number;
  onClose: () => void;
  onExportAll: () => void;
  onExportFiltered: (type?: DrilldownCategory) => void;
};

export const ExportDialog = ({
  isOpen,
  filteredCount,
  totalCount,
  onExportFiltered,
  onExportAll,
  onClose,
}: ExportDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-label="Exportar dados">
      <Dialog onClick={(event) => event.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Exportar dados</DialogTitle>
          <DialogDescription>Existem filtros ativos. O que deseja exportar?</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <DialogOption type="button" onClick={() => onExportFiltered()}>
            <Filter size={16} />
            Apenas dados filtrados ({filteredCount} transações)
          </DialogOption>
          <DialogOption type="button" onClick={onExportAll}>
            <Layers size={16} />
            Todos os dados ({totalCount} transações)
          </DialogOption>
          <DialogOption type="button" onClick={() => onExportFiltered('income')}>
            <FileSpreadsheet size={16} />
            Apenas receitas filtradas
          </DialogOption>
          <DialogOption type="button" onClick={() => onExportFiltered('expenses')}>
            <FileSpreadsheet size={16} />
            Apenas despesas filtradas
          </DialogOption>
          <DialogOption type="button" onClick={() => onExportFiltered('pending')}>
            <FileSpreadsheet size={16} />
            Apenas pendentes filtrados
          </DialogOption>
        </DialogBody>
        <DialogFooter>
          <DialogCancelButton type="button" onClick={onClose}>
            Cancelar
          </DialogCancelButton>
        </DialogFooter>
      </Dialog>
    </Overlay>
  );
};
