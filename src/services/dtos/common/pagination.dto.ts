export interface PaginationDto<T> {
  total: number;
  current_page: number;
  total_page: number;
  page_size: number;
  results: T[];
}
