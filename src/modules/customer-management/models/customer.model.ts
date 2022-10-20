export interface CustomerModel {
  tenantId?: number;
  name: string;
  id?: number;
  key?: number;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  postalCode: string | null;
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
  external_code: number;
}
