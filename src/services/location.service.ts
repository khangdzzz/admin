import { formatDateTime } from "@/modules/base/components/validator/dateFormat";
import { ServiceResponse } from "@/modules/common/models";
import { UserLocationHistoryModel } from "@/modules/realtime-management/models/user-location-history.model";
import { CurrentUserLocationModel } from "../modules/realtime-management/models/current-user-location.model";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import { CurrentUserLocationResponseDto } from "./dtos/location/current-user-location-response.dto";
import {
  GetLatLongResponseDTO,
  LocationCollectRouteReferences,
  PostalAddressResponseDTO
} from "./dtos/location/location.dto";
import { UserLocationHistoryDto } from "./dtos/location/user-location-history.dto";

export async function isPostalAddressExists(
  postalCode: string
): Promise<ServiceResponse<PostalAddressResponseDTO>> {
  const [error, res] = await transformRequest<
    PaginationDto<PostalAddressResponseDTO>
  >({
    url: "/postal_address",
    method: "get",
    params: {
      postal_code__like: postalCode
    }
  });

  if (error) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }

  return {
    res: res.results[0]
  };
}

export async function getLatLongFromAddress(
  address: string
): Promise<ServiceResponse<GetLatLongResponseDTO[]>> {
  const [error, res] = await transformRequest<GetLatLongResponseDTO[]>({
    url: `https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=${address}`,
    method: "get"
  });

  if (error) {
    return {
      error: (error?.response?.data as { details: { msg: string }[] })
        .details[0].msg
    };
  }

  return {
    res
  };
}

export async function getListCurrentUserLocations(
  id: number
): Promise<CurrentUserLocationModel[]> {
  const [err, res] = await transformRequest<
    PaginationDto<CurrentUserLocationResponseDto>
  >({
    url: `location/current?workplace_id=${id}`,
    method: "get"
  });
  if (err || !res) return [];
  return res.results.map((currentUserLocation): CurrentUserLocationModel => {
    const {
      current_weight: currentWeight,
      last_update_time: lastUpdateTime,
      latitude,
      longitude,
      max_weight: maxWeight,
      number_plate: numberPlate,
      route_order_id: routeOrderId,
      route_order_name: routeOrderName,
      tenant_id: tenantId,
      user_email: userEmail,
      user_id: userId,
      user_name: userName,
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      workplace_id: workplaceId
    } = currentUserLocation;
    return {
      currentWeight,
      lastUpdateTime,
      latitude,
      longitude,
      maxWeight,
      numberPlate,
      routeOrderId,
      routeOrderName,
      tenantId,
      userEmail,
      userId,
      userName,
      vehicleId,
      vehicleName,
      workplaceId,
      isVisible: true
    };
  });
}

export async function getUserLocationDetail(
  userId: number
): Promise<UserLocationHistoryModel | undefined> {
  const [err, res] = await transformRequest<UserLocationHistoryDto>({
    url: `/location/history?user_id=${userId}`,
    method: "get"
  });
  if (!res || err) {
    return undefined;
  }
  const lastHistory = res.results[0];
  const collectedPoint = lastHistory?.list_collected_points || [];
  const collectRoute = {
    listCoordinates: JSON.parse(
      res.collect_route?.list_coordinates || "[]"
    ) as number[][]
  };
  if (
    res?.collect_route?.start_point_workplace?.latitude &&
    res?.collect_route?.start_point_workplace?.longitude
  ) {
    collectRoute["startPoint"] = [
      res?.collect_route?.start_point_workplace?.latitude,
      res?.collect_route?.start_point_workplace?.longitude
    ];
  }

  if (
    res?.collect_route?.end_point_workplace?.latitude &&
    res?.collect_route?.end_point_workplace?.longitude
  ) {
    collectRoute["endPoint"] = [
      res?.collect_route?.end_point_workplace?.latitude,
      res?.collect_route?.end_point_workplace?.longitude
    ];
  }

  return {
    collectOrder: {
      collectPoints: res.collect_points.map((point) => {
        return {
          ...point,
          isCollected: collectedPoint.some((p) => p === point.id)
        };
      })
    },
    collectRoute,
    history: (res.results || []).map((history) => {
      return {
        latitude: history.latitude,
        longitude: history.longitude,
        currentWeight: history.current_weight
      };
    }),
    listCollectedPoints: lastHistory?.list_collected_points || [],
    maxWeight: lastHistory?.max_weight,
    routeName: lastHistory?.route_order_name,
    vehicleId: lastHistory?.vehicle_id,
    vehicleName: lastHistory?.vehicle_name,
    loadingWeight: lastHistory?.current_weight,
    userName: lastHistory?.user_name,
    currentLat: lastHistory.latitude,
    currentLong: lastHistory.longitude,
    lastActiveTime: formatDateTime(
      lastHistory.last_update_time,
      "yyyy/MM/dd HH:mm:ss"
    )
  };
}

export async function getCollectOrderReferences(
  collectOrderId: number
): Promise<LocationCollectRouteReferences[] | undefined> {
  const [err, res] = await transformRequest<{
    results: LocationCollectRouteReferences[];
  }>({
    url: `/location/collect_order_references/${collectOrderId}`,
    method: "get"
  });
  if (!res || err) {
    return undefined;
  }
  return res.results;
}

export async function getLocationHistory(params: {
  user_id: number;
  last_update_time: string;
}): Promise<UserLocationHistoryDto | undefined> {
  const [err, res] = await transformRequest<UserLocationHistoryDto>({
    url: `/location/history`,
    method: "get",
    params
  });
  if (!res || err) {
    return undefined;
  }
  return res;
}
