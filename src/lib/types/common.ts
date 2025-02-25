export type SortOrder = 'asc' | 'desc';

export interface SortField {
  field: string;
  order: SortOrder;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  roleFilter?: string;
  statusFilter?: string;
}

export interface SortParams {
  sortBy: SortField[];
}

export type UserQueryParams = PaginationParams & FilterParams & SortParams;