import { calculateSortQuery } from "@/modules/common/helpers";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import {
  CollectionBase,
  CreateCollectionBaseDto,
  EditCollectionBaseDto
} from "@/modules/staff-management/models/collection-base.model";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { makeUniqueName } from "@/utils/string.helper";
import { AxiosError } from "axios";
import { transformRequest } from "./base.service";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { toUrlEncodedString } from "./utils/search-query.helper";

interface SortCollectionBaseDto {
  sortName: Sort;
  sortPostalCode: Sort;
  sortAddress: Sort;
  sortTelephone: Sort;
}

export async function getListCollectionBase(
  page: number,
  size: number | string,
  sort: SortCollectionBaseDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CollectionBase> | undefined> {
  const { sortName, sortPostalCode, sortAddress, sortTelephone } = sort;

  const orderSortName = calculateSortQuery("name", sortName);
  const orderSortAddress = calculateSortQuery("address", sortAddress);
  const orderSortWPostalCode = calculateSortQuery(
    "postal_code",
    sortPostalCode
  );
  const orderSortPhone = calculateSortQuery("telephone", sortTelephone);

  const order_by = [
    orderSortName,
    orderSortAddress,
    orderSortWPostalCode,
    orderSortPhone
  ]
    .filter((item) => !!item)
    .toString();

  const params = {
    page,
    page_size: size,
    __all__: searchKeyword ? `${toUrlEncodedString(searchKeyword)}` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
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
  collectionBase: CreateCollectionBaseDto
): Promise<
  // Todo: Need to fix this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const data = {
    name: makeUniqueName(name),
    address: makeUniqueName(address),
    latitude,
    longitude,
    short_name: makeUniqueName(shortName),
    name_kana: makeUniqueName(kana),
    base_type: collectionBaseType,
    postal_code: makeUniqueName(postalCode),
    mail: makeUniqueName(email),
    representative: makeUniqueName(representative),
    telephone: makeUniqueName(telephone)
  };

  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: "/workplace/collection_base",
    method: "post",
    data
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details?.map((item) => item.loc[0])
    };
  }
  return {
    res
  };
}

export async function editCollectionBase(
  collectionBase: EditCollectionBaseDto
): Promise<
  // Todo: need to fix this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const data = {
    name: makeUniqueName(name),
    address: makeUniqueName(address),
    latitude,
    longitude,
    short_name: makeUniqueName(shortName),
    name_kana: makeUniqueName(kana),
    base_type: collectionBaseType,
    postal_code: makeUniqueName(postalCode),
    mail: makeUniqueName(email),
    representative: makeUniqueName(representative),
    telephone: makeUniqueName(telephone)
  };

  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: `/workplace/collection_base/${id}`,
    method: "put",
    data
  });

  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details?.map((item) => item.loc[0])
    };
  }
  return {
    res
  };
}
