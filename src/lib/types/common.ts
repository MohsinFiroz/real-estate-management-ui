export interface SearchParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  sortBy?: string;
}

// Generic search response interface
export interface SearchResponse<T> {
  entities: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API response format
export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  statusCode?: number;
}