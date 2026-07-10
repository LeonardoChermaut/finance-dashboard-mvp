export const calculateVariation = (current: number, previous: number): string => {
  if (previous === 0) {
    return current > 0 ? 'Novo' : 'Sem dados';
  }

  const change = current - previous;
  const percentage = Math.round((Math.abs(change) / Math.abs(previous)) * 100);

  if (change > 0) {
    return `+${percentage}% vs período anterior`;
  }
  if (change < 0) {
    return `-${percentage}% vs período anterior`;
  }
  return 'Sem alteração vs período anterior';
};

export const calculatePendingVariation = (current: number, previous: number): string => {
  const change = current - previous;

  if (previous === 0 && current === 0) {
    return 'Sem dados';
  }
  if (previous === 0) {
    return `+${change} vs período anterior`;
  }

  if (change > 0) {
    return `+${change} vs período anterior`;
  }
  if (change < 0) {
    return `${change} vs período anterior`;
  }
  return 'Sem alteração vs período anterior';
};
