import { workPlaceDTO } from "@/modules/staff-management/models/staff.model";

export default interface UserInfomationDto {
  id: number;
  email: string;
  tenant_id: number;
  employee_code: string;
  name: string;
  name_kana: string;
  is_disable: number;
  telephone: string;
  belongs: number;
  user_role: number;
  workplaces: workPlaceDTO[];
}
