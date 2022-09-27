import { Pagination } from "@/modules/common/models";
import { ContainerType } from "@/modules/container/models";
import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { transformRequest } from "./base.service";
import {
  CreateVehicleTypeInputDto,
  VehicleTypeResponseDto
} from "./dtos/vehicle-management/create-vehicle-type.dto";
import createVehicleTypeResponse from "./mocks/vehicle-type/create-vehicle-type.response.json";
import getListVehicleTypeResponse from "./mocks/vehicle-type/get-list-vehicle-type.reponse.json";
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
  const res: VehicleTypeResponseDto = createVehicleTypeResponse;
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    id,
    tenantId: tenant_id,
    name: typeName,
    key: 0
  });
}

export async function fetchListVehicleType(
  page: 1,
  size: 10
): Promise<Pagination<ContainerType> | undefined> {
  page;
  size;
  // const [error, res] = await transformRequest<PaginationDto<VehicleTypeResponseDto>>({
  //     url: "/vehicle-types",
  //     method: "get",
  // });
  // if (error || !res) return undefined;
  const res: PaginationDto<VehicleTypeResponseDto> = getListVehicleTypeResponse;
  if (!res) return Promise.resolve(undefined);
  const {
    current_page: currentPage,
    page_size: pageSize,
    total,
    total_page: totalPage,
    results
  } = res;
  return {
    currentPage,
    pageSize,
    total,
    totalPage,
    results: []
    // results.map((vehicleTypeDto) => {
    //   const { id, name, tenant_id: tenantId } = vehicleTypeDto;
    //   return {
    //     id,
    //     name,
    //     tenantId
    //   };
    // })
  };
}

export async function getVehicleTypeById(
  id: string | string[]
): Promise<VehicleTypeModel | undefined> {
  const [error, res] = await transformRequest<VehicleTypeModel>({
    url: `/vehicle-types/${id}`,
    method: "get"
  });
  if (error) return undefined;
  return res;
}

export async function editVehicleTypeById(
  id: string | string[],
  tenant_id: number | string | undefined,
  name: string
): Promise<VehicleTypeModel | undefined> {
  const [error, res] = await transformRequest<VehicleTypeModel>({
    url: `/vehicle-types/${id}`,
    method: "put",
    data: { tenant_id, name }
  });
  if (error) return undefined;
  return res;
}
