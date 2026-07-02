import {
  calculateAccumulatedBalance,
  calculateFinancialSummary,
  calculateMonthlyTotals,
} from '@/domains/transactions/transaction-metrics';
import type { Transaction } from '@/domains/transactions/transaction.types';

const buildTransaction = (overrides: Partial<Transaction>): Transaction => {
  return Object.freeze({
    id: '0-1',
    date: new Date('2024-01-15T12:00:00.000Z'),
    amountInCents: 10000,
    transactionType: 'deposit',
    currency: 'BRL',
    account: 'Conta Corrente',
    industry: 'Tecnologia',
    state: 'SP',
    isPending: false,
    ...overrides,
  });
};

describe('calculateFinancialSummary', () => {
  it('Sums income, expenses, balance, and pending count', () => {
    const transactions = Object.freeze([
      buildTransaction({ amountInCents: 30000, transactionType: 'deposit' }),
      buildTransaction({ amountInCents: 10000, transactionType: 'withdraw' }),
      buildTransaction({ amountInCents: 5000, transactionType: 'withdraw', isPending: true }),
    ]);

    const summary = calculateFinancialSummary(transactions);

    expect(summary.incomeInCents).toBe(30000);
    expect(summary.expensesInCents).toBe(15000);
    expect(summary.balanceInCents).toBe(15000);
    expect(summary.pendingCount).toBe(1);
  });

  it('Returns zeros for empty list', () => {
    const summary = calculateFinancialSummary(Object.freeze([]));

    expect(summary).toEqual({
      incomeInCents: 0,
      expensesInCents: 0,
      pendingCount: 0,
      balanceInCents: 0,
    });
  });
});

describe('calculateMonthlyTotals', () => {
  it('Groups by month and orders chronologically', () => {
    const transactions = Object.freeze([
      buildTransaction({
        date: new Date('2024-02-10T12:00:00.000Z'),
        amountInCents: 20000,
        transactionType: 'deposit',
      }),
      buildTransaction({
        date: new Date('2024-01-05T12:00:00.000Z'),
        amountInCents: 8000,
        transactionType: 'withdraw',
      }),
      buildTransaction({
        date: new Date('2024-01-20T12:00:00.000Z'),
        amountInCents: 12000,
        transactionType: 'deposit',
      }),
    ]);

    const totals = calculateMonthlyTotals(transactions);

    expect(totals).toEqual([
      { month: '2024-01', depositInCents: 12000, withdrawInCents: 8000 },
      { month: '2024-02', depositInCents: 20000, withdrawInCents: 0 },
    ]);
  });
});

describe('calculateAccumulatedBalance', () => {
  it('Accumulates balance over the months', () => {
    const transactions = Object.freeze([
      buildTransaction({
        date: new Date('2024-01-05T12:00:00.000Z'),
        amountInCents: 10000,
        transactionType: 'deposit',
      }),
      buildTransaction({
        date: new Date('2024-02-05T12:00:00.000Z'),
        amountInCents: 4000,
        transactionType: 'withdraw',
      }),
      buildTransaction({
        date: new Date('2024-03-05T12:00:00.000Z'),
        amountInCents: 6000,
        transactionType: 'deposit',
      }),
    ]);

    const points = calculateAccumulatedBalance(transactions);

    expect(points).toEqual([
      { month: '2024-01', balanceInCents: 10000 },
      { month: '2024-02', balanceInCents: 6000 },
      { month: '2024-03', balanceInCents: 12000 },
    ]);
  });
});
