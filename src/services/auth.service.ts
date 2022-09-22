import { UserInfo } from "@/modules/auth/models";
import { commonStore } from "@/stores/common.store";
import UserInfomationDto from "./dtos/auth/user-information.dto";
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
  const { id, email, full_name: fullName, tenant_id: tenantId } = res;

  const userInfo = {
    id,
    email,
    fullName,
    tenantId
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
