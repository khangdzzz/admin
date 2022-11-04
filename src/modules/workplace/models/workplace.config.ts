import IcDisposalStartPoint from "@/assets/icons/ic_disposal_start_point.svg";
import IcDisposalEndPoint from "@/assets/icons/ic_disposal_end_point.svg";
import IcCollectionBaseStartPoint from "@/assets/icons/ic_collection_base_start_point.svg";
import IcCollectionBaseEndPoint from "@/assets/icons/ic_collection_base_end_point.svg";
import { WorkPlaceType } from "./workplace.model";

export const ICONS = {
  [WorkPlaceType.COLLECTION_BASE]: {
    start: IcCollectionBaseStartPoint,
    end: IcCollectionBaseEndPoint
  },
  [WorkPlaceType.DISPOSAL]: {
    start: IcDisposalStartPoint,
    end: IcDisposalEndPoint
  },
  [WorkPlaceType.PARTNER]: {
    start: IcCollectionBaseStartPoint,
    end: IcCollectionBaseEndPoint
  }
};
