import { workPlaceDTO } from "@/modules/staff-management/models/staff.model";

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  tenantId: number;
  belongs: number;
  userType: string;
  workplaces: number[];
}
