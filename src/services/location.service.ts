import { ServiceResponse } from "@/modules/common/models";
import { transformRequest } from "./base.service";
import { PaginationDto } from "./dtos/common/pagination.dto";
import {
  GetLatLongResponseDTO,
  PostalAddressResponseDTO
} from "./dtos/location/location.dto";

export async function isPostalAddressExists(
  postalCode: string
): Promise<ServiceResponse<any>> {
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
