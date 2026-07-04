import rawTransactionsData from '@/mocks/transactions.json';
import { normalizeTransactions } from '@/modules/transactions/transaction-mappers';
import type { Transaction } from '@/modules/transactions/transaction.types';

export interface ITransactionRepository {
  getAll(): Promise<readonly Transaction[]>;
}

const toTransactionType = (value: string): 'deposit' | 'withdraw' => {
  if (value === 'deposit') {
    return 'deposit';
  }
  return 'withdraw';
};

export const createMockTransactionRepository = (): ITransactionRepository => ({
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
