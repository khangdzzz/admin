export interface UserLocationHistoryDto {
  collect_route: {
    list_coordinates: string;
  };
  collect_order: {
    collect_points: {
      name: string;
      latitude: number;
      longitude: number;
    }[];
  };
  results: {
    latitude: number;
    longitude: number;
    current_weight: number;
    list_collected_points: number[];
  }[];
}
