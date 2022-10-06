import { i18n } from "@/i18n";
import { SupportedLanguage } from "@/modules/base/models";
import { service } from ".";
import { localStorageKeys } from "./local-storage-keys";

export const changeLanguage = (): string => {
  const currentLanguage = getCurrentLanguage();
  const newLang =
    currentLanguage === SupportedLanguage.Japanese
      ? SupportedLanguage.English
      : SupportedLanguage.Japanese;
  service.localStorage.setItem(localStorageKeys.currentLanguage, newLang);
  i18n.global.locale = newLang;
  return newLang;
};

export const getCurrentLanguage = (): SupportedLanguage => {
  return (localStorage.getItem(localStorageKeys.currentLanguage) ||
    SupportedLanguage.Japanese) as SupportedLanguage;
};
