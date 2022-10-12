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

interface sortVehicleDto {
  sortType: Sort
  sortName: Sort
  sortPlateNumber: Sort
  sortWorkPlace: Sort
  sortCapacity: Sort
  sortPermission: Sort
}

const data: VehicleDetail[] = [];

export async function getListVehicle(
  page: number,
  size: number,
  sort: sortVehicleDto,
  searchKeyword: string | null | undefined = ""
): Promise<PaginationDto<ResVehicle> | undefined> {

  const { sortType, sortName, sortPlateNumber, sortWorkPlace, sortCapacity, sortPermission } = sort

  const orderSortType = sortType === Sort.None ? undefined : sortType === Sort.Asc ? 'vehicle_type' : `-vehicle_type`
  const orderSortName = sortName === Sort.None ? undefined : sortName === Sort.Asc ? 'name' : `-name`
  const orderSortPlateNumber = sortPlateNumber === Sort.None ? undefined : sortPlateNumber === Sort.Asc ? 'plate_number' : `-plate_number`
  const orderSortWorkPlace = sortWorkPlace === Sort.None ? undefined : sortWorkPlace === Sort.Asc ? 'workplace___name' : `-workplace___name`
  const orderSortCapacity = sortCapacity === Sort.None ? undefined : sortCapacity === Sort.Asc ? 'max_capacity' : `-max_capacity`
  const orderSortPermission = sortPermission === Sort.None ? undefined : sortPermission === Sort.Asc ? 'permission_flag' : `-permission_flag`
  
  const order_by = [orderSortType, orderSortName, orderSortPlateNumber, orderSortWorkPlace, orderSortCapacity, orderSortPermission].filter((item) => !!item).toString()

  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER

  };
  const [err, res] = await transformRequest<PaginationDto<ResVehicle>>({
    url: "/vehicle",
    method: "get",
    params
  });
  if (err) return undefined;
  res.current_page = page;
  res.page_size = size
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
