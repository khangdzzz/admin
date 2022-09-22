import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import {
  CreateVehicleTypeInputDto,
  CreateVehicleTypeResponseDto
} from "./dtos/vehicle-management/create-vehicle-type.dto";
import createVehicleTypeResponse from "./mocks/vehicle-type/create-vehicle-type.response.json";
export function createVehicleType(
  tenantId: number,
  name: string
): Promise<VehicleTypeModel | undefined> {
  const data: CreateVehicleTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  data;
  // const [error, res] = await transformRequest<CreateVehicleTypeResponseDto>({
  //     url: "/vehicle-types",
  //     method: "post",
  //     data
  // });
  // if (error || !res) return undefined;
  // const { id, name: typeName, tenant_id } = res
  // return {
  //     id,
  //     tenantId: tenant_id,
  //     name: typeName
  // }
  const res: CreateVehicleTypeResponseDto = createVehicleTypeResponse;
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    id,
    tenantId: tenant_id,
    name: typeName
  });
}
