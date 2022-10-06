import { Pagination } from "@/modules/common/models";
import { Staff } from "@/modules/staff-management/models";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { StaffTypeResponseDto } from "./dtos/staff-management/create-staff-type.dto";
import getListStaffResponse from "./mocks/staff/get-list-staff.response.json";
export async function getlistStaff(
  page: 1,
  size: 10
): Promise<Pagination<Staff> | undefined> {
  page;
  size;
  const res: PaginationDto<StaffTypeResponseDto> = getListStaffResponse;
  if (!res) return Promise.resolve(undefined);
  const {
    current_page: currentPage,
    page_size: pageSize,
    count: total,
    total_page: totalPage,
    results
  } = res;
  return {
    currentPage,
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
        collection_base
      } = staff;
      return {
        key: id,
        id,
        employeeCode: employee_code,
        email,
        name,
        userRole: user_role,
        tenant,
        collectionBase: collection_base
      };
    })
  };
}
