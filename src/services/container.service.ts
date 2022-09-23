import {
  Container,
  ContainerSelection,
  ContainerType
} from "@/modules/container/models";
import { transformRequest } from "./base.service";

const data: ContainerType[] = [
  {
    name: "Basket trolley",
    weight: 4,
    capaity: "100ml",
    key: "1",
    type: "Container Type 1"
  },
  {
    name: "Folding Container",
    weight: 5,
    capaity: "100ml",
    key: "2",
    type: "Container Type 2"
  },
  {
    name: "Cardboard",
    weight: 6,
    capaity: "100ml",
    key: "3",
    type: "Container Type 3"
  }
];
export function getMockCollectionBase(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Collection Base 1" },
    { value: 2, label: "Collection Base 2" }
  ];
  return res;
}

export function getListContainerType(): ContainerType[] {
  return data;
}

export function getContainerTypeById(id: string): Promise<ContainerType> {
  const containerType = data.find((item) => item.key === id);
  if (!containerType) throw new Error("id does not exit");
  return Promise.resolve(containerType);
}
export function getMockPartner(): ContainerSelection[] {
  const res: ContainerSelection[] = [
    { value: 1, label: "Partner 1" },
    { value: 2, label: "Partner 2" }
  ];
  return res;
}

export function getContainerTypes(): ContainerType[] {
  const res: ContainerType[] = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      id: `v${i}`,
      key: i,
      name: `Container Type ${i}`
    });
  }
  return res;
}

export async function updateContainer(
  containerInfo: Container
): Promise<Container | unknown> {
  const { id, containerType, containerName } = containerInfo;
  const [error, res] = await transformRequest({
    url: `update-container/${id}`,
    method: "patch",
    params: {},
    data: { id, containerType, containerName }
  });
  if (error) return undefined;
  return res;
}

export function getContainerById(id: string): ContainerType | undefined {
  const container = data.find((item) => item.key === id) || undefined;
  return container;
}
