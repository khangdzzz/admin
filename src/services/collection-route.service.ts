import { calculateSortQuery } from "@/modules/common/helpers";
import {
  CollectionRoute,
  CreateCollectionRouteModel,
  CreateCollectionRouteResponseDto
} from "@/modules/collection-route-management/models/collection-route.model";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { transformRequest } from "./base.service";
import { DEFAULT_SORT_ORDER } from "./constants";
import { CollectionRouteResponseDTO } from "./dtos/collection-route/collection-route.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import getListCollectionRoute from "./mocks/collection-route/get-list-collection-route.response.json";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import { CollectionPointResponseDto } from "./dtos/collection-point/collection-point.dto";
import { AxiosError } from "axios";

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
    "",
    sortNavigationRouteId
  );

  const order_by = [
    orderSortName,
    orderSortWorkPlace,
    orderSortWNumberStore,
    orderSortLastUpdate
  ]
    .filter((item) => !!item)
    .toString();
  const params = {
    page,
    page_size: size,
    name__like: searchKeyword ? `%${searchKeyword}%` : undefined,
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
    results: results.map((item) => {
      const {
        id,
        updated_at,
        workplace___name,
        name,
        number_collect_points,
        navigation_id,
        notice
      } = item;
      return {
        key: id,
        id,
        lastUpdate: updated_at,
        workPlace: workplace___name,
        name,
        numberOfStore: number_collect_points,
        navigationId: navigation_id,
        notice
      };
    })
  };
}

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
    navigation_id,
    notice,
    collect_points
  } = res;

  return {
    key: id,
    id,
    lastUpdate: updated_at,
    workPlace: workplace___name,
    name,
    numberOfStore: number_collect_points,
    navigationId: navigation_id,
    notice,
    listCollectionPoint: collect_points
  };
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

export async function getCollectionPoint(): Promise<
  CollectionPointResponseDto[] | undefined
> {
  const [err, res] = await transformRequest<
    PaginationDto<CollectionPointResponseDto>
  >({
    url: `collect_point`,
    method: "get"
  });
  if (err) return undefined;
  return res.results;
}
export async function createCollectionRoute(
  data: CreateCollectionRouteModel
): Promise<
  | [AxiosError<unknown, unknown>, null]
  | [null, CreateCollectionRouteResponseDto]
  | any
> {
  const [error, res] = await transformRequest<CreateCollectionRouteResponseDto>(
    {
      url: "/collect_order",
      method: "POST",
      data
    }
  );
  if (error || !res) {
    false;
  }
  return {
    res
  };
}
