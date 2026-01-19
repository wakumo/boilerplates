import { PaginationMetadata } from '../interfaces/index.js';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}
