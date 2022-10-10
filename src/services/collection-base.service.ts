import { Pagination } from "@/modules/common/models/pagination.model";
import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import listCollectionBase from "./mocks/collection-base/get-list-collection-base.response.json";

export function getListCollectionBase():
  | Pagination<CollectionBase>
  | undefined {
  return listCollectionBase;
}
