export interface Container {
  id: number;
  key?: number;
  containerName: string;
  containerType: string;
  containerTypeId: number;
  weight: number | null;
  capacity: number | null;
}

export interface EditContainerDto {
  id: number;
  name: string;
  container_type_id: number;
  capacity: number | null;
  weight: number;
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
