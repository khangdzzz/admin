import { Pagination } from "@/modules/common/models";
import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import {
  CreateVehicleTypeInputDto,
  VehicleTypeResponseDto
} from "./dtos/vehicle-management/create-vehicle-type.dto";
export async function createVehicleType(
  tenantId: number,
  name: string
): Promise<VehicleTypeModel | undefined> {
  const data: CreateVehicleTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  const [error, res] = await transformRequest<VehicleTypeResponseDto>({
    url: "/vehicle_type",
    method: "post",
    data
  });
  if (error || !res) return undefined;
  const { id, name: typeName, tenant_id } = res;
  return {
    id,
    tenantId: tenant_id,
    name: typeName,
    key: 0
  };
}

export async function fetchListVehicleType(
  page: 1,
  size: 10
): Promise<Pagination<VehicleTypeModel> | undefined> {
  page;
  size;
  const [error, res] = await transformRequest<
    PaginationDto<VehicleTypeResponseDto>
  >({
    url: "/vehicle_type",
    method: "get"
  });
  if (error || !res) return undefined;
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
    results: results.map((vehicleTypeDto) => {
      const { id, name, tenant_id: tenantId } = vehicleTypeDto;
      return {
        id,
        name,
        tenantId,
        key: 0
      };
    })
  };
}

export async function getVehicleTypeById(
  id: string | string[]
): Promise<VehicleTypeModel | undefined> {
  const [error, res] = await transformRequest<VehicleTypeModel>({
    url: `/vehicle_type/${id}`,
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
  const data = {
    tenant_id,
    name
  };
  const [error, res] = await transformRequest<VehicleTypeModel>({
    url: `/vehicle_type/${id}`,
    method: "put",
    data
  });
  if (error) return undefined;
  return res;
}

export async function deleteVehicleTypeById(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest<VehicleTypeModel>({
    url: `/vehicle_type`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
