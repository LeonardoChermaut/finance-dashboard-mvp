import type {
  AccumulatedBalancePoint,
  FinancialSummary,
  MonthlyTotals,
  Transaction,
} from '@/domains/transactions/transaction.types';

const buildMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${year}-${month}`;
};

export const calculateFinancialSummary = (
  transactions: readonly Transaction[],
): FinancialSummary => {
  return transactions.reduce<FinancialSummary>(
    (summary, transaction) => {
      const isDeposit = transaction.transactionType === 'deposit';
      const incomeInCents = summary.incomeInCents + (isDeposit ? transaction.amountInCents : 0);
      const expensesInCents = summary.expensesInCents + (isDeposit ? 0 : transaction.amountInCents);
      const pendingCount = summary.pendingCount + (transaction.isPending ? 1 : 0);

      return {
        incomeInCents,
        expensesInCents,
        pendingCount,
        balanceInCents: incomeInCents - expensesInCents,
      };
    },
    {
      incomeInCents: 0,
      expensesInCents: 0,
      pendingCount: 0,
      balanceInCents: 0,
    },
  );
};

export const calculateMonthlyTotals = (
  transactions: readonly Transaction[],
): readonly MonthlyTotals[] => {
  const totalsByMonth = new Map<string, MonthlyTotals>();

  transactions.forEach((transaction) => {
    const month = buildMonthKey(transaction.date);
    const currentTotals = totalsByMonth.get(month) ?? {
      month,
      depositInCents: 0,
      withdrawInCents: 0,
    };
    const isDeposit = transaction.transactionType === 'deposit';
    totalsByMonth.set(month, {
      month,
      depositInCents: currentTotals.depositInCents + (isDeposit ? transaction.amountInCents : 0),
      withdrawInCents: currentTotals.withdrawInCents + (isDeposit ? 0 : transaction.amountInCents),
    });
  });

  return Array.from(totalsByMonth.values()).sort((left, right) => {
    return left.month.localeCompare(right.month);
  });
};

export const calculateAccumulatedBalance = (
  transactions: readonly Transaction[],
): readonly AccumulatedBalancePoint[] => {
  const monthlyTotals = calculateMonthlyTotals(transactions);

  const accumulatedPoints: AccumulatedBalancePoint[] = [];
  let runningBalanceInCents = 0;

  monthlyTotals.forEach((monthlyTotal) => {
    runningBalanceInCents += monthlyTotal.depositInCents - monthlyTotal.withdrawInCents;
    accumulatedPoints.push({
      month: monthlyTotal.month,
      balanceInCents: runningBalanceInCents,
    });
  });

  return accumulatedPoints;
};
