import { API_PAGE_SIZE } from '@/constants/config';
import type { IPaginatedResponse } from '@/lib/api';
import { api } from '@/lib/api';
import { normalizeTransactions } from '@/modules/transactions/transaction-mappers';
import type { ITransactionRepository } from '@/modules/transactions/transaction-repository';
import type { Transaction, TransactionType } from '@/modules/transactions/transaction.types';

interface ITransaction {
  date: number;
  state: string;
  amount: string;
  account: string;
  industry: string;
  currency: string;
  transaction_type: TransactionType;
}

export const createApiTransactionRepository = (): ITransactionRepository => ({
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get<IPaginatedResponse<ITransaction>>('/transactions', {
      page: 1,
      pageSize: API_PAGE_SIZE,
    });

    return normalizeTransactions(response.data);
  },
});
