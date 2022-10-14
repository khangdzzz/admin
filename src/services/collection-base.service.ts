import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import { transformRequest } from "./base.service";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import collectionBaseDetail from "./mocks/collection-base/collection-base-detail.response.json";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { AxiosError } from "axios";

export async function getListCollectionBase(
  page: number,
  size: number | string,
  sort: Sort = Sort.None,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CollectionBase> | undefined> {
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
    PaginationDto<CollectionBaseResponseDto>
  >({
    url: "/workplace/collection_base",
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
    results: results.map((collectionBaseDto, index) => {
      const {
        short_name: shortName,
        name_kana: kana,
        base_type: collectionBaseType,
        postal_code: postalCode,
        mail: email,
        ...rest
      } = collectionBaseDto;
      return {
        ...rest,
        key: index,
        shortName,
        kana,
        collectionBaseType,
        postalCode,
        email
      };
    })
  };
}

export async function deleteCollectionBaseById(
  ids: number[]
): Promise<boolean> {
  const [error] = await transformRequest<CollectionBase>({
    url: ` /workplace/collection_base`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
export function getMockCollectionBaseById(id: string | string[]): any {
  id;
  const res = {
    key: collectionBaseDetail.id,
    id: collectionBaseDetail.id,
    name: collectionBaseDetail.name,
    shortName: collectionBaseDetail.short_name,
    kana: collectionBaseDetail.name_kana,
    postalCode: collectionBaseDetail.postal_code,
    email: collectionBaseDetail.mail,
    representative: collectionBaseDetail.representative,
    latitude: collectionBaseDetail.latitude,
    longitude: collectionBaseDetail.longitude,
    address: collectionBaseDetail.address,
    telephone: collectionBaseDetail.telephone
  };
  return res;
}
export async function createCollectionBase(
  collectionBase: CollectionBase
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, CollectionBaseResponseDto] | any
> {
  const data: CollectionBaseResponseDto = {
    ...collectionBase,
    short_name: collectionBase.shortName,
    name_kana: collectionBase.kana,
    base_type: collectionBase.collectionBaseType,
    postal_code: collectionBase.postalCode,
    mail: collectionBase.email
  };
  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: "/workplace/collection_base",
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
