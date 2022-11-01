export interface VehicleResponseDto {
  created_at: string;
  updated_at: string;
  id: number;
  name: string;
  tenant_id: number;
  workplace_id: number;
  plate_number: string;
  max_capacity: number;
  permission_flag: number;
  workplace___name: string;
  vehicle_type___name: string;
  vehicle_type_id: number;
  workplace___workplace_type: number;
}
