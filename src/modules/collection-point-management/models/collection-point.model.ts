import { InputType } from "@/modules/base/models/input.model";

export interface CollectionPointModel {
  key?: number;
  id?: number;
  name: string;
  customer?: string;
  postalCode: string;
  address?: string;
  phoneNumber?: string | null;
}

export interface FormData {
  [key: string]: InputType[];
}

export interface CollectionPoint {
  customer_id: number;
  key?: number;
  name: string;
  short_name: string;
  name_kana: string;
  postcode: string;
  mail?: string | null;
  latitude: number;
  longitude: number;
  address?: string;
  telephone?: string | null;
}
