export const formatCentsToCurrency = (amountInCents: number, currency: string): string => {
  const amount = amountInCents / 100;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};
