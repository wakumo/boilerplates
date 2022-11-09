import { PaginationMetadata } from '../interfaces/index.js';

export function generatePaginationMetadata(
  page: number,
  per: number,
  totalCount: number,
): PaginationMetadata {
  const totalPages = Math.ceil(totalCount / per);
  return {
    current_page: page,
    next_page: page >= totalPages ? null : page + 1,
      prev_page: page === 1 ? null : page - 1,
    total_pages: totalPages,
    total_count: totalCount,
  };
}
