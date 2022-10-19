import { InputType } from "@/modules/base/models/input.model";

export interface FormData {
  [key: string]: InputType[];
}
export interface CollectionBase {
  key?: number;
  id?: number;
  name: string;
  shortName: string;
  kana: string;
  postalCode: string;
  email?: string | null;
  representative: string;
  latitude: number;
  longitude: number;
  address?: string;
  telephone?: string | null;
  collectionBaseType: number;
}
