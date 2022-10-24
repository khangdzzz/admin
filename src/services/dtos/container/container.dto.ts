import { BaseDto } from "../common/base.dto";

export interface ContainerResponseDTO extends BaseDto {
  capacity: number;
  container_type_id: number;
  container_type___name: string;
  id: number;
  name: string;
  tenant_id: number;
  weight: number;
  tag_id: string | null;
  extension_code: string;
}
