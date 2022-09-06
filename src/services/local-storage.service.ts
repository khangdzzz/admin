import { localStorageKeys } from "./local-storage-keys"

export function getAccessToken(): string | null {
    return localStorage.getItem(localStorageKeys.accessToken)
}

export function setAccessToken(accessToken: string | undefined): void {
    if (!accessToken) {
        localStorage.removeItem(localStorageKeys.accessToken)
        return
    }
    localStorage.setItem(localStorageKeys.accessToken, accessToken)
}

export function setObject<T>(key: string, item: T): void {
    if (!item) {
        localStorage.removeItem(key)
        return
    }
    const jsonData = JSON.stringify(item)
    localStorage.setItem(key, jsonData)
}

export function getObject<T>(key: string): T | undefined {
    const jsonData = localStorage.getItem(key)
    if (!jsonData) return undefined
    const parsedData: T = JSON.parse(jsonData)
    return parsedData
}