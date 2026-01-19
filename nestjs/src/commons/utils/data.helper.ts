import { SECONDS_MS } from '../../config/constants.js';
import { PaginationMetadata } from '../interfaces/pagination.interface.js';

/**
 * Generate pagination metadata for API responses
 */
export function generatePaginationMetadata(
  page: number,
  per: number,
  totalCount: number,
): PaginationMetadata {
  const totalPages = Math.ceil(totalCount / per);
  return {
    current_page: Number(page),
    next_page: page >= totalPages ? null : page + 1,
    prev_page: page === 1 ? null : page - 1,
    total_pages: totalPages,
    total_count: totalCount,
  };
}

/**
 * Split a range into chunks
 *
 * Example: chunkArray(100, 980, 100)
 * Returns:
 * [
 *     [100, 200],
 *     [200, 300],
 *     [300, 400],
 *     [400, 500],
 *     [500, 600],
 *     [600, 700],
 *     [700, 800],
 *     [800, 900],
 *     [900, 980]
 * ]
 */
export function chunkArray(
  from: number,
  to: number,
  chunkSize: number,
): number[][] {
  const results: number[][] = [];
  let current = from;
  while (current <= to) {
    if (current > to) break;
    results.push([current, Math.min(current + chunkSize, to)]);
    current += chunkSize;
  }
  return results;
}

/**
 * Split a big array into smaller arrays of fixed size
 *
 * Example: splitArray([1,2,3,4,5,6,7,8,9,10], 3)
 * Returns: [[1,2,3], [4,5,6], [7,8,9], [10]]
 */
export function splitArray<T>(array: T[], size: number): T[][] {
  return Array(Math.ceil(array.length / size))
    .fill(null)
    .map((_, index) => index * size)
    .map((begin) => array.slice(begin, begin + size));
}

/**
 * Check if an object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return !obj || Object.keys(obj).length === 0;
}

/**
 * Get number of seconds until midnight (local time)
 */
export function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  return Math.floor((Number(midnight) - Number(now)) / SECONDS_MS);
}
