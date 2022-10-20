import { transformRequest } from "./base.service";
import {
  CustomerModel,
  Customer
} from "@/modules/customer-management/models/customer.model";
import { ServiceResponse } from "@/modules/common/models";
export async function deleteCustomerById(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest<CustomerModel>({
    url: `/customer`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function createCustomer(
  data: Customer
): Promise<ServiceResponse<Customer>> {
  const [err, res] = await transformRequest<Customer>({
    url: "/workplace/customer",
    method: "post",
    data
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
