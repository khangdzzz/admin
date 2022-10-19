import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import { transformRequest } from "./base.service";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
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
    url: `/workplace/collection_base`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
export const getCollectionBaseById = async (
  collectionBaseId: number
): Promise<CollectionBase | undefined> => {
  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: `/workplace/collection_base/${collectionBaseId}`
  });

  if (error || !res) return undefined;

  const {
    id,
    name,
    name_kana: kana,
    latitude,
    longitude,
    short_name: shortName,
    address,
    mail,
    postal_code: postalCode,
    telephone,
    representative,
    base_type: collectionBaseType
  } = res;

  return {
    id,
    collectionBaseType: collectionBaseType,
    kana,
    latitude,
    longitude,
    name,
    representative,
    shortName,
    address,
    email: mail,
    key: 0,
    postalCode,
    telephone
  };
};

export async function createCollectionBase(
  collectionBase: CollectionBase
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, CollectionBaseResponseDto] | any
> {
  const {
    name,
    address,
    latitude,
    longitude,
    shortName,
    kana,
    collectionBaseType,
    postalCode,
    email,
    representative,
    telephone
  } = collectionBase;

  const data: CollectionBaseResponseDto = {
    name,
    address,
    latitude,
    longitude,
    short_name: shortName,
    name_kana: kana,
    base_type: collectionBaseType,
    postal_code: postalCode,
    mail: email || null,
    representative,
    telephone: telephone || null
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

export async function editCollectionBase(
  collectionBase: CollectionBase
): Promise<
  [AxiosError<unknown, unknown>, null] | [null, CollectionBaseResponseDto] | any
> {
  const {
    id,
    name,
    address,
    latitude,
    longitude,
    shortName,
    kana,
    collectionBaseType,
    postalCode,
    email,
    representative,
    telephone
  } = collectionBase;

  const data: CollectionBaseResponseDto = {
    id,
    name,
    address,
    latitude,
    longitude,
    short_name: shortName,
    name_kana: kana,
    base_type: collectionBaseType,
    postal_code: postalCode,
    mail: email || null,
    representative,
    telephone: telephone || null
  };

  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: `/workplace/collection_base/${id}`,
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
