import { NAME_CHANGE_WINDOW_MS } from '@/constants/config';

export const filterRecentTimestamps = (timestamps: number[]): number[] => {
  const now = Date.now();
  return timestamps.filter((timestamp) => now - timestamp < NAME_CHANGE_WINDOW_MS);
};
