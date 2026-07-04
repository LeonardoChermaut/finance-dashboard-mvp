import { filterRecentTimestamps } from './profile';

const NAME_CHANGE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const NOW = new Date('2024-06-15T12:00:00Z').getTime();

const RECENT_TIMESTAMP = NOW - 1000;
const OLD_TIMESTAMP = NOW - NAME_CHANGE_WINDOW_MS - 1000;
const ANOTHER_RECENT_TIMESTAMP = NOW - 2000;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('filterRecentTimestamps', () => {
  it('Returns empty array for empty input', () => {
    expect(filterRecentTimestamps([])).toEqual([]);
  });

  it('Returns recent timestamp within the window', () => {
    expect(filterRecentTimestamps([RECENT_TIMESTAMP])).toEqual([RECENT_TIMESTAMP]);
  });

  it('Filters out old timestamp outside the window', () => {
    expect(filterRecentTimestamps([OLD_TIMESTAMP])).toEqual([]);
  });

  it('Mixes recent and old timestamps correctly', () => {
    expect(filterRecentTimestamps([RECENT_TIMESTAMP, OLD_TIMESTAMP, RECENT_TIMESTAMP])).toEqual([
      RECENT_TIMESTAMP,
      RECENT_TIMESTAMP,
    ]);
  });

  it('Returns all timestamps when all are within the window', () => {
    const timestamps = [RECENT_TIMESTAMP, ANOTHER_RECENT_TIMESTAMP, NOW - 3000];
    expect(filterRecentTimestamps(timestamps)).toEqual(timestamps);
  });

  it('Does not mutate the input array', () => {
    const timestamps = [RECENT_TIMESTAMP, ANOTHER_RECENT_TIMESTAMP];
    filterRecentTimestamps(timestamps);
    expect(timestamps).toEqual([RECENT_TIMESTAMP, ANOTHER_RECENT_TIMESTAMP]);
  });
});
