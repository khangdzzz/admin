import { CollectionHistoryModel } from "@/modules/collection-history/models/collection-history.model";
import { Pagination } from "@/modules/common/models";
import { NULL_VALUE_DISPLAY } from "@/modules/common/constants/table.constant";
import { transformRequest } from "./base.service";
import { CollectionHistoryResponseDto } from "./dtos/collection-history/collection-history.dto";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { toUrlEncodedString } from "./utils/search-query.helper";

export interface SummaryPagination<T> extends Pagination<T> {
  sumApportionment?: number;
  sumWeight?: number;
  sumQuantity?: number;
  sumPackageWeight?: number;
}

export async function getListCollectionHistory(
  page: number | undefined,
  size: number | string | undefined,
  searchKeyword: string | null | undefined = ""
): Promise<SummaryPagination<CollectionHistoryModel> | undefined> {
  const params = {
    page,
    page_size: size,
    __all__: searchKeyword ? `${toUrlEncodedString(searchKeyword)}` : undefined,
    order_by: "-id"
  };

  const [error, res] = await transformRequest<
    PaginationDto<CollectionHistoryResponseDto>
  >({
    url: "collect_history",
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

  let sumApportionment = 0;
  let sumWeight = 0;
  let sumQuantity = 0;
  let sumPackageWeight = 0;
  return {
    currentPage,
    pageSize,
    total,
    totalPage,
    results: results.map((item) => {
      const {
        id,
        collect_date,
        user___name,
        is_confirm,
        collect_point_id,
        collect_point___short_name,
        vehicle___name,
        customer___name,
        weight,
        packing_weight,
        quantity,
        unit,
        tenant_id,
        temp_quantity,
        unit_price,
        measure_method,
        remarks,
        buy_sell_flag,
        transportation_price,
        disposal_price,
        commission_price,
        other_price,
        collect_item_unit___alias_name,
        collect_item_unit___short_alias_name
      } = item;
      sumApportionment += temp_quantity;
      sumWeight += weight;
      sumQuantity += quantity;
      sumPackageWeight += packing_weight;
      return {
        id,
        userName: user___name || NULL_VALUE_DISPLAY,
        tenantId: tenant_id,
        collectDate: collect_date || NULL_VALUE_DISPLAY,
        collectPointId: collect_point_id || NULL_VALUE_DISPLAY,
        collectPointShortName: collect_point___short_name || NULL_VALUE_DISPLAY,
        vehicleName: vehicle___name || NULL_VALUE_DISPLAY,
        collectItemName: collect_item_unit___alias_name || NULL_VALUE_DISPLAY,
        customerName: customer___name || NULL_VALUE_DISPLAY,
        weight,
        isConfirm: is_confirm,
        packingWeight: packing_weight,
        quantity: quantity,
        unit: unit || "",
        key: 0,
        apportionment: temp_quantity,
        price: unit_price,
        measureMethod: measure_method === 1 ? "Weight" : "Quantity",
        remarks,
        buyOrSell: buy_sell_flag,
        transportationPrice: transportation_price,
        disposalPrice: disposal_price,
        commissionPrice: commission_price,
        otherPrice: other_price,
        collectItemShortAliasName: collect_item_unit___short_alias_name
      };
    }),
    sumApportionment,
    sumWeight,
    sumQuantity,
    sumPackageWeight
  };
}
