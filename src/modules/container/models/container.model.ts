export interface Container {
  id?: string;
  key?: number;
  containerName: string;
  containerType: string;
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

export interface ContainerDetail {
  weight: number
  key?: number;
  name: string;
  container_type___name: string;
  capacity: number
}

export interface ResContainer {
  capacity: number;
  container_type___name: string;
  container_type_id: number
  created_at: Date;
  created_by: number;
  deleted_at: Date | null
  deleted_by: number | null
  extension_code: string;
  id: number;
  name: string
  tag_id: string | null;
  tenant_id: number;
  updated_at: Date | null;
  updated_by: number | null;
  weight: number
}