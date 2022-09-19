import { VehicleType } from "@/modules/vehicle-management/models/vehicleType.model";
//import { transformRequest } from "./base.service";

export function getVehicleTypes(): VehicleType[] {
  // const [error, res] = await transformRequest({
  //   url: "",
  //   method: "get",
  //   data: { pageSize, pageIndex }
  // });
  //if (error) return undefined;
  const res: VehicleType[] = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      id: i,
      name: `Edward King ${i}`
    });
  }
  return res;
}
