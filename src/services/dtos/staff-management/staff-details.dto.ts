export interface StaffDetailsResponseDTO {
  belongs: string;
  email: string;
  employee_code: string;
  id: number;
  is_disable: boolean;
  last_logged_in: string;
  name: string;
  name_kana: string;
  telephone: string;
  tenant_id: number;
  user_role: string;
  workplaces: Workplace[];
}

export interface StaffDetailsResponse {
  belongs: number;
  email: string;
  employee_code: string;
  id: number;
  is_disable: number;
  last_logged_in: string;
  name: string;
  name_kana: string;
  telephone: string;
  tenant_id: number;
  user_role: number;
  workplaces: Workplace[];
}

interface Workplace {
  base_type: number;
  id: number;
  name: string;
  workplace_type: number;
}
