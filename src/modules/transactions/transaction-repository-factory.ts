import { env } from '@/constants/config';
import type { ITransactionRepository } from '@/modules/transactions/transaction-repository';
import { createMockTransactionRepository } from '@/modules/transactions/transaction-repository';
import { createApiTransactionRepository } from '@/modules/transactions/transaction-repository-api';

export const getTransactionRepository = (): ITransactionRepository => {
  if (env.NEXT_PUBLIC_DATA_SOURCE === 'api') {
    return createApiTransactionRepository();
  }
  return createMockTransactionRepository();
};
