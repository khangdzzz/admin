// import { CollectionBase } from "@/modules/staff-management/models/collection-base.model";
import { transformRequest } from "./base.service";
import { CollectionPoint } from "./dtos/collection-point/collection-point.dto";



export async function deleteCollectionBaseById(
    ids: number[]
): Promise<boolean> {
    const [error] = await transformRequest<CollectionPoint>({
        url: `/collect_point`,
        method: "delete",
        data: {
            ids
        }
    });
    if (error) return false;
    return true;
}

export const getCollectionPointById = async (
    collectionBaseId: number
): Promise<CollectionPoint | undefined> => {
    const [error, res] = await transformRequest<CollectionPoint>({
        url: `/collect_point/${collectionBaseId}`
    });
    if (error || !res) return undefined;
    return res
};
