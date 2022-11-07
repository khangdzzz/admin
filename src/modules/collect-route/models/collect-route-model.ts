import { CollectionPoint } from "@/modules/collection-point-management/models/collection-point.model";
import { CollectionRoute } from "@/modules/collection-route-management/models/collection-route.model";
import { workPlace } from "@/modules/staff-management/models/staff.model";

export interface CollectRoute {
  id?: number;
  collect_order_id: number;
  list_coordinates: string;
  start_point_id?: number;
  end_point_id?: number;
  end_point_workplace: workPlace;
  start_point_workplace: workPlace;
}

export interface CollectRouteDto extends CollectRoute, CollectionRoute {
  id: number;
}

export interface CollectRouteViewModel {
  name: string;
  workPlace: string;
  list_coordinates: CollectionPoint[];
  start_point_id: number;
  end_point_id: number;
}
