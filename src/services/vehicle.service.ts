import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import {
  Vehicle,
  VehicleSelection,
  // VehicleType,
  VehicleDetail
} from "@/modules/vehicle-management/models/vehicle.model";
import { transformRequest } from "./base.service";

const data: VehicleDetail[] = [];

export function getListVehicle(): VehicleDetail[] {
  return data;
}
export function getMockCollectionBase(): VehicleSelection[] {
  const res: VehicleSelection[] = [];
  return res;
}

export function getMockPartner(): VehicleSelection[] {
  const res: VehicleSelection[] = [
    { value: 1, label: "Partner 1" },
    { value: 2, label: "Partner 2" }
  ];
  return res;
}

export function getVehicleTypes(): VehicleTypeModel[] {
  // const [error, res] = await transformRequest({
  //   url: "",
  //   method: "get",
  //   params: { pageSize, pageIndex }
  // });
  //if (error) return undefined;
  const res: VehicleTypeModel[] = [];
  // for (let i = 0; i < 20; i++) {
  //   res.push({
  //     id: `v${i}`,
  //     key: i,
  //     name: `Edward King ${i}`
  //   });
  // }
  return res;
}

export async function createVehicle(
  vehicleInfo: Vehicle
): Promise<Vehicle | unknown> {
  const {
    ownerId,
    vehicleType,
    vehicleName,
    vehiclePlate,
    maxWeight,
    code,
    isHasPermission
  } = vehicleInfo;
  const [error, res] = await transformRequest({
    url: "",
    method: "post",
    data: {
      ownerId,
      vehicleType,
      vehicleName,
      vehiclePlate,
      maxWeight,
      code,
      isHasPermission
    }
  });
  if (error) return undefined;
  return res;
}

export async function updateVehicle(
  vehicleInfo: Vehicle
): Promise<Vehicle | unknown> {
  const { vehicleType, vehicleName, vehiclePlate, maxWeight, code, id } =
    vehicleInfo;
  const [error, res] = await transformRequest({
    url: `update-vehicle/${id}`,
    method: "patch",
    params: {},
    data: { vehicleType, vehicleName, vehiclePlate, maxWeight, code }
  });
  if (error) return undefined;
  return res;
}

export function getVehicleById(id: string): VehicleDetail | undefined {
  const vehicle = data.find((item) => item.key === id) || undefined;

  return vehicle;
}
