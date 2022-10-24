/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateSortQuery } from "@/modules/common/helpers";
import { Pagination, ServiceResponse } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { ContainerSelection, ContainerType } from "@/modules/container/models";
import ContainerTypeModel from "@/modules/container/models/container-type.models";
import {
  Container,
  EditContainerDto
} from "@/modules/container/models/container.model";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { makeUniqueName } from "@/utils/string.helper";

import { AxiosError } from "axios";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { CreateContainerTypeInputDto } from "./dtos/container-management/create-container-type.dto";
import { ContainerTypeResponseDto } from "./dtos/container/create-container-type.dto";

import { ContainerResponseDTO } from "@/services/dtos/container/container.dto";

interface sortContainerDto {
  sortType: Sort;
  sortName: Sort;
  sortWeight: Sort;
  sortCapacity: Sort;
}

export function getMockCollectionBase(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Collection Base 1" },
    { value: 2, label: "Collection Base 2" }
  ];
  return res;
}

export async function getListContainer(
  page?: number,
  size?: number,
  sort?: sortContainerDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<Container> | undefined> {
  let params: {
    page: number | undefined;
    page_size: number | undefined;
    name__like: string | undefined;
    order_by?: string | undefined;
  } = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined
  };
  if (sort) {
    const { sortType, sortName, sortWeight, sortCapacity } = sort;
    const orderSortType = calculateSortQuery("container_type___name", sortType);
    const orderSortName = calculateSortQuery("name", sortName);
    const orderSortWeight = calculateSortQuery("weight", sortWeight);
    const orderSortCapacity = calculateSortQuery("capacity", sortCapacity);
    const order_by = [
      orderSortType,
      orderSortName,
      orderSortWeight,
      orderSortCapacity
    ]
      .filter((item) => !!item)
      .toString();
    params = {
      ...params,
      order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
    };
  }

  const [err, res] = await transformRequest<
    PaginationDto<ContainerResponseDTO>
  >({
    url: "/container",
    method: "get",
    params
  });

  if (err) return undefined;
  const { current_page = 1, page_size = 20 } = res;
  return {
    currentPage: current_page,
    pageSize: page_size,
    results: res.results.map((result) => {
      const {
        container_type___name: containerType,
        capacity,
        name: containerName,
        id,
        weight
      } = result;
      return {
        containerName,
        containerType,
        capacity,
        id,
        key: id,
        weight,
        containerTypeId: 0
      };
    })
  };
}

export function getContainerTypes(): ContainerType[] {
  const res: ContainerType[] = [];
  return res;
}

export async function getContainerById(
  id: number
): Promise<Container | undefined> {
  const [err, res] = await transformRequest<ContainerResponseDTO>({
    url: `container/${id}`,
    method: "get"
  });
  if (err) return undefined;
  const {
    container_type___name: containerType,
    container_type_id: containerTypeId,
    capacity,
    name: containerName,
    weight
  } = res;
  return {
    containerName,
    containerType,
    containerTypeId,
    capacity,
    id,
    key: id,
    weight
  };
}

export async function editContainer(
  containerInfo: EditContainerDto
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, ContainerTypeModel] | any
> {
  const { id } = containerInfo;
  const [error, res] = await transformRequest<ContainerResponseDTO>({
    url: `container/${id}`,
    method: "put",
    data: { ...containerInfo, id }
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }
  return res;
}

export async function getListContainerType(
  page?: number,
  size?: number | string,
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

  if (size === "full" && Array.isArray(res)) {
    return {
      currentPage: 1,
      pageSize: "full",
      total: 1,
      totalPage: 1,
      results: res
    };
  }

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
  const [error, res] = await transformRequest<ContainerTypeModel>({
    url: `/container_type/${id}`,
    method: "get"
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

export async function createContainerType(
  tenantId: number,
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, ContainerTypeResponseDto] | any
> {
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

export async function createContainer(
  name: string,
  container_type_id: number,
  extension_code: string,
  tag_id: string,
  weight: number,
  capacity: number | null
): Promise<ServiceResponse<ContainerResponseDTO>> {
  const data = {
    name,
    container_type_id,
    extension_code,
    tag_id,
    weight,
    capacity
  };

  const [error, res] = await transformRequest<ContainerResponseDTO>({
    url: "container",
    method: "post",
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
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, ContainerTypeModel] | any
> {
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
