export interface Pagination<T> {
  total: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  results: T[];
}
