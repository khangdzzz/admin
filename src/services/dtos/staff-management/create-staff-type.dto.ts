export interface StaffTypeResponseDto {
  created_at: string;
  updated_at: string;
  id: number;
  employee_code: string;
  email: string;
  name: string;
  user_role: number;
  tenant: string;
  collection_base: string;
  belongs: number;
  last_logged_in?: string;
  is_disable: boolean;
}
