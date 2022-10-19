export interface CollectionBaseResponseDto {
  created_at?: Date;
  created_by?: number | string;
  updated_at?: Date;
  updated_by?: number | string | null;
  deleted_at?: Date | null;
  deleted_by?: number | string | null;
  id?: number;
  tenant_id?: number;
  name: string;
  name_kana: string;
  short_name: string;
  workplace_type?: number;
  base_type: number;
  postal_code: string;
  mail?: string | null;
  representative: string;
  latitude: number;
  longitude: number;
  address?: string;
  telephone?: string | null;
  report_to?: number;
}
