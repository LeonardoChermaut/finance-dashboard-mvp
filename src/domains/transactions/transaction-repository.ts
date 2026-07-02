import { normalizeTransactions } from '@/domains/transactions/transaction-mappers';
import type { Transaction } from '@/domains/transactions/transaction.types';
import rawTransactionsData from '@/mocks/transactions.json';

export interface TransactionRepository {
  getAll(): Promise<readonly Transaction[]>;
}

const toTransactionType = (value: string): 'deposit' | 'withdraw' => {
  if (value === 'deposit') {
    return 'deposit';
  }
  return 'withdraw';
};

export const createMockTransactionRepository = (): TransactionRepository => ({
  getAll: async () => {
    const rawTransactions = rawTransactionsData.map((entry) => ({
      date: entry.date,
      amount: entry.amount,
      transaction_type: toTransactionType(entry.transaction_type),
      currency: entry.currency,
      account: entry.account,
      industry: entry.industry,
      state: entry.state,
    }));

    return normalizeTransactions(rawTransactions);
  },
});
