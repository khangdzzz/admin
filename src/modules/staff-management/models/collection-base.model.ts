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
