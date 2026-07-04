import type { Transaction } from '@/modules/transactions/transaction.types';
import { filterTransactionsByType, getInitials } from './transaction';

const createTransaction = (overrides: Partial<Transaction>): Transaction =>
  Object.freeze({
    id: '1',
    date: new Date('2024-01-15'),
    amountInCents: 5000,
    transactionType: 'deposit' as const,
    currency: 'BRL',
    account: 'Acme Corp',
    industry: 'Retail',
    state: 'SP',
    isPending: false,
    ...overrides,
  });

const SAMPLE_TRANSACTIONS: readonly Transaction[] = Object.freeze([
  createTransaction({ id: '1', transactionType: 'deposit', isPending: false }),
  createTransaction({ id: '2', transactionType: 'withdraw', isPending: false }),
  createTransaction({ id: '3', transactionType: 'deposit', isPending: true }),
  createTransaction({ id: '4', transactionType: 'withdraw', isPending: true }),
  createTransaction({ id: '5', transactionType: 'deposit', isPending: false }),
]);

describe('getInitials', () => {
  it('Returns empty string for empty input', () => expect(getInitials('')).toBe(''));

  it('Returns single initial for single word', () => expect(getInitials('Joao')).toBe('J'));

  it('Returns two initials for two words', () => expect(getInitials('Joao Silva')).toBe('JS'));

  it('Returns only first two initials for multiple words', () =>
    expect(getInitials('Joao Silva Santos')).toBe('JS'));

  it('Converts initials to uppercase', () => expect(getInitials('joao silva')).toBe('JS'));

  it('Handles single character words', () => expect(getInitials('A B C')).toBe('AB'));
});

describe('FilterTransactionsByType', () => {
  it('Returns empty array for empty input', () =>
    expect(filterTransactionsByType([], 'income')).toEqual([]));

  it('Filters deposits for income type', () => {
    const result = filterTransactionsByType(SAMPLE_TRANSACTIONS, 'income');
    expect(result).toHaveLength(3);
    result.forEach((transaction) => {
      expect(transaction.transactionType).toBe('deposit');
    });
  });

  it('Filters withdrawals for expenses type', () => {
    const result = filterTransactionsByType(SAMPLE_TRANSACTIONS, 'expenses');
    expect(result).toHaveLength(2);
    result.forEach((transaction) => {
      expect(transaction.transactionType).toBe('withdraw');
    });
  });

  it('Filters pending transactions', () => {
    const result = filterTransactionsByType(SAMPLE_TRANSACTIONS, 'pending');
    expect(result).toHaveLength(2);
    result.forEach((transaction) => {
      expect(transaction.isPending).toBe(true);
    });
  });

  it('Returns all transactions for balance type', () => {
    const result = filterTransactionsByType(SAMPLE_TRANSACTIONS, 'balance');
    expect(result).toHaveLength(5);
  });

  it('Does not mutate original array', () => {
    const original = [...SAMPLE_TRANSACTIONS];
    filterTransactionsByType(SAMPLE_TRANSACTIONS, 'income');
    expect(SAMPLE_TRANSACTIONS).toEqual(original);
  });
});
