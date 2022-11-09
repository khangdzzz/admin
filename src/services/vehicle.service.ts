import { Sort } from "@/modules/common/models/sort.enum";
import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import {
  Vehicle,
  VehicleSelection,
  VehicleDetail,
  ResVehicle,
  EditVehicleDto
} from "@/modules/vehicle-management/models/vehicle.model";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { VehicleResponseDto } from "./dtos/vehicle-management/vehicle-type.dto";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import { calculateSortQuery } from "@/modules/common/helpers";
import { makeUniqueName } from "@/utils/string.helper";
import { ServiceResponse } from "@/modules/common/models";

interface sortVehicleDto {
  sortType: Sort;
  sortName: Sort;
  sortPlateNumber: Sort;
  sortWorkPlace: Sort;
  sortCapacity: Sort;
  sortPermission: Sort;
}

const data: VehicleDetail[] = [];

export async function getListVehicle(
  page: number,
  size: number,
  sort: sortVehicleDto,
  searchKeyword: string | null | undefined = ""
): Promise<PaginationDto<ResVehicle> | undefined> {
  const {
    sortType,
    sortName,
    sortPlateNumber,
    sortWorkPlace,
    sortCapacity,
    sortPermission
  } = sort;

  const orderSortType = calculateSortQuery("vehicle_type___name", sortType);
  const orderSortName = calculateSortQuery("name", sortName);
  const orderSortPlateNumber = calculateSortQuery(
    "plate_number",
    sortPlateNumber
  );
  const orderSortWorkPlace = calculateSortQuery(
    "workplace___name",
    sortWorkPlace
  );
  const orderSortCapacity = calculateSortQuery("max_capacity", sortCapacity);
  const orderSortPermission = calculateSortQuery(
    "permission_flag",
    sortPermission
  );

  const order_by = [
    orderSortType,
    orderSortName,
    orderSortPlateNumber,
    orderSortWorkPlace,
    orderSortCapacity,
    orderSortPermission
  ]
    .filter((item) => !!item)
    .toString();

  const params = {
    page,
    page_size: size,
    __all__: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
  };
  const [err, res] = await transformRequest<PaginationDto<ResVehicle>>({
    url: "/vehicle",
    method: "get",
    params
  });
  if (err) return undefined;
  res.current_page = page;
  res.page_size = size;
  return res;
}

export async function deleteVehicleById(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/vehicle`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function getCollectionBase(
  type: number | undefined
): Promise<CollectionBaseResponseDto[] | undefined> {
  const params = {
    workplace_type: type,
    page_size: "full"
  };
  const [err, res] = await transformRequest<CollectionBaseResponseDto[]>({
    url: `workplace/options`,
    method: "get",
    params
  });
  if (err) return undefined;
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
): Promise<ServiceResponse<Vehicle>> {
  const {
    ownerId,
    ownerType,
    vehicleType,
    vehicleName,
    vehiclePlate,
    maxWeight,
    isHasPermission
  } = vehicleInfo;
  const [error, res] = await transformRequest<Vehicle>({
    url: "/vehicle",
    method: "post",
    data: {
      workplace___workplace_type: ownerType,
      workplace_id: ownerId,
      vehicle_type_id: vehicleType,
      name: vehicleName,
      plate_number: vehiclePlate,
      max_capacity: maxWeight || null,
      permission_flag: isHasPermission
    }
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details[0].loc
    };
  }

  return {
    res
  };
}

export async function getVehicleDetail(
  vehicleId: string
): Promise<Vehicle | undefined> {
  const [error, res] = await transformRequest<VehicleResponseDto>({
    url: `/vehicle/${vehicleId}`,
    method: "get"
  });
  if (error || !res) return undefined;
  if (!res) return Promise.resolve(undefined);
  const {
    id,
    name,
    workplace___name,
    vehicle_type___name,
    vehicle_type_id,
    workplace___workplace_type,
    plate_number,
    permission_flag,
    max_capacity
  } = res;
  const detail = {
    ownerName: workplace___name,
    vehicleType: vehicle_type___name,
    vehicleTypeId: vehicle_type_id,
    vehicleName: name,
    vehiclePlate: plate_number,
    maxWeight: max_capacity,
    isHasPermission: permission_flag,
    ownerType: workplace___workplace_type,
    id
  };
  return detail;
}

export async function updateVehicle(
  vehicleInfo: EditVehicleDto
): Promise<ServiceResponse<Vehicle>> {
  const {
    vehicleType,
    vehicleName,
    vehiclePlate,
    maxWeight,
    id,
    isHasPermission
  } = vehicleInfo;
  const [error, res] = await transformRequest<Vehicle>({
    url: `vehicle/${id}`,
    method: "put",
    params: {},
    data: {
      vehicle_type_id: vehicleType,
      name: makeUniqueName(vehicleName),
      plate_number: vehiclePlate,
      max_capacity: maxWeight || null,
      permission_flag: isHasPermission
    }
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details[0].loc
    };
  }

  return {
    res
  };
}

export function getVehicleById(id: string): VehicleDetail | undefined {
  const vehicle = data.find((item) => item.key === id) || undefined;

  return vehicle;
}
