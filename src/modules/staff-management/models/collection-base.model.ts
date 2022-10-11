import { InputType } from "@/modules/base/models/input.model";

export interface FormData {
  [key: string]: InputType[];
}

export interface CollectionBase {
  key?: number;
  id?: number;
  postal_code: string;
  name: string;
  address: string;
  phone_number: string;
}
export interface CollectionBaseDetail {
  key?: number;
  id?: number;
  name: string;
  shortName: string;
  kana: string;
  postalCode: string;
  email: string;
  representative: string;
  latitude: string | number;
  longitude: string | number;
  address: string;
  telephone: string;
}
