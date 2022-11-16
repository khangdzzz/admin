import { Sort } from "@/modules/common/models/sort.enum";

export function calculateSortQuery(
  name: string,
  sort: Sort
): string | undefined {
  return sort === Sort.None ? undefined : sort === Sort.Asc ? name : `-${name}`;
}
