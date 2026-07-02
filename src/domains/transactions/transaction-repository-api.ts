import { normalizeTransactions } from '@/domains/transactions/transaction-mappers';
import type { ITransactionRepository } from '@/domains/transactions/transaction-repository';
import type { Transaction } from '@/domains/transactions/transaction.types';
import type { IPaginatedResponse } from '@/lib/api';
import { api } from '@/lib/api';

interface IApiTransaction {
  date: number;
  state: string;
  amount: string;
  account: string;
  industry: string;
  currency: string;
  transaction_type: 'deposit' | 'withdraw';
}

export const createApiTransactionRepository = (): ITransactionRepository => ({
  getAll: async (): Promise<readonly Transaction[]> => {
    const response = await api.get<IPaginatedResponse<IApiTransaction>>('/transactions', {
      page: 1,
      pageSize: 10000,
    });

    return normalizeTransactions(response.data);
  },
});
