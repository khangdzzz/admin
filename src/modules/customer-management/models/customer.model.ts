export interface CustomerModel {
  name: string;
  id: number;
  key?: number;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  postalCode: string | null;
  externalCode?: string | null;
}

export interface Customer {
  name: string;
  short_name: string;
  name_kana: string;
  postal_code: number;
  address: string;
  telephone: string;
  mail: string;
  representative: string;
  external_code?: string;
  id: number;
}
export interface CustomerDetail {
  tenant_id: number;
  id: number;
  name: string;
  name_kana: string;
  short_name: string;
  workplace_type: number;
  base_type: number;
  postal_code: string;
  mail: string;
  representative: string;
  latitude: number;
  longitude: number;
  address: string;
  telephone: string;
  report_to: number;
  external_code?: string;
}

export interface EditCustomerDto {
  name: string;
  short_name: string;
  name_kana?: string;
  postal_code?: string;
  address?: string;
  telephone?: string;
  mail?: string;
  representative?: string;
  external_code?: string;
}

export interface CustomerDetail {
  tenant_id: number;
  id: number;
  name: string;
  name_kana: string;
  short_name: string;
  workplace_type: number;
  base_type: number;
  postal_code: string;
  mail: string;
  representative: string;
  latitude: number;
  longitude: number;
  address: string;
  telephone: string;
  report_to: number;
  external_code?: string;
}

export interface EditCustomerDto {
  name: string;
  short_name: string;
  name_kana?: string;
  postal_code?: string;
  address?: string;
  telephone?: string;
  mail?: string;
  representative?: string;
  external_code?: string;
}
