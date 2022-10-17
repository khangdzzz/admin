export interface ContainerDetailResponseDto {
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  deleted_at: string;
  deleted_by: number;
  is_active: number;
  tenant_id: number;
  name: string;
  id: number;
  container_type_id: number;
  container_type___name: string;
  extension_code: string;
  tag_id: string;
  weight: number;
  capacity: number;
}
