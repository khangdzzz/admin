export interface CollectionRouteResponseDTO {
  created_at: string;
  updated_at: string;
  id: number;
  name: string;
  workplace___name: string;
  number_collect_points: number;
  collect_route___id: string;
  collect_point_ids: number[];
  collect_points: CollectionPointResponseDTO[];
  notice: string;
  workplace_id: string | number;
}

export interface CollectionPointResponseDTO {
  id: number;
  name: string;
  customer___name: string;
}
