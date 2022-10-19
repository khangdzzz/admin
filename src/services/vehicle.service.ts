import { Sort } from "@/modules/common/models/sort.enum";
import { VehicleTypeModel } from "@/modules/vehicle-management/models";
import {
  Vehicle,
  VehicleSelection,
  VehicleDetail,
  ResVehicle
} from "@/modules/vehicle-management/models/vehicle.model";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { VehicleResponseDto } from "./dtos/vehicle-management/vehicle-type.dto";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";


const data: VehicleDetail[] = [];

export async function getListVehicle(
  page: number,
  size: number,
  sort: Sort = Sort.None,
  sortBy: string,
  searchKeyword: string | null | undefined = ""
): Promise<PaginationDto<ResVehicle> | undefined> {

  const order_by = sort === Sort.None
    ? DEFAULT_SORT_ORDER
    : sort === Sort.Asc
      ? `${sortBy}`
      : `-${sortBy}`

  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by
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

export async function getCollectionBase(): Promise<
  CollectionBaseResponseDto[] | undefined
> {
  const [err, res] = await transformRequest<
    PaginationDto<CollectionBaseResponseDto>
  >({
    url: `/workplace/collection_base`,
    method: "get"
  });
  if (err) return undefined;
  return res.results;
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
    ownerType,
    vehicleType,
    vehicleName,
    vehiclePlate,
    maxWeight,
    isHasPermission
  } = vehicleInfo;
  const [error, res] = await transformRequest({
    url: "/vehicle",
    method: "post",
    data: {
      workplace___workplace_type: ownerType,
      workplace_id: ownerId,
      vehicle_type_id: vehicleType,
      name: vehicleName,
      plate_number: vehiclePlate,
      max_capacity: maxWeight,
      permission_flag: isHasPermission
    }
  });
  if (error) return undefined;
  return res;
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
    workplace___workplace_type,
    plate_number,
    permission_flag,
    max_capacity
  } = res;
  const detail = {
    ownerName: workplace___name,
    vehicleType: vehicle_type___name,
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
  vehicleInfo: Vehicle
): Promise<Vehicle | unknown> {
  const {
    vehicleType,
    vehicleName,
    vehiclePlate,
    maxWeight,
    id,
    isHasPermission
  } = vehicleInfo;
  const [error, res] = await transformRequest({
    url: `vehicle/${id}`,
    method: "put",
    params: {},
    data: {
      vehicle_type_id: vehicleType,
      name: vehicleName,
      plate_number: vehiclePlate,
      max_capacity: maxWeight,
      permission_flag: isHasPermission
    }
  });
  if (error) return undefined;
  return res;
}

export function getVehicleById(id: string): VehicleDetail | undefined {
  const vehicle = data.find((item) => item.key === id) || undefined;

  return vehicle;
}
