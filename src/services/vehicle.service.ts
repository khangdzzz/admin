import {
  Vehicle,
  VehicleType
} from "@/modules/vehicle-management/models/vehicle.model";
import { transformRequest } from "./base.service";
interface DataType {
  key: string;
  type: string;
  name: string;
  numberPlate: string;
}

const data: DataType[] = [
  {
    key: "1",
    type: "2T Truck",
    name: "2T Car 1",
    numberPlate: "Kagoshima 100Ah 11-11"
  },
  {
    key: "2",
    type: "3T Truck",
    name: "2T Car 1",
    numberPlate: "Kagoshima 100Ah 11-11"
  },
  {
    key: "3",
    type: "4T Truck",
    name: "2T Car 1",
    numberPlate: "Kagoshima 100Ah 11-11"
  },
  {
    key: "4",
    type: "5T Truck",
    name: "2T Car 1",
    numberPlate: "Kagoshima 100Ah 11-11"
  }
];

export function getListVehicle(): DataType[] {
  return data;
}

export function getVehicleTypes(): VehicleType[] {
  // const [error, res] = await transformRequest({
  //   url: "",
  //   method: "get",
  //   params: { pageSize, pageIndex }
  // });
  //if (error) return undefined;
  const res: VehicleType[] = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      id: `v${i}`,
      key: i,
      name: `Edward King ${i}`
    });
  }
  return res;
}

export async function createVehicle(
  vehicleInfo: Vehicle
): Promise<Vehicle | unknown> {
  const { vehicleType, vehicleName, vehiclePlate, maxWeight, code } =
    vehicleInfo;
  const [error, res] = await transformRequest({
    url: "",
    method: "post",
    data: { vehicleType, vehicleName, vehiclePlate, maxWeight, code }
  });
  if (error) return undefined;
  return res;
}
