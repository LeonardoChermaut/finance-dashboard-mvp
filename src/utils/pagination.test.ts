import { getVisiblePages } from './pagination';

describe('getVisiblePages', () => {
  it('Returns all pages when total is less than five', () => {
    expect(getVisiblePages(1, 3)).toEqual([1, 2, 3]);
  });

  it('Returns all pages when total is exactly five', () => {
    expect(getVisiblePages(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('Returns first five pages when current is at the start', () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('Returns last five pages when current is at the end', () => {
    expect(getVisiblePages(10, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('Returns centered window when current is in the middle', () => {
    expect(getVisiblePages(5, 10)).toEqual([3, 4, 5, 6, 7]);
  });

  it('Handles page two at the start of the critical range', () => {
    expect(getVisiblePages(2, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('Handles page eight at the end of the critical range', () => {
    expect(getVisiblePages(8, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('Returns array with exactly five elements when total exceeds five', () => {
    const result = getVisiblePages(5, 20);
    expect(result).toHaveLength(5);
  });

  it('Returns sorted array in ascending order', () => {
    const result = getVisiblePages(15, 30);
    for (let index = 1; index < result.length; index++) {
      expect(result[index]).toBeGreaterThan(result[index - 1]);
    }
  });

  it('Does not include pages smaller than one', () => {
    const result = getVisiblePages(1, 100);
    expect(result[0]).toBeGreaterThanOrEqual(1);
  });

  it('Does not include pages larger than total', () => {
    const result = getVisiblePages(100, 100);
    expect(result[4]).toBeLessThanOrEqual(100);
  });
});
