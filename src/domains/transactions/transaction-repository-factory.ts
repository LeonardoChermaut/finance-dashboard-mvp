import {
  TransactionRepository,
  createMockTransactionRepository,
} from '@/domains/transactions/transaction-repository';

export const getTransactionRepository = (): TransactionRepository => {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api') {
    // TODO: Ajustar pra futuramente retornar uma instancia de TransactionRepository com a API
  }
  return createMockTransactionRepository();
};
