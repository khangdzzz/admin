import { ContainerType } from "@/modules/container/models/container-type.models";

const data: ContainerType[] = [
  {
    name: "Basket trolley",
    weight: 4,
    capaity: "100ml",
    key: "1"
  },
  {
    name: "Folding Container",
    weight: 5,
    capaity: "100ml",
    key: "2"
  },
  {
    name: "Cardboard",
    weight: 6,
    capaity: "100ml",
    key: "3"
  }
];

export function getListContainerType(): ContainerType[] {
  return data;
}

export function getContainerTypeById(id: string): Promise<ContainerType> {
  const containerType = data.find((item) => item.key === id);
  if (!containerType) throw new Error("id does not exit");
  return Promise.resolve(containerType);
}
