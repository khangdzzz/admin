export interface PageOption {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
}
export interface VehicleSelection {
  value: string | number;
  label: string;
}
export interface VehicleType {
  id: number | string;
  key: number;
  name: string;
}
export interface Vehicle {
  id: number | undefined;
  vehicleType: number | string;
  vehicleName: string;
  vehiclePlate: string;
  maxWeight: number;
  code: string;
}
