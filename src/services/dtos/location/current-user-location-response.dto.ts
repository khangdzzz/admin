export interface CurrentUserLocationResponseDto {
  workplace_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  tenant_id: number;
  last_update_time: Date;
  vehicle_id: number;
  vehicle_name: string;
  number_plate: string;
  route_order_id: number;
  route_order_name: string;
  latitude: number;
  longitude: number;
  max_weight: number;
  current_weight: number;
}
