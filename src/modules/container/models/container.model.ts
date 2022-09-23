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
