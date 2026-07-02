import { PENDING_WINDOW_DAYS } from '@/constants/constants';
import type { RawTransaction, Transaction } from '@/domains/transactions/transaction.types';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const convertAmountToCents = (amount: string): number => {
  const parsedAmount = Number.parseFloat(amount);

  if (Number.isNaN(parsedAmount)) {
    return 0;
  }

  return Math.round(parsedAmount * 100);
};

const findLatestTimestamp = (rawTransactions: readonly RawTransaction[]): number => {
  return rawTransactions.reduce((latestTimestamp, rawTransaction) => {
    if (rawTransaction.date > latestTimestamp) {
      return rawTransaction.date;
    }

    return latestTimestamp;
  }, rawTransactions[0].date);
};

export const normalizeTransactions = (
  rawTransactions: readonly RawTransaction[],
): readonly Transaction[] => {
  if (rawTransactions.length === 0) {
    return [];
  }

  const latestTimestamp = findLatestTimestamp(rawTransactions);
  const pendingThreshold = latestTimestamp - PENDING_WINDOW_DAYS * MILLISECONDS_PER_DAY;

  return rawTransactions.map((rawTransaction, index) => {
    return {
      id: `${index}-${rawTransaction.date}`,
      date: new Date(rawTransaction.date),
      amountInCents: convertAmountToCents(rawTransaction.amount),
      transactionType: rawTransaction.transaction_type,
      currency: rawTransaction.currency,
      account: rawTransaction.account,
      industry: rawTransaction.industry,
      state: rawTransaction.state,
      isPending: rawTransaction.date >= pendingThreshold,
    };
  });
};
