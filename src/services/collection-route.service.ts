import { CollectionRoute } from "@/modules/collection-route-order/models/collection-route.model";
import { Pagination } from "@/modules/common/models";
import { transformRequest } from "./base.service";
import { CollectionRouteResponseDTO } from "./dtos/collection-route/collection-route.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import getListCollectionRoute from "./mocks/collection-route/get-list-collection-route.response.json";

export async function getListCollectionRoutes(): Promise<
  Pagination<CollectionRoute> | undefined
> {
  const res: PaginationDto<CollectionRouteResponseDTO> = getListCollectionRoute;
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
        workplace,
        name,
        number_of_stores,
        navigation_id
      } = item;
      return {
        key: id,
        id,
        lastUpdate: updated_at,
        workPlace: workplace,
        name,
        numberOfStore: number_of_stores,
        navigationId: navigation_id
      };
    })
  };
}

export async function deleteCollectionRoute(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
