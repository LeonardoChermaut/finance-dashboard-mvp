import { env } from '@/constants/config';
import {
  ITransactionRepository,
  createMockTransactionRepository,
} from '@/domains/transactions/transaction-repository';
import { createApiTransactionRepository } from '@/domains/transactions/transaction-repository-api';

export const getTransactionRepository = (): ITransactionRepository => {
  if (env.NEXT_PUBLIC_DATA_SOURCE === 'api') {
    return createApiTransactionRepository();
  }
  return createMockTransactionRepository();
};
