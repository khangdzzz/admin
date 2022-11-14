import { CollectionItem } from "@/modules/collection-item-management/models/collection-item.model";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { calculateSortQuery } from "@/utils/rest-client.helper";
import { transformRequest } from "./base.service";
import { DEFAULT_SORT_ORDER } from "./constants";
import { CollectionItemResponseDTO } from "./dtos/collection-item/collection-item.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { toUrlEncodedString } from "./utils/search-query.helper";

interface sortColletionItemDto {
  name: Sort;
  collect_item_category___name: Sort;
  external_code: Sort;
  updated_at: Sort;
}

export async function getListCollectionItems(
	page: number,
	size: number | string,
	sort: sortColletionItemDto,
	searchKeyword: string | null | undefined = ""
): Promise<Pagination<CollectionItem> | undefined > {

  const order_by = Object.keys(sort)
    .map((k) => calculateSortQuery(k, sort[k]))
    .filter((item) => !!item)
    .toString();

	const params = {
		page,
		page_size: size,
		__all__: searchKeyword ? `${toUrlEncodedString(searchKeyword)}` : undefined,
		order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
	};

	const [error, res] = await transformRequest<
		PaginationDto<CollectionItemResponseDTO>
	>({
		url: "/collect_item",
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
    results: results.map((collectionItemDto, index) => {
      const {
        ...rest
      } = collectionItemDto;
      return {
        ...rest,
        key: index
      };
    })
  };
}

export async function deleteCollectionItem(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/collect_item`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}