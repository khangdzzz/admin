import {
  CustomerModel,
  Customer
} from "@/modules/customer-management/models/customer.model";
import { Pagination, ServiceResponse } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { CustomerResponseDto } from "./dtos/customer-management/customer.dto";
import { DEFAULT_SORT_ORDER } from "@/services/constants";
import { calculateSortQuery } from "@/modules/common/helpers";
import { CreateCustomerDto } from "./dtos/customer-management/create-customer.dto";
import { NULL_VALUE_DISPLAY } from "@/utils/constants";

// import { makeUniqueName } from "@/utils/string.helper";
interface sortCustomerDto {
  sortName: Sort;
  sortAddress: Sort;
  sortPostalCode: Sort;
  sortPhoneNumber: Sort;
  sortEmail: Sort;
}
// sortName: Sort; sortAddress: Sort; sortPostalCode: Sort; sortPhoneNumber: Sort; sortEmail: Sort;
export async function fetchListCustomer(
  page: number,
  size: number | string,
  sort: sortCustomerDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<CustomerModel> | undefined> {
  const { sortName, sortAddress, sortPostalCode, sortPhoneNumber, sortEmail } =
    sort;

  const orderSortName = calculateSortQuery("name", sortName);
  const orderSortAddress = calculateSortQuery("address", sortAddress);
  const orderSortPostalCode = calculateSortQuery("postal_code", sortPostalCode);
  const orderSortPhoneNumber = calculateSortQuery("telephone", sortPhoneNumber);
  const orderSortEmail = calculateSortQuery("mail", sortEmail);

  const order_by = [
    orderSortName,
    orderSortAddress,
    orderSortPostalCode,
    orderSortPhoneNumber,
    orderSortEmail
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
    PaginationDto<CustomerResponseDto>
  >({
    url: "/workplace/customer",
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
    results: results.map((customerDto, index) => {
      const {
        telephone,
        postal_code,
        mail: email,
        address,
        external_code,
        ...rest
      } = customerDto;
      return {
        ...rest,
        key: index,
        phoneNumber: telephone || NULL_VALUE_DISPLAY,
        postalCode: postal_code || NULL_VALUE_DISPLAY,
        email: email || NULL_VALUE_DISPLAY,
        address: address || NULL_VALUE_DISPLAY,
        externalCode: external_code || NULL_VALUE_DISPLAY
      };
    })
  };
}

export async function deleteCustomerById(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest<CustomerModel>({
    url: `/workplace/customer`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function createCustomer(
  data: CreateCustomerDto
): Promise<ServiceResponse<Customer>> {
  const [err, res] = await transformRequest<Customer>({
    url: "/workplace/customer",
    method: "post",
    data
  });

  if (!res && err) {
    return {
      error: (err?.response?.data as { details: { msg: string, loc: string[] }[] })
        .details[0].msg,
      errorParams: (err?.response?.data as { details: { msg: string, loc: string[] }[] })
        .details[0].loc
    };
  }

  return {
    res
  };
}

export async function getCustomerDetail(
  id: number
): Promise<ServiceResponse<Customer>> {
  const [err, res] = await transformRequest<Customer>({
    url: `/workplace/customer/${id}`,
    method: "get"
  });

  if (!res && err) {
    return {
      error: (err?.response?.data as { details: { msg: string }[] }).details[0]
        .msg
    };
  }

  return {
    res
  };
}
