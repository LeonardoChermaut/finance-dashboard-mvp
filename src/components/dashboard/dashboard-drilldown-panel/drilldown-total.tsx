'use client';

import type { DrilldownType } from '@/hooks/use-drilldown';
import { formatCentsToCurrency } from '@/utils/format';
import {
  DrilldownTotal as StyledDrilldownTotal,
  DrilldownTotalLabel,
  DrilldownTotalValue,
} from './dashboard-drilldown-panel.styled';

type DrilldownTotalProps = {
  drilldownType: DrilldownType;
  total: number;
  transactionCount: number;
  currency: string;
};

export const DrilldownTotal = ({
  drilldownType,
  total,
  transactionCount,
  currency,
}: DrilldownTotalProps) => {
  return (
    <StyledDrilldownTotal>
      <DrilldownTotalLabel>Total</DrilldownTotalLabel>
      <DrilldownTotalValue>
        {drilldownType === 'pending'
          ? String(transactionCount)
          : formatCentsToCurrency(total, currency)}
      </DrilldownTotalValue>
    </StyledDrilldownTotal>
  );
};
