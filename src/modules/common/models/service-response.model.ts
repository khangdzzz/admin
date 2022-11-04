export interface ServiceResponse<T> {
  error?: string
  res?: T;
  errorParams?: string[];
}
