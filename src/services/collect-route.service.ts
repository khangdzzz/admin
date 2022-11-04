import {
  CollectRoute,
  CollectRouteDto
} from "@/modules/collect-route/models/collect-route-model";
import { transformRequest } from "./base.service";

const ROUTE_COLLECT_URI_PREFIX = "/collect_route";
// export const ROUTE_COLLECT_URIS = {
//   GET_ROUTE_COLLECT_BY_ORDER_ID: (id: number): string => `${URI_PREFIX}/${id}`,
//   CREATE_ROUTE_COLLECT: `${URI_PREFIX}`
// };

export async function createCollectRoute(
  data: CollectRoute,
  isEdit = true
): Promise<CollectRouteDto | undefined> {
  const [err, res] = await transformRequest<CollectRouteDto>({
    url: isEdit
      ? `${ROUTE_COLLECT_URI_PREFIX}/${data.collect_order_id}`
      : ROUTE_COLLECT_URI_PREFIX,
    method: isEdit ? "put" : "post",
    data
  });
  if (err || !res) return undefined;
  return res;
}
export async function getCollectRoute(
  id: number
): Promise<CollectRoute | undefined> {
  const [err, res] = await transformRequest<CollectRoute>({
    url: `${ROUTE_COLLECT_URI_PREFIX}/${id}`,
    method: "get"
  });
  if (err || !res) {
    return undefined;
  }
  return res;
}

export async function deleteCollectRoute(
  collect_order_ids: number[]
): Promise<boolean> {
  const [error] = await transformRequest({
    url: ROUTE_COLLECT_URI_PREFIX,
    method: "delete",
    data: {
      collect_order_ids
    }
  });
  if (error) return false;
  return true;
}
