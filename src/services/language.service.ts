import { i18n } from "@/i18n";
import { service } from ".";
import { localStorageKeys } from "./local-storage-keys";

export function changeLanguage(): string {
  const currentLanguage = localStorage.getItem(
    localStorageKeys.currentLanguage
  );
  const newLang = currentLanguage === "ja" ? "en" : "ja";
  service.localStorage.setItem(localStorageKeys.currentLanguage, newLang);
  i18n.global.locale = newLang;
  return newLang;
}
