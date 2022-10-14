import axios, {
  AxiosError,
  AxiosResponse,
  type AxiosRequestConfig
} from "axios";

import { service } from "../services";
import { logout } from "./auth.service";

const axiosIntance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: import.meta.env.VITE_REQUEST_TIMEOUT
});

axiosIntance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = service.localStorage.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosIntance.interceptors.response.use(
  (respone) => handleRequestResponse(respone.data),
  (error) => handleRequestError(error)
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRequestResponse = (data: any): any => {
  if (data?.message === "The incoming token has expired") {
    logout();
    return undefined;
  }
  return data;
};
const handleRequestError = async (error: AxiosError): Promise<void> => {
  if (error.code == "ERR_NETWORK") {
    service.auth.refreshToken();
  }
  return Promise.reject(error);
};

export function transformRequest<T>(
  config: AxiosRequestConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<[null, T] | [AxiosError<unknown, any>, null]> {
  return axiosIntance.request(config).then(
    (val: AxiosResponse<T>) => [null, val || val] as unknown as [null, T],
    (err: AxiosError) => [err, null] as [AxiosError, null]
  );
}
