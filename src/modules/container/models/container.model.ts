import { Date } from "@/modules/common/models/date.model";


export interface Container {
  id?: string;
  key?: number;
  containerName: string;
  containerType: string;
  weight?: number;
  capacity?: string;
}

export interface EditContainerDto {
  id: number
  name: string,
  container_type_id: number,
  capacity: number | null,
  weight: number
}

export interface ContainerSelection {
  value: string | number;
  label: string;
}
export interface ContainerType {
  id?: number | string;
  key: number | string;
  name: string;
  weight?: number;
  capaity?: string;
  type?: string;
}
export interface ResContainer extends Date {
  capacity: number | null;
  container_type___name: string;
  container_type_id: number
  extension_code: string;
  id: number;
  name: string;
  tag_id: string | null;
  tenant_id: number;
  weight: number
}
