import type { IPaginatedResponse } from '@/lib/api';
import { api } from '@/lib/api';
import { normalizeTransactions } from '@/modules/transactions/transaction-mappers';
import type { ITransactionRepository } from '@/modules/transactions/transaction-repository';
import type { Transaction } from '@/modules/transactions/transaction.types';

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
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get<IPaginatedResponse<IApiTransaction>>('/transactions', {
      page: 1,
      pageSize: 10000,
    });

    return normalizeTransactions(response.data);
  },
});
