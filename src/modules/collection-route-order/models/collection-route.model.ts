import { CollectionPoint } from "@/modules/collection-point-management/models/collection-point.model";

export interface CollectionRoute {
  id?: number;
  key?: number;
  name?: string;
  workPlace?: string;
  numberOfStore?: number;
  lastUpdate?: string;
  navigationId?: string;
  notice?: string;
  listCollectionPoint?: CollectionPoint[];
}
