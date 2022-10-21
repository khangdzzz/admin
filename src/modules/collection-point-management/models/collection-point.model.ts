export interface CollectionPointModel {
  key?: number;
  id?: number;
  name: string;
  customer: string;
  postalCode: string;
  address?: string;
  phoneNumber?: string | null;
}
