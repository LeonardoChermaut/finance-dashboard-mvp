const HALF_WINDOW = 2;
const EDGE_THRESHOLD = 3;
const MAX_VISIBLE_PAGES = 5;

export const getVisiblePages = (current: number, total: number): number[] => {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (__, index) => index + 1);
  }
  if (current <= EDGE_THRESHOLD) {
    return [1, 2, 3, 4, 5];
  }
  if (current >= total - HALF_WINDOW) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }

  return [current - HALF_WINDOW, current - 1, current, current + 1, current + HALF_WINDOW];
};
