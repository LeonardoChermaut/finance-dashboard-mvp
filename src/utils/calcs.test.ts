import { calculateVariation, calculatePendingVariation } from './calcs';

describe('calculateVariation', () => {
  it('Returns "Novo" when previous is zero and current is positive', () => {
    expect(calculateVariation(100, 0)).toBe('Novo');
  });

  it('Returns "Sem dados" when both values are zero', () => {
    expect(calculateVariation(0, 0)).toBe('Sem dados');
  });

  it('Returns "Sem alteracao" when values are equal', () => {
    expect(calculateVariation(50, 50)).toBe('Sem alteracao vs periodo anterior');
  });

  it('Calculates positive variation with integer percentage', () => {
    expect(calculateVariation(100, 80)).toBe('+25% vs periodo anterior');
  });

  it('Calculates negative variation with integer percentage', () => {
    expect(calculateVariation(80, 100)).toBe('-20% vs periodo anterior');
  });

  it('Rounds percentage up for positive variation', () => {
    expect(calculateVariation(133, 100)).toBe('+33% vs periodo anterior');
  });

  it('Rounds percentage up for negative variation', () => {
    expect(calculateVariation(67, 100)).toBe('-33% vs periodo anterior');
  });

  it('Does not mutate input arguments', () => {
    const current = 100;
    const previous = 50;
    calculateVariation(current, previous);
    expect(current).toBe(100);
    expect(previous).toBe(50);
  });
});

describe('calculatePendingVariation', () => {
  it('Returns "Sem dados" when both values are zero', () => {
    expect(calculatePendingVariation(0, 0)).toBe('Sem dados');
  });

  it('Returns absolute change when previous is zero and current is not', () => {
    expect(calculatePendingVariation(5, 0)).toBe('+5 vs periodo anterior');
  });

  it('Calculates positive variation', () => {
    expect(calculatePendingVariation(10, 5)).toBe('+5 vs periodo anterior');
  });

  it('Calculates negative variation', () => {
    expect(calculatePendingVariation(3, 8)).toBe('-5 vs periodo anterior');
  });

  it('Returns "Sem alteracao" when non-zero values are equal', () => {
    expect(calculatePendingVariation(7, 7)).toBe('Sem alteracao vs periodo anterior');
  });

  it('Does not mutate input arguments', () => {
    const current = 10;
    const previous = 5;
    calculatePendingVariation(current, previous);
    expect(current).toBe(10);
    expect(previous).toBe(5);
  });
});
