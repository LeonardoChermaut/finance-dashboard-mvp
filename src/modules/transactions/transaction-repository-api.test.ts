import { normalizeTransactions } from '@/modules/transactions/transaction-mappers';
import type { ITransactionRepository } from '@/modules/transactions/transaction-repository';
import type { Transaction } from '@/modules/transactions/transaction.types';

jest.mock('@/lib/api', () => {
  const mockGet = jest.fn();
  return {
    api: {
      get: mockGet,
    },
  };
});

const { api } = require('@/lib/api');

const createApiTransactionRepository = (): ITransactionRepository => ({
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions', {
      page: 1,
      pageSize: 10000,
    });

    return normalizeTransactions(response.data);
  },
});

beforeEach(() => jest.clearAllMocks());

describe('createApiTransactionRepository', () => {
  it('Fetches transactions from API', async () => {
    const mockTransactions = [
      {
        date: 1682698259192,
        amount: '5565',
        transaction_type: 'deposit',
        currency: 'brl',
        account: 'Baker Hughes',
        industry: 'Oil and Gas Equipment',
        state: 'TX',
      },
    ];

    api.get.mockResolvedValueOnce({
      data: mockTransactions,
      page: 1,
      total: 1,
      pageSize: 10000,
      totalPages: 1,
    });

    const repository = createApiTransactionRepository();
    const transactions = await repository.getAll();

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBe(1);
    expect(api.get).toHaveBeenCalledWith('/transactions', {
      page: 1,
      pageSize: 10000,
    });
  });

  it('Returns normalized transactions', async () => {
    const mockTransactions = [
      {
        date: 1682698259192,
        amount: '5565',
        transaction_type: 'deposit',
        currency: 'brl',
        account: 'Baker Hughes',
        industry: 'Oil and Gas Equipment',
        state: 'TX',
      },
    ];

    api.get.mockResolvedValueOnce({
      data: mockTransactions,
      page: 1,
      total: 1,
      pageSize: 10000,
      totalPages: 1,
    });

    const repository = createApiTransactionRepository();
    const transactions = await repository.getAll();
    const firstTransaction = transactions[0];

    expect(firstTransaction).toHaveProperty('id');
    expect(firstTransaction).toHaveProperty('date');
    expect(firstTransaction).toHaveProperty('amountInCents');
    expect(firstTransaction).toHaveProperty('transactionType');
    expect(firstTransaction).toHaveProperty('currency');
    expect(firstTransaction).toHaveProperty('account');
    expect(firstTransaction).toHaveProperty('industry');
    expect(firstTransaction).toHaveProperty('state');
    expect(firstTransaction).toHaveProperty('isPending');
  });

  it('Converts date timestamp to Date object', async () => {
    const mockTransactions = [
      {
        date: 1682698259192,
        amount: '5565',
        transaction_type: 'deposit',
        currency: 'brl',
        account: 'Baker Hughes',
        industry: 'Oil and Gas Equipment',
        state: 'TX',
      },
    ];

    api.get.mockResolvedValueOnce({
      data: mockTransactions,
      page: 1,
      total: 1,
      pageSize: 10000,
      totalPages: 1,
    });

    const repository = createApiTransactionRepository();
    const transactions = await repository.getAll();
    const firstTransaction = transactions[0];

    expect(firstTransaction.date).toBeInstanceOf(Date);
  });

  it('Converts amount to cents', async () => {
    const mockTransactions = [
      {
        date: 1682698259192,
        amount: '5565',
        transaction_type: 'deposit',
        currency: 'brl',
        account: 'Baker Hughes',
        industry: 'Oil and Gas Equipment',
        state: 'TX',
      },
    ];

    api.get.mockResolvedValueOnce({
      data: mockTransactions,
      page: 1,
      total: 1,
      pageSize: 10000,
      totalPages: 1,
    });

    const repository = createApiTransactionRepository();
    const transactions = await repository.getAll();
    const firstTransaction = transactions[0];

    expect(firstTransaction.amountInCents).toBe(556500);
  });

  it('Throws error when API fails', async () => {
    api.get.mockRejectedValueOnce({
      message: 'Internal Server Error',
      status: 500,
    });

    const repository = createApiTransactionRepository();

    await expect(repository.getAll()).rejects.toEqual({
      message: 'Internal Server Error',
      status: 500,
    });
  });
});
