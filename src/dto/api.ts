// Standard API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// List response with pagination
export interface ApiListResponse<T> {
  results: T[];
  pagination?: PaginationMeta;
}

// Error response
export interface ApiErrorResponse {
  error: string;
  details?: string;
}
