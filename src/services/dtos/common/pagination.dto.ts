export interface PaginationDto<T> {
  count: number;
  current_page: number;
  total_page: number;
  page_size: number;
  results: T[];
}
