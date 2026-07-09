import { formatDate, formatDateToInputValue } from './date';

const createDate = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe('formatDateToInputValue', () => {
  it('Formats date to YYYY-MM-DD format', () => {
    const date = createDate(2024, 1, 15);
    expect(formatDateToInputValue(date)).toBe('2024-01-15');
  });

  it('Pads single digit month with zero', () => {
    const date = createDate(2024, 3, 10);
    expect(formatDateToInputValue(date)).toBe('2024-03-10');
  });

  it('Pads single digit day with zero', () => {
    const date = createDate(2024, 6, 5);
    expect(formatDateToInputValue(date)).toBe('2024-06-05');
  });

  it('Handles december correctly', () => {
    const date = createDate(2024, 12, 31);
    expect(formatDateToInputValue(date)).toBe('2024-12-31');
  });

  it('Handles first day of year', () => {
    const date = createDate(2024, 1, 1);
    expect(formatDateToInputValue(date)).toBe('2024-01-01');
  });
});

describe('formatDate', () => {
  it('Formats date in pt-BR long format', () => {
    const date = createDate(2024, 1, 15);
    const result = formatDate(date);
    expect(result).toContain('janeiro');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('Formats december date correctly', () => {
    const date = new Date(2024, 11, 25);
    const result = formatDate(date);
    expect(result).toContain('dezembro');
  });

  it('Formats date with full month name', () => {
    const date = createDate(2024, 6, 15);
    const result = formatDate(date);
    expect(result).toContain('junho');
  });

  it('Includes year in the result', () => {
    const date = createDate(2023, 1, 1);
    const result = formatDate(date);
    expect(result).toContain('2023');
  });

  it('Includes day number in the result', () => {
    const date = createDate(2024, 1, 28);
    const result = formatDate(date);
    expect(result).toContain('28');
  });
});
