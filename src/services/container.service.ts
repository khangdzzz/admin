import { Pagination } from "@/modules/common/models";
import {
  Container,
  ContainerSelection,
  ContainerType
} from "@/modules/container/models";
import ContainerTypeModel from "@/modules/container/models/container-type.models";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { CreateContainerTypeInputDto } from "./dtos/container-management/create-container-type.dto";
import { ContainerTypeResponseDto } from "./dtos/container/create-container-type.dto";
import { VehicleTypeResponseDto } from "./dtos/vehicle-management/create-vehicle-type.dto";
import createContainerTypeResponse from "./mocks/container-type/create-container-type.response.json";
import getListContainerTypeResponse from "./mocks/container-type/get-list-container-type.response.json"
import getListContainerResponse from "./mocks/container/get-list-container.reponse.json";

const data: ContainerType[] = [
  {
    name: "Basket trolley",
    weight: 4,
    capaity: "100ml",
    key: "1",
    type: "Container Type 1"
  },
  {
    name: "Folding Container",
    weight: 5,
    capaity: "100ml",
    key: "2",
    type: "Container Type 2"
  },
  {
    name: "Cardboard",
    weight: 6,
    capaity: "100ml",
    key: "3",
    type: "Container Type 3"
  }
];
export function getMockCollectionBase(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Collection Base 1" },
    { value: 2, label: "Collection Base 2" }
  ];
  return res;
}

export async function getListContainer(
  page: 1,
  size: 10
): Promise<Pagination<ContainerType> | undefined> {
  page;
  size;
  const res: PaginationDto<ContainerTypeResponseDto> = getListContainerResponse;
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
        key: id,
        id,
        name,
        tenantId
      };
    })
  };
}

export async function getListContainerType(
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
  const res: PaginationDto<VehicleTypeResponseDto> = getListContainerTypeResponse;
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

export function getContainerTypeById(
  id: string
): Promise<VehicleTypeResponseDto> {
  const containerType: VehicleTypeResponseDto = createContainerTypeResponse;
  if (!containerType) throw new Error("id does not exit");
  return Promise.resolve(containerType);
}
export function getMockPartner(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Partner 1" },
    { value: 2, label: "Partner 2" }
  ];
  return res;
}

export function getContainerTypes(): ContainerType[] {
  const res: ContainerType[] = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      id: `v${i}`,
      key: i,
      name: `Container Type ${i}`
    });
  }
  return res;
}

export async function updateContainer(
  containerInfo: Container
): Promise<Container | unknown> {
  const { id, containerType, containerName } = containerInfo;
  const [error, res] = await transformRequest({
    url: `update-container/${id}`,
    method: "patch",
    params: {},
    data: { id, containerType, containerName }
  });
  if (error) return undefined;
  return res;
}

export function getContainerById(id: string): ContainerType | undefined {
  const container = data.find((item) => item.key === id) || undefined;
  return container;
}

export function createContainerType(
  tenantId: number,
  name: string
): Promise<ContainerTypeModel | undefined> {
  const data: CreateContainerTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  data;
  const res: VehicleTypeResponseDto = createContainerTypeResponse;
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    id,
    tenantId: tenant_id,
    name: typeName,
    key: 0
  });
}

export async function updateContainerType(
  tenantId: number,
  name: string
): Promise<ContainerTypeModel | undefined> {
  const data: CreateContainerTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  data;
  const res: VehicleTypeResponseDto = createContainerTypeResponse;
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    id,
    tenantId: tenant_id,
    name: typeName,
    key: 0
  });
}
