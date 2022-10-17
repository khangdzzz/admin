import { Pagination, ServiceResponse } from "@/modules/common/models";
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
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { makeUniqueName } from "@/utils/string.helper";
import { ResContainer } from "@/modules/container/models/container.model";
import { AxiosError } from "axios";
import { calculateSortQuery } from "@/modules/common/helpers";
interface sortContainerDto {
  sortType: Sort
  sortName: Sort
  sortWeight: Sort
  sortCapacity: Sort
}

const data: ContainerType[] = [];

export function getMockCollectionBase(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Collection Base 1" },
    { value: 2, label: "Collection Base 2" }
  ];
  return res;
}

export async function getListContainer(
  page: number,
  size: number,
  sort: sortContainerDto,
  searchKeyword: string | null | undefined = ""
): Promise<PaginationDto<ResContainer> | undefined> {
  const { sortType, sortName, sortWeight, sortCapacity } = sort

  const orderSortType = calculateSortQuery('container_type___name', sortType)
  const orderSortName = calculateSortQuery('name', sortName)
  const orderSortWeight = calculateSortQuery('weight', sortWeight)
  const orderSortCapacity = calculateSortQuery('capacity', sortCapacity)

  const order_by = [orderSortType, orderSortName, orderSortWeight, orderSortCapacity].filter((item) => !!item).toString()

  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
  };
  const [err, res] = await transformRequest<PaginationDto<ResContainer>>({
    url: "/container",
    method: "get",
    params
  });

  if (err) return undefined;
  res.current_page = page;
  res.page_size = size
  return res;
}

export function getContainerTypes(): ContainerType[] {
  const res: ContainerType[] = [];
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
      sort === Sort.None
        ? DEFAULT_SORT_ORDER
        : sort === Sort.Asc
          ? "name"
          : "-name"
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
): Promise<ServiceResponse<ContainerTypeModel>> {
  const [error, res] = await transformRequest<ServiceResponse<ContainerTypeModel>>({
    url: `/container_type/${id}`,
    method: "get"
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }
  return res;
}

export async function createContainerType(
  tenantId: number,
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[AxiosError<unknown, unknown>, null] | [null, ContainerTypeResponseDto] | any> {
  const data: CreateContainerTypeInputDto = {
    tenant_id: tenantId,
    name: makeUniqueName(name)
  };
  const [error, res] = await transformRequest<ContainerTypeResponseDto>({
    url: "/container_type",
    method: "post",
    data
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }
  const { id, name: typeName, tenant_id } = res;

  return Promise.resolve({
    res: {
      id,
      tenantId: tenant_id,
      name: typeName,
      key: 0
    }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[AxiosError<unknown, unknown>, null] | [null, ContainerTypeModel] | any> {
  const data = {
    tenant_id,
    name: makeUniqueName(name)
  };
  const [error, res] = await transformRequest<ContainerTypeModel>({
    url: `/container_type/${id}`,
    method: "put",
    data
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }
  return {
    res
  };
}

export async function deleteContainer(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/container`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
