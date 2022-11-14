import { Pagination, ServiceResponse } from "@/modules/common/models";
import { Sort } from "@/modules/common/models/sort.enum";
import { Staff } from "@/modules/staff-management/models";
import {
  StaffDto,
  workPlace,
  workPlaceDTO
} from "@/modules/staff-management/models/staff.model";
import { calculateSortQuery } from "@/utils/rest-client.helper";
import { format } from "date-fns";
import { transformRequest } from "./base.service";
import { DEFAULT_SORT_ORDER } from "./constants";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { StaffTypeResponseDto } from "./dtos/staff-management/create-staff-type.dto";
import {
  StaffDetailsResponse,
  StaffDetailsResponseDTO
} from "./dtos/staff-management/staff-details.dto";
import { toUrlEncodedString } from "./utils/search-query.helper";

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
    __all__: searchKeyword ? `${toUrlEncodedString(searchKeyword)}` : undefined,
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
          ? format(new Date(last_logged_in), "yyyy/MM/dd")
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

export const randomPassword = (): string => {
  const passwordLength = 8;
  let password = "";
  const randomChars = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const randomNumber = Math.floor(Math.random() * chars.length);
    return chars.substring(randomNumber, randomNumber + 1);
  };
  const randomUppercases = (): string => {
    const charsUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomNumber = Math.floor(Math.random() * charsUppercase.length);
    return charsUppercase.substring(randomNumber, randomNumber + 1);
  };
  const randomNumbers = (): string => {
    const numbers = "0123456789";
    const randomNumber = Math.floor(Math.random() * numbers.length);
    return numbers.substring(randomNumber, randomNumber + 1);
  };
  const randomSpecialChars = (): string => {
    const specialChars = "!@#$%^&*()";
    const randomNumber = Math.floor(Math.random() * specialChars.length);
    return specialChars.substring(randomNumber, randomNumber + 1);
  };
  for (let i = 0; i <= passwordLength; i++) {
    const randomChar =
      i % 4 === 0
        ? randomChars()
        : i % 5 === 1
        ? randomUppercases()
        : i % 5 === 2
        ? randomNumbers()
        : randomSpecialChars();
    password += randomChar;
  }
  return password;
};

export async function createStaff(
  data: StaffDto
): Promise<ServiceResponse<StaffDto>> {
  const [error, res] = await transformRequest<StaffDto>({
    url: "staff_management",
    method: "post",
    data
  });

  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg,
      errorParams: (
        error?.response?.data as { details: { msg: string; loc: string[] }[] }
      ).details[0]?.loc?.filter((e) => e === "email")
    };
  }

  return {
    res
  };
}

export async function getListWorkPlace(): Promise<
  Pagination<workPlace> | undefined
> {
  const [err, res] = await transformRequest<workPlaceDTO[]>({
    url: `workplace/options?page_size=full`,
    method: "get"
  });
  if (err) return undefined;
  return {
    results: res.map((item) => {
      const {
        id,
        name,
        workplace_type,
        latitude,
        longitude,
        base_type,
        tenant_id
      } = item;
      return {
        id,
        name,
        workPlaceType: workplace_type,
        latitude,
        longitude,
        baseType: base_type,
        tenantId: tenant_id
      };
    })
  };
}

export async function getStaffDetail(
  id: number
): Promise<ServiceResponse<StaffDetailsResponseDTO>> {
  const [error, res] = await transformRequest<StaffDetailsResponse>({
    url: `/staff_management/${id}`,
    method: "get"
  });

  if (error || !res) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }

  return {
    res: {
      ...res,
      user_role: UserRoleLabel[res.user_role - 1],
      belongs: WorkplaceLabel[res.belongs],
      is_disable: !res.is_disable,
      last_logged_in: res.last_logged_in
        ? format(new Date(res.last_logged_in), "yyyy/MM/dd")
        : ""
    }
  };
}
