import { transformRequest } from "./base.service";
import { CustomerModel } from "@/modules/customer-management/models";
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
