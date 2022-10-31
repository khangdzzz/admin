export interface CollectionPoint extends Date {
  tenant_id: number;
  customer_id: number;
  name: string;
  name_kana: string;
  short_name: string;
  mail: string;
  extension_code: string;
  tag_id: string;
  external_code: string;
  postcode: string;
  address: string;
  telephone: string;
  latitude: number;
  longitude: number;
  id: number;
  customer___name: string;
}

export interface CollectionPointResponseDto {
  created_at?: Date;
  created_by?: number | string;
  updated_at?: Date;
  updated_by?: number | string | null;
  deleted_at?: Date | null;
  deleted_by?: number | string | null;
  id: number;
  tenant_id: number;
  workplace_id?: number;
  name: string;
  name_kana: string;
  short_name: string;
  mail: string;
  extension_code: string;
  tag_id: string;
  external_code: string;
  postcode: string;
  address: string;
  telephone: string;
  latitude: number;
  longitude: number;
  workplace___name?: string;
  customer?: string;
  customer___name: string;
}

export interface CollectionPointRequestDTO {
  id?: number;
  customer_id: number;
  name: string | null;
  short_name: string;
  name_kana: string;
  postcode: string;
  address: string;
  telephone: string | null;
  mail: string | null;
  external_code: string;
  latitude: number | null;
  longitude: number | null;
}
