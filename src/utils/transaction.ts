import type { DrilldownCategory } from '@/hooks/use-drilldown';
import type { Transaction } from '@/modules/transactions/transaction.types';

export { getInitials } from '@/utils/string';

export const filterTransactionsByType = (
  transactions: readonly Transaction[],
  type: DrilldownCategory,
): Transaction[] => {
  if (transactions.length === 0) {
    return [];
  }

  return transactions.filter((transaction) => {
    if (type === 'income') {
      return transaction.transactionType === 'deposit';
    }

    if (type === 'expenses') {
      return transaction.transactionType === 'withdraw';
    }

    if (type === 'pending') {
      return transaction.isPending;
    }

    return true;
  });
};
