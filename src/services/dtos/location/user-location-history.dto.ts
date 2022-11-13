export interface UserLocationHistoryDto {
  collect_route: {
    list_coordinates: string;
    start_point_workplace?: PointWorkplace;
    end_point_workplace?: PointWorkplace;
  };
  collect_points: {
    name: string;
    latitude: number;
    longitude: number;
    id: number;
  }[];
  results: {
    latitude: number;
    longitude: number;
    current_weight: number;
    list_collected_points: number[];
    vehicle_name: string;
    vehicle_id: number;
    route_order_name: string;
    max_weight: number;
    user_name: string;
    last_update_time: string;
  }[];
}

interface PointWorkplace {
  latitude: number;
  longitude: number;
}
