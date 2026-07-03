import { formatCentsToCurrency } from './format';

describe('formatCentsToCurrency', () => {
  it('Formats zero cents correctly', () => {
    expect(formatCentsToCurrency(0, 'BRL')).toBe('R$\u00a00,00');
  });

  it('Formats positive amounts correctly', () => {
    expect(formatCentsToCurrency(1500, 'BRL')).toBe('R$\u00a015,00');
  });

  it('Formats large amounts correctly', () => {
    expect(formatCentsToCurrency(1234567, 'BRL')).toBe('R$\u00a012.345,67');
  });

  it('Formats amounts with decimal cents', () => {
    expect(formatCentsToCurrency(1999, 'BRL')).toBe('R$\u00a019,99');
  });

  it('Formats negative amounts correctly', () => {
    expect(formatCentsToCurrency(-500, 'BRL')).toBe('-R$\u00a05,00');
  });

  it('Formats USD currency correctly', () => {
    expect(formatCentsToCurrency(1000, 'USD')).toContain('10');
  });

  it('Handles single cent', () => {
    expect(formatCentsToCurrency(1, 'BRL')).toBe('R$\u00a00,01');
  });
});
