// import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import { transformRequest } from "./base.service";
import { CollectionPoint } from "./dtos/collection-point/collection-point.dto";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { CollectionPointModel } from "@/modules/collection-point-management/models/collection-point.model";
import { CollectionPointResponseDto } from "./dtos/collection-point/collection-point.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { calculateSortQuery } from "@/modules/common/helpers";

interface SortCollectionPointDto {
  sortName: Sort;
  sortPostalCode: Sort;
  sortAddress: Sort;
  sortPhoneNumber: Sort;
  sortCustomer: Sort;
}

export async function getListCollectionPoint(
  page: number,
  size: number | string,
  sort: SortCollectionPointDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CollectionPointModel> | undefined> {
  const {
    sortName,
    sortPostalCode,
    sortAddress,
    sortPhoneNumber,
    sortCustomer
  } = sort;

  const orderSortName = calculateSortQuery("name", sortName);
  const orderSortAddress = calculateSortQuery("address", sortAddress);
  const orderSortWPostalCode = calculateSortQuery("postcode", sortPostalCode);
  const orderSortPhoneNumber = calculateSortQuery("telephone", sortPhoneNumber);
  const orderSortCustomer = calculateSortQuery("customer___name", sortCustomer);

  const order_by = [
    orderSortName,
    orderSortAddress,
    orderSortWPostalCode,
    orderSortPhoneNumber,
    orderSortCustomer
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
    PaginationDto<CollectionPointResponseDto>
  >({
    url: "/collect_point",
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
    results: results.map((collectionPointDto, index) => {
      const {
        postcode: postalCode,
        telephone: phoneNumber,
        workplace___name: customer,
        ...rest
      } = collectionPointDto;
      return {
        ...rest,
        key: index,
        postalCode,
        phoneNumber,
        customer
      };
    })
  };
}
export async function deleteCollectionPointById(
  ids: number[]
): Promise<boolean> {
  const [error] = await transformRequest<CollectionPointModel>({
    url: `/collect_point`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
export async function deleteCollectionBaseById(
  ids: number[]
): Promise<boolean> {
  const [error] = await transformRequest<CollectionPoint>({
    url: `/collect_point`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export const getCollectionPointById = async (
  collectionBaseId: number
): Promise<CollectionPoint | undefined> => {
  const [error, res] = await transformRequest<CollectionPoint>({
    url: `/collect_point/${collectionBaseId}`
  });
  if (error || !res) return undefined;
  return res;
};
