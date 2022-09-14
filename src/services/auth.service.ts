import { AuthModel } from "@/modules/auth/models";
import { transformRequest } from "./base.service";

export async function login(
  userInfo: AuthModel
): Promise<string | undefined | unknown> {
  const { username, password } = userInfo;
  const [error, res] = await transformRequest({
    url: "auth-admin/login",
    method: "post",
    data: { username, password }
  });
  if (error) return undefined;
  return res;
}

export function logout(): void {
  localStorage.clear();
}
