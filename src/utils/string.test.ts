import { getInitials } from './string';

describe('getInitials', () => {
  it('Returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });

  it('Returns first letter for single word name', () => {
    expect(getInitials('Joao')).toBe('J');
  });

  it('Returns two initials for full name', () => {
    expect(getInitials('Joao Silva')).toBe('JS');
  });

  it('Returns only two initials for names with more than two words', () => {
    expect(getInitials('Joao Maria Silva')).toBe('JM');
  });

  it('Converts initials to uppercase', () => {
    expect(getInitials('ana maria')).toBe('AM');
  });

  it('Handles extra spaces between words', () => {
    expect(getInitials('  Joao   Silva  ')).toBe('JS');
  });

  it('Returns single character initial for one letter input', () => {
    expect(getInitials('A')).toBe('A');
  });

  it('Does not mutate the input string', () => {
    const input = 'Joao Silva';
    getInitials(input);
    expect(input).toBe('Joao Silva');
  });
});
