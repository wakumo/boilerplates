export interface PaginationMetadata {
  current_page: number,
  next_page: number | null,
  prev_page: number | null,
  total_pages: number,
  total_count: number
}
