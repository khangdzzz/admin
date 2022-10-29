import { calculateSortQuery } from "@/modules/common/helpers";
import { Pagination } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { Staff } from "@/modules/staff-management/models";
import { transformRequest } from "./base.service";
import { DEFAULT_SORT_ORDER } from "./constants";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { StaffTypeResponseDto } from "./dtos/staff-management/create-staff-type.dto";
const UserRoleLabel = [
  "user_role_lbl_system_admin",
  "user_role_lbl_tenant_admin",
  "user_role_lbl_collection_base_admin",
  "user_role_lbl_discharger",
  "user_role_lbl_dashboard_user",
  "user_role_lbl_consignee",
  "user_role_lbl_driver",
  "user_role_lbl_manufacturing_staff",
  "user_role_lbl_driver_manufacturing_staff"
];

const WorkplaceLabel = [
  "workplace_lbl_any_company",
  "workplace_lbl_same_tenant_company",
  "workplace_lbl_partner",
  "workplace_lbl_customer",
  "workplace_lbl_destination"
];

interface sortStaffDto {
  sortEmployeeCode: Sort;
  sortStaffName: Sort;
  sortEmail: Sort;
  sortUserRole: Sort;
  sortWorkPlace: Sort;
  sortLastLoginTime: Sort;
}

export async function getlistStaff(
  page: number,
  size: number,
  sort: sortStaffDto,
  searchKeyword: string | null | undefined = ""
): Promise<Pagination<Staff> | undefined> {
  const {
    sortEmployeeCode,
    sortStaffName,
    sortEmail,
    sortUserRole,
    sortWorkPlace,
    sortLastLoginTime
  } = sort;

  const order_by: string | undefined = [
    calculateSortQuery("employee_code", sortEmployeeCode),
    calculateSortQuery("name", sortStaffName),
    calculateSortQuery("email", sortEmail),
    calculateSortQuery("user_role", sortUserRole),
    calculateSortQuery("belongs", sortWorkPlace),
    calculateSortQuery("last_logged_in", sortLastLoginTime)
  ]
    .filter((query) => query)
    .toString();

  const params = {
    page,
    page_size: size,
    __all__: searchKeyword ? `%${searchKeyword}%` : undefined,
    order_by: order_by?.length ? order_by : DEFAULT_SORT_ORDER
  };
  const [err, res] = await transformRequest<
    PaginationDto<StaffTypeResponseDto>
  >({
    url: "staff_management",
    method: "get",
    params
  });
  if (err || !res) return Promise.resolve(undefined);
  const {
    page_size: pageSize,
    count: total,
    total_page: totalPage,
    results
  } = res;
  return {
    currentPage: page,
    pageSize,
    total,
    totalPage,
    results: results.map((staff) => {
      const {
        id,
        employee_code,
        email,
        name,
        user_role,
        tenant,
        collection_base,
        belongs,
        last_logged_in,
        is_disable
      } = staff;
      return {
        key: id,
        id,
        employeeCode: employee_code,
        email,
        name,
        userRole: UserRoleLabel[user_role - 1],
        tenant,
        collectionBase: collection_base,
        workplace: WorkplaceLabel[belongs],
        lastLoggedIn: last_logged_in
          ? new Date(last_logged_in).toLocaleDateString()
          : undefined,
        isDisabled: is_disable
      };
    })
  };
}

export async function deleteStaffByIds(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/staff_management`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}

export async function changeUserActiveStatus(
  id: number,
  willBeDisabled: boolean
): Promise<boolean> {
  const [error] = await transformRequest({
    url: `/staff_management/${id}`,
    method: "put",
    data: {
      is_disable: willBeDisabled
    }
  });
  if (error) return false;
  return true;
}
