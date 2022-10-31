import { InputType } from "@/modules/base/models/input.model";

export interface FormDataCreateCollectionRoute {
  [key: string]: InputType[];
}
export interface CreateCollectionRoute {
  routeName: string;
  workplaceId: number;
  collectionPointIds: number[];
  notice: string | undefined;
  id: number | string;
}
export interface CreateCollectionRouteModel {
  name: string;
  workplace_id: string | number;
  collect_point_ids: number[] | string[];
  notice: string | undefined;
}
export interface CollectionBase {
  label: string;
  value: string | number;
}
export interface CollectionPoint {
  id: number;
  name: string;
  customerName?: string;
}
export interface CollectionRoute {
  id?: number;
  key?: number;
  name?: string;
  workPlace?: string;
  numberOfStore?: number;
  lastUpdate?: string;
  navigationId?: string;
  notice?: string;
  listCollectionPoint?: any[];
  workplaceId: string | number;
}
export interface CreateCollectionRouteResponseDto {
  created_at: string;
  created_by: number;
  updated_at?: string;
  updated_by?: number;
  deleted_at?: string;
  deleted_by?: number;
  tenant_id: number;
  workplace_id: number;
  name: string;
  collect_point_ids: string;
  number_collect_points: number;
  notice?: string;
  id: number;
}
