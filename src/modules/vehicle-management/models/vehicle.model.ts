export interface PageOption {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  currentPage: number;
}
export interface VehicleSelection {
  value: string | number;
  label: string;
}
export interface Vehicle {
  id: number | undefined | string;
  ownerType: number;
  ownerId?: number;
  ownerName?: string;
  vehicleType: number | string;
  vehicleTypeId: number;
  vehicleName: string;
  vehiclePlate: string;
  maxWeight?: number;
  code?: string;
  isHasPermission?: number;
}

export interface VehicleDetail {
  key: string;
  type: string;
  name: string;
  ownerId?: number;
  ownerType?: string;
  numberPlate: string;
  maxWeight: number | null;
  code: string | null;
  industrial: boolean;
}

export interface ResVehicle {
  created_at: Date;
  created_by: string | null;
  updated_at: Date;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
  id: number;
  key: number;
  tenant_id: number;
  workplace_id: number;
  vehicle_type_id: number;
  plate_number: string;
  name: string;
  ext_code: string;
  max_capacity: string;
  permission_flag: number;
  workplace__name: string;
  vehicle_type___name: string;
}

export interface EditVehicleDto {
  id: number;
  ownerName?: string;
  vehicleType: number;
  vehicleName: string;
  vehiclePlate: string;
  maxWeight?: number;
  code?: string;
  isHasPermission?: number;
}
