import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
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
    count: total,
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

export async function getListContainerType(
  page: number,
  size: number,
  sort: Sort = Sort.None,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<ContainerTypeModel> | undefined> {
  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by:
      sort === Sort.None ? undefined : sort === Sort.Asc ? "name" : "-name"
  };

  const [error, res] = await transformRequest<
    PaginationDto<ContainerTypeResponseDto>
  >({
    url: "/container_type",
    method: "get",
    params
  });
  if (error || !res) return undefined;

  if (!res) return Promise.resolve(undefined);

  const {
    results,
    current_page: currentPage = page,
    page_size: pageSize = size,
    count: total = 0,
    total_page: totalPage = 1
  } = res;

  return {
    currentPage,
    pageSize,
    total,
    totalPage,
    results: results.map((containerType) => {
      const { id, name, tenant_id: tenantId } = containerType;
      return {
        id,
        name,
        tenantId,
        key: 0
      };
    })
  };
}

export async function getContainerTypeById(
  id: string | string[]
): Promise<ContainerTypeModel | undefined> {
  const [error, res] = await transformRequest<ContainerTypeModel>({
    url: `/container_type/${id}`,
    method: "get"
  });
  if (error) return undefined;
  return res;
}

export async function createContainerType(
  tenantId: number,
  name: string
): Promise<ContainerTypeModel | undefined> {
  const data: CreateContainerTypeInputDto = {
    tenant_id: tenantId,
    name
  };
  const [error, res] = await transformRequest<ContainerTypeResponseDto>({
    url: "/container_type",
    method: "post",
    data
  });
  if (error || !res) return undefined;
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    id,
    tenantId: tenant_id,
    name: typeName,
    key: 0
  });
}

export async function deleteContainerTypeById(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest<ContainerTypeModel>({
    url: `/container_type`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function editContainerTypeById(
  id: string | string[],
  tenant_id: number | string | undefined,
  name: string
): Promise<ContainerTypeModel | undefined> {
  const data = {
    tenant_id,
    name
  };
  const [error, res] = await transformRequest<ContainerTypeModel>({
    url: `/container_type/${id}`,
    method: "put",
    data
  });
  if (error) return undefined;
  return res;
}
