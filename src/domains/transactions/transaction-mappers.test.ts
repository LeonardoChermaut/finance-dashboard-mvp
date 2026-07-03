import { normalizeTransactions } from '@/domains/transactions/transaction-mappers';
import type { RawTransaction } from '@/domains/transactions/transaction.types';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const LATEST_TIMESTAMP = new Date('2024-06-20T12:00:00.000Z').getTime();

const buildRawTransaction = (overrides: Partial<RawTransaction>): RawTransaction => {
  return Object.freeze({
    date: LATEST_TIMESTAMP,
    amount: '100.00',
    transaction_type: 'deposit',
    currency: 'BRL',
    account: 'Conta Corrente',
    industry: 'Tecnologia',
    state: 'SP',
    ...overrides,
  });
};

describe('normalizeTransactions', () => {
  it('Normalizes raw fields to domain format', () => {
    const rawTransactions = Object.freeze([
      buildRawTransaction({ amount: '250.75', transaction_type: 'withdraw' }),
    ]);

    const [transaction] = normalizeTransactions(rawTransactions);

    expect(transaction.amountInCents).toBe(25075);
    expect(transaction.transactionType).toBe('withdraw');
    expect(transaction.date).toBeInstanceOf(Date);
    expect(transaction.id).toBe(`0-${LATEST_TIMESTAMP}`);
  });

  it('Returns an empty list for empty input', () => {
    expect(normalizeTransactions(Object.freeze([]))).toEqual([]);
  });

  it('Marks transactions within the 7-day window as pending', () => {
    const withinWindowTimestamp = LATEST_TIMESTAMP - 6 * MILLISECONDS_PER_DAY;
    const rawTransactions = Object.freeze([
      buildRawTransaction({ date: LATEST_TIMESTAMP }),
      buildRawTransaction({ date: withinWindowTimestamp }),
    ]);

    const transactions = normalizeTransactions(rawTransactions);

    expect(transactions[0].isPending).toBe(true);
    expect(transactions[1].isPending).toBe(true);
  });

  it('Does not mark transactions outside the 7-day window as pending', () => {
    const outsideWindowTimestamp = LATEST_TIMESTAMP - 8 * MILLISECONDS_PER_DAY;
    const rawTransactions = Object.freeze([
      buildRawTransaction({ date: LATEST_TIMESTAMP }),
      buildRawTransaction({ date: outsideWindowTimestamp }),
    ]);

    const transactions = normalizeTransactions(rawTransactions);

    expect(transactions[1].isPending).toBe(false);
  });

  it('Converts invalid values to zero cents', () => {
    const rawTransactions = Object.freeze([buildRawTransaction({ amount: 'invalido' })]);

    const [transaction] = normalizeTransactions(rawTransactions);

    expect(transaction.amountInCents).toBe(0);
  });

  it('Uses the most recent date in the dataset as the window reference', () => {
    const rawTransactions = Object.freeze([
      buildRawTransaction({ date: LATEST_TIMESTAMP - 30 * MILLISECONDS_PER_DAY }),
      buildRawTransaction({ date: LATEST_TIMESTAMP - 3 * MILLISECONDS_PER_DAY }),
      buildRawTransaction({ date: LATEST_TIMESTAMP }),
    ]);

    const transactions = normalizeTransactions(rawTransactions);

    expect(transactions[0].isPending).toBe(false);
    expect(transactions[1].isPending).toBe(true);
    expect(transactions[2].isPending).toBe(true);
  });
});
