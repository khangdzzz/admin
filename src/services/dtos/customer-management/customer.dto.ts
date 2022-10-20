export interface CreateCustomerInputDto {
  tenant_id: number;
  name: string;
}

export interface CustomerResponseDto {
  created_at: Date;
  created_by: number;
  updated_at: Date;
  updated_by: string | number | null;
  deleted_at: Date | null;
  deleted_by: string | number | null;
  id: number;
  tenant_id: number;
  name: string;
  name_kana: string | null;
  short_name: string;
  workplace_type: number;
  base_type: number;
  postal_code: string | null;
  mail: string | null;
  representative: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  telephone: string | null;
  report_to: number;
}
