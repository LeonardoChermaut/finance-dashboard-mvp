'use client';

import type { Transaction } from '@/modules/transactions/transaction.types';
import { formatCentsToCurrency } from '@/utils/format';
import {
  LoadingWrapper,
  TransactionAccount,
  TransactionInfo,
  TransactionItem,
  TransactionList,
  TransactionMeta,
  TransactionValue,
} from './dashboard-drilldown-panel.styled';

type DrilldownTransactionsProps = {
  transactions: readonly Transaction[];
  hasFilteredTransactions: boolean;
  currency: string;
};

export const DrilldownTransactions = ({
  transactions,
  hasFilteredTransactions,
  currency,
}: DrilldownTransactionsProps) => {
  return (
    <TransactionList>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id}>
          <TransactionInfo>
            <TransactionAccount>{transaction.account}</TransactionAccount>
            <TransactionMeta>
              {transaction.date.toLocaleDateString('pt-BR')} - {transaction.industry} -{' '}
              {transaction.state}
            </TransactionMeta>
          </TransactionInfo>
          <TransactionValue $type={transaction.transactionType}>
            {transaction.transactionType === 'deposit' ? '+' : '-'}{' '}
            {formatCentsToCurrency(transaction.amountInCents, currency)}
          </TransactionValue>
        </TransactionItem>
      ))}
      {!hasFilteredTransactions ? (
        <LoadingWrapper>Nenhuma transacao encontrada</LoadingWrapper>
      ) : null}
    </TransactionList>
  );
};
