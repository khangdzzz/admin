import { UserRoleOptions } from "./create-new-staff.model";

export interface Staff {
  key?: number;
  id?: number;
  employeeCode: string;
  name: string;
  email: string;
  userRole: string;
  tenant: string;
  collectionBase: string;
  workplace?: string;
  lastLoggedIn?: string;
  isDisabled: boolean;
}

export interface StaffDto {
  employee_code: string;
  name: string;
  email: string;
  telephone: string | null;
  user_role: UserRoleOptions | undefined;
  user_type?: number;
  workplace_ids: string | string[] | undefined;
  belongs: number;
  password: string;
}

export interface workPlace {
  id: number;
  name: string;
  tenantId?: number;
  workPlaceType?: number;
  baseType?: number;
}
export interface workPlaceDTO {
  id: number;
  name: string;
  tenant_id?: number;
  workplace_type?: number;
  base_type?: number;
}
