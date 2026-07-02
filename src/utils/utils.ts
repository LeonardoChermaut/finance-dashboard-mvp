import type { Transaction } from '@/domains/transactions/transaction.types';

export const getInitials = (name: string): string => {
  if (name === '') {
    return '';
  }

  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const filterTransactionsByType = (
  transactions: readonly Transaction[],
  type: 'income' | 'expenses' | 'pending' | 'balance',
): readonly Transaction[] => {
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
