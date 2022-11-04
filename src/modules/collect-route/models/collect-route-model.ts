import { CollectionPoint } from "@/modules/collection-point-management/models/collection-point.model";

export interface CollectRoute {
  id?: number;
  collect_order_id: number;
  list_coordinates: string;
  start_point_id?: number;
  end_point_id?: number;
}

export interface CollectRouteDto extends CollectRoute {
  id: number;
}

export interface CollectRouteViewModel {
  name: string;
  workPlace: string;
  list_coordinates: CollectionPoint[];
  start_point_id: number;
  end_point_id: number;
}
