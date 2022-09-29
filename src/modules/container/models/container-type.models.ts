export interface ContainerType {
  id: number;
  key: string;
  name: string;
  weight: number;
  capaity: string;
}

export default interface ContainerTypeModel {
  tenantId: number;
  name: string;
  id: number;
  key: number;
}
