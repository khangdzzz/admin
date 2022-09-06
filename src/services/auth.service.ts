import { transformRequest } from "./base.service";

export async function test(): Promise<string | undefined> {
    const [error, res] = await transformRequest({
        method: 'get'
    })
    if (error) return undefined;
    return res?.toString()
}

export function logout() : void{
    localStorage.clear()
}