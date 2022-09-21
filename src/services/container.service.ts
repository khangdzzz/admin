interface DataType {
  key: string;
  name: string;
}

const data: DataType[] = [
  {
    key: "1",
    name: "Basket trolley"
  },
  {
    key: "2",
    name: "Folding Container"
  },
  {
    key: "3",
    name: "Cardboard"
  },
];

export function getListContainerType(): DataType[]{
  return data
}