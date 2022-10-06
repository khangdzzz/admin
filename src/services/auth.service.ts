import { UserInfo } from "@/modules/auth/models";
import { UserType } from "@/modules/base/models/user-type.enum";
import { router, routeNames } from "@/routes";
import { commonStore } from "@/stores/common.store";
import {
  CognitoUserPool,
  CognitoUser,
  CognitoRefreshToken
} from "amazon-cognito-identity-js";
import { service } from ".";
import UserInfomationDto from "./dtos/auth/user-information.dto";
import { localStorageKeys } from "./local-storage-keys";
import * as mockGetMe from "./mocks/auth/get-me.response.json";

export async function getCurrentUserInformation(): Promise<
  UserInfo | undefined
> {
  // const [error, res] = await transformRequest<UserInfomationDto>({
  //   url: "auth/me",
  //   method: "post"
  // });
  // if (error || !res) {
  //   return undefined;
  // }
  const res: UserInfomationDto = mockGetMe;
  const mockRole: UserType = (localStorage.getItem(localStorageKeys.userType) ||
    UserType.TenantAdmin) as UserType;
  const { id, email, full_name: fullName, tenant_id: tenantId } = res;

  const userInfo = {
    id,
    email,
    fullName,
    tenantId,
    userType: mockRole
  };

  const userStore = commonStore();
  userStore.user = userInfo;
  return userInfo;
}

export function logout(): void {
  localStorage.clear();
  sessionStorage.clear();
  const store = commonStore();
  store.$reset;
}

export function refreshToken(): void {
  const refreshToken = service.localStorage.getItem(
    localStorageKeys.refreshToken
  ) as string;
  const userStore = commonStore();
  const userEmail = userStore.user?.email as string;
  const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
  };
  const userPool = new CognitoUserPool(poolData);

  const cognitoUser = new CognitoUser({
    Username: userEmail,
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
