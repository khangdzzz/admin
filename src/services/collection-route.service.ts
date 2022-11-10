/* eslint-disable no-useless-escape */
import {
  CollectionRoute,
  CreateCollectionRouteModel,
  CreateCollectionRouteResponseDto
} from "@/modules/collection-route-management/models/collection-route.model";
import { calculateSortQuery } from "@/modules/common/helpers";
import { Pagination, ServiceResponse } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { AxiosError } from "axios";
import { transformRequest } from "./base.service";
import { DEFAULT_SORT_ORDER } from "./constants";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import { CollectionPointResponseDto } from "./dtos/collection-point/collection-point.dto";
import { CollectionRouteResponseDTO } from "./dtos/collection-route/collection-route.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { TypeWorkPlace } from "@/modules/staff-management/models/create-new-staff.model";

interface SortCollectionRouteDto {
  sortName: Sort;
  sortWorkPlace: Sort;
  sortNumberStore: Sort;
  sortLastUpdate: Sort;
  sortNavigationRouteId: Sort;
}
export async function getListCollectionRoutes(
  page: number,
  size: number | string,
  sort: SortCollectionRouteDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CollectionRoute> | undefined> {
  const {
    sortName,
    sortWorkPlace,
    sortNumberStore,
    sortLastUpdate,
    sortNavigationRouteId
  } = sort;
  const orderSortName = calculateSortQuery("name", sortName);
  const orderSortWorkPlace = calculateSortQuery(
    "workplace___name",
    sortWorkPlace
  );
  const orderSortWNumberStore = calculateSortQuery(
    "number_collect_points",
    sortNumberStore
  );
  const orderSortLastUpdate = calculateSortQuery("updated_at", sortLastUpdate);
  const orderSortNavigationRouteId = calculateSortQuery(
    "collect_route___id",
    sortNavigationRouteId
  );

  const order_by = [
    orderSortName,
    orderSortWorkPlace,
    orderSortWNumberStore,
    orderSortLastUpdate,
    orderSortNavigationRouteId
  ]
    .filter((item) => !!item)
    .toString();

  const params = {
    page,
    page_size: size,
    __all__: searchKeyword ? `%${encode(searchKeyword)}%` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
  };
  const [error, res] = await transformRequest<
    PaginationDto<CollectionRouteResponseDTO>
  >({
    url: "/collect_order",
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
    results: results.map((item) => {
      const {
        id,
        updated_at,
        workplace___name,
        name,
        number_collect_points,
        collect_route___id,
        notice
      } = item;
      return {
        key: id,
        id,
        lastUpdate: updated_at,
        workPlace: workplace___name,
        name,
        numberOfStore: number_collect_points,
        navigationId: collect_route___id,
        notice
      };
    })
  };
}

const encode = (str: string): string => {
  return encodeURIComponent(str)
    .replace(/\-/g, "%2D")
    .replace(/\_/g, "%5F")
    .replace(/\./g, "%2E")
    .replace(/\!/g, "%21")
    .replace(/\~/g, "%7E")
    .replace(/\*/g, "%2A")
    .replace(/\'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
};

export async function deleteCollectionRoute(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/collect_order`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function getCollectionRouteById(
  collectionId: number
): Promise<CollectionRoute | undefined> {
  const [error, res] = await transformRequest<CollectionRouteResponseDTO>({
    url: `/collect_order/${collectionId}`,
    method: "get"
  });
  if (error || !res) return undefined;

  const {
    id,
    updated_at,
    workplace___name,
    name,
    number_collect_points,
    collect_route___id,
    notice,
    collect_points,
    workplace_id
  } = res;

  return {
    key: id,
    id,
    lastUpdate: updated_at,
    workPlace: workplace___name,
    name,
    numberOfStore: number_collect_points,
    navigationId: collect_route___id,
    notice,
    listCollectionPoint: collect_points,
    workplaceId: workplace_id
  };
}
export async function getWorkplace(
  workplaceTypes: number[]
): Promise<CollectionBaseResponseDto[] | undefined> {
  const [err, res] = await transformRequest<CollectionBaseResponseDto[]>({
    url: "/workplace/options",
    method: "get",
    params: {
      workplace_type__in: workplaceTypes.join(","),
      page_size: "full"
    }
  });
  if (err) return undefined;
  return res;
}

export async function getCollectionPoint(): Promise<
  CollectionPointResponseDto[] | undefined
> {
  const [err, res] = await transformRequest<CollectionPointResponseDto[]>({
    url: `/collect_point`,
    method: "get",
    params: {
      page_size: "full",
      customer___workplace_type: TypeWorkPlace.CUSTOMER
    }
  });
  if (err) return undefined;
  return res;
}
export async function createCollectionRoute(
  data: CreateCollectionRouteModel
): Promise<ServiceResponse<boolean>> {
  const [error, res] = await transformRequest<CreateCollectionRouteResponseDto>(
    {
      url: "/collect_order",
      method: "POST",
      data
    }
  );
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
    res: true
  };
}

export async function editCollectionRoute(
  id: number,
  data: CreateCollectionRouteModel
): Promise<
  | [AxiosError<unknown, unknown>, null]
  | [null, CreateCollectionRouteResponseDto]
  //Todo: Teddy need to fix this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any
> {
  const [error, res] = await transformRequest<CreateCollectionRouteResponseDto>(
    {
      url: `/collect_order/${id}`,
      method: "PUT",
      data
    }
  );
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
