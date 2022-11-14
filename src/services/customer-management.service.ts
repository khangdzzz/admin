import { Pagination, ServiceResponse } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import {
  CustomerDetail,
  CustomerModel,
  EditCustomerDto
} from "@/modules/customer-management/models/customer.model";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { CustomerResponseDto } from "./dtos/customer-management/customer.dto";
import { toUrlEncodedString } from "./utils/search-query.helper";

export async function fetchListCustomer(
  page: number,
  size: number | string,
  sort: Sort = Sort.None,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CustomerModel> | undefined> {
  const params = {
    page,
    page_size: size,
    name__like: searchKeyword
      ? `%${toUrlEncodedString(searchKeyword)}%`
      : undefined,
    order_by:
      sort === Sort.None
        ? DEFAULT_SORT_ORDER
        : sort === Sort.Asc
        ? "name"
        : "-name"
  };

  const [error, res] = await transformRequest<
    PaginationDto<CustomerResponseDto>
  >({
    url: "/workplace/customer",
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
    results: results.map((customerDto, index) => {
      const {
        telephone: phoneNumber,
        postal_code: postalCode,
        mail: email,
        ...rest
      } = customerDto;
      return {
        ...rest,
        key: index,
        phoneNumber,
        postalCode,
        email
      };
    })
  };
}

export async function getCustomerById(
  id: number
): Promise<ServiceResponse<CustomerDetail>> {
  const [error, res] = await transformRequest<CustomerDetail>({
    url: `workplace/customer/${id}`,
    method: "get"
  });
  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }
  return { res };
}

export async function editCustomerById(
  id: number,
  data: EditCustomerDto
): Promise<ServiceResponse<EditCustomerDto>> {
  const [error, res] = await transformRequest<EditCustomerDto>({
    url: `workplace/customer/${id}`,
    method: "put",
    data
  });
  if (error || !res) {
    return {
      error: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details?.map((item) => item.loc[0])
    };
  }
  return { res };
}
