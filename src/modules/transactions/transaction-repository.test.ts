import { createMockTransactionRepository } from '@/modules/transactions/transaction-repository';

const repository = createMockTransactionRepository();

describe('createMockTransactionRepository', () => {
  it('Returns an array of transactions', async () => {
    const transactions = await repository.getAll();

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
  });

  it('Returns transactions with required fields', async () => {
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

  it('Returns transactions with Date objects', async () => {
    const transactions = await repository.getAll();
    const firstTransaction = transactions[0];

    expect(firstTransaction.date).toBeInstanceOf(Date);
  });

  it('Returns transactions with valid transactionType', async () => {
    const transactions = await repository.getAll();
    const validTypes = ['deposit', 'withdraw'];

    transactions.forEach((transaction) => {
      expect(validTypes).toContain(transaction.transactionType);
    });
  });

  it('Returns transactions with non-negative amountInCents', async () => {
    const transactions = await repository.getAll();

    transactions.forEach((transaction) => {
      expect(transaction.amountInCents).toBeGreaterThanOrEqual(0);
    });
  });

  it('Returns read-only transaction objects', async () => {
    const transactions = await repository.getAll();
    const firstTransaction = transactions[0];

    expect(firstTransaction).toBeDefined();
    expect(typeof firstTransaction).toBe('object');
  });
});
