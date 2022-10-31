import { UserInfo } from "@/modules/auth/models";
import { SupportedLanguage } from "@/modules/base/models";
import { UserType } from "@/modules/base/models/user-type.enum";
import { router, routeNames } from "@/routes";
import { commonStore } from "@/stores/common.store";
import {
  CognitoUserPool,
  CognitoUser,
  CognitoRefreshToken
} from "amazon-cognito-identity-js";
import { service } from ".";
import { transformRequest } from "./base.service";
import UserInfomationDto from "./dtos/auth/user-information.dto";
import { localStorageKeys } from "./local-storage-keys";
const userRoles = [
  UserType.SystemAdmin,
  UserType.TenantAdmin,
  UserType.CollectionBaseAdmin,
  UserType.Dischanger,
  UserType.DashboardUser,
  UserType.Consignee,
  UserType.Driver,
  UserType.ManufacturingStaff,
  UserType.DriverManufacturingStaff
];

export async function getCurrentUserInformation(): Promise<
  UserInfo | undefined
> {
  try {
    const [error, res] = await transformRequest<UserInfomationDto>({
      url: "user/me",
      method: "get"
    });
    if (error || !res) {
      const userInfoString = localStorage.getItem(localStorageKeys.userInfo);
      if (userInfoString) {
        return JSON.parse(userInfoString) as UserInfo;
      }
      return undefined;
    }
    const { id, email, name: fullName, tenant_id: tenantId, user_role } = res;

    const userInfo = {
      id,
      email,
      fullName,
      tenantId,
      userType: userRoles[user_role - 1]
    };

    const userStore = commonStore();
    userStore.user = userInfo;
    localStorage.setItem(localStorageKeys.userName, email);
    localStorage.setItem(localStorageKeys.userInfo, JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    const userInfoString = localStorage.getItem(localStorageKeys.userInfo);
    if (userInfoString) {
      return JSON.parse(userInfoString) as UserInfo;
    }
    return undefined;
  }
}

export function logout(): void {
  const currentLanguage = (localStorage.getItem(
    localStorageKeys.currentLanguage
  ) || SupportedLanguage.Japanese) as SupportedLanguage;
  localStorage.clear();
  sessionStorage.clear();
  const store = commonStore();
  store.$reset;
  localStorage.setItem(localStorageKeys.currentLanguage, currentLanguage);
}

export function refreshToken(): void {
  const refreshToken = service.localStorage.getItem(
    localStorageKeys.refreshToken
  ) as string;
  const userEmail = localStorage.getItem(localStorageKeys.userName);
  const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
  };
  const userPool = new CognitoUserPool(poolData);

  const cognitoUser = new CognitoUser({
    Username: userEmail || "",
    Pool: userPool
  });

  cognitoUser.refreshSession(
    new CognitoRefreshToken({ RefreshToken: refreshToken }),
    (err, session): void => {
      if (!err && session) {
        const idToken = session.getIdToken().getJwtToken();
        service.localStorage.setAccessToken(idToken);
      } else {
        logout();
        router.push({ name: routeNames.login });
      }
    }
  );
}
