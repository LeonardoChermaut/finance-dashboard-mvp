export type TransactionType = Readonly<'deposit' | 'withdraw'>;

export type RawTransaction = Readonly<{
  date: number;
  state: string;
  amount: string;
  account: string;
  industry: string;
  currency: string;
  transaction_type: TransactionType;
}>;

export type Transaction = Readonly<{
  id: string;
  date: Date;
  state: string;
  account: string;
  currency: string;
  industry: string;
  isPending: boolean;
  amountInCents: number;
  transactionType: TransactionType;
}>;

export type FinancialSummary = Readonly<{
  pendingCount: number;
  incomeInCents: number;
  balanceInCents: number;
  expensesInCents: number;
}>;

export type MonthlyTotals = Readonly<{
  month: string;
  depositInCents: number;
  withdrawInCents: number;
}>;

export type AccumulatedBalancePoint = Readonly<{
  month: string;
  balanceInCents: number;
}>;
