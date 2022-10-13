import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import {
  CreateVehicleTypeInputDto,
  VehicleTypeResponseDto
} from "./dtos/vehicle-management/create-vehicle-type.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { AxiosError } from "axios";

export async function createVehicleType(
  tenantId: number,
  name: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[AxiosError<unknown, unknown>, null] | [null, VehicleTypeResponseDto] | any> {
  const data: CreateVehicleTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  return transformRequest<VehicleTypeResponseDto>({
    url: "/vehicle_type",
    method: "post",
    data
  });

}

export async function getAllVehicleType(): Promise<
  VehicleTypeResponseDto[] | undefined
> {
  const params = {
    page: 1,
    page_size: "full",
    order_by: "-created_at"
  };
  const [err, res] = await transformRequest<VehicleTypeResponseDto[]>({
    url: "/vehicle_type",
    method: "get",
    params
  });

  if (err || !res) return Promise.resolve(undefined);
  return res;
}

export async function fetchListVehicleType(
  page: number,
  size: number | string,
  sort: Sort = Sort.None,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<VehicleTypeModel> | undefined> {
  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by:
      sort === Sort.None
        ? DEFAULT_SORT_ORDER
        : sort === Sort.Asc
          ? "name"
          : "-name"
  };

  const [error, res] = await transformRequest<
    PaginationDto<VehicleTypeResponseDto>
  >({
    url: "/vehicle_type",
    method: "get",
    params
  });
  if (error || !res) return undefined;
  if (!res) return Promise.resolve(undefined);
  const {
    current_page: currentPage = page,
    page_size: pageSize = size,
    count: total = 0,
    total_page: totalPage = 1,
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[AxiosError<unknown, unknown>, null] | [null, VehicleTypeModel] | any> {
  const data = {
    tenant_id,
    name
  };
  return transformRequest<VehicleTypeModel>({
    url: `/vehicle_type/${id}`,
    method: "put",
    data
  });

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
