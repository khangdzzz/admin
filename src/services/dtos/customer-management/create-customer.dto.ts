export interface CreateCustomerDto {
  name: string | null;
  short_name: string | null;
  name_kana: string | null;
  postal_code: number | null;
  address: string | null;
  telephone: string | null;
  mail: string | null;
  representative: string | null;
  external_code: string | null;
}
