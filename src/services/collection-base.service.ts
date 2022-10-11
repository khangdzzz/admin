import { Pagination } from "@/modules/common/models/pagination.model";
import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import { transformRequest } from "./base.service";
import { CollectionBaseResponseDto } from "./dtos/collection-base/collection-base.dto";
import listCollectionBase from "./mocks/collection-base/get-list-collection-base.response.json";

export function getMockCollectionBase():
  | Pagination<CollectionBase>
  | undefined {
  return listCollectionBase;
}
export async function getListCollectionBase(): Promise<
  Pagination<CollectionBase> | undefined
> {
  const [error, res] = await transformRequest<CollectionBaseResponseDto>({
    url: "/workplace/collection_base",
    method: "get"
  });
  if (error && !res) return;
}

export async function deleteCollectionBase(ids: number[]): Promise<boolean> {
  const [error] = await transformRequest<CollectionBase>({
    url: ` /workplace/collection_base`,
    method: "delete",
    data: {
      ids
    }
  });
  if (error) return false;
  return true;
}
