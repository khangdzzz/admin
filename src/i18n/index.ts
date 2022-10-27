import * as en from "./en.json";
import * as ja from "./ja.json";
import { createI18n } from "vue-i18n";
import { localStorageKeys } from "@/services/local-storage-keys";
import { SupportedLanguage } from "@/modules/base/models";

const translations = {
  en,
  ja
};

const currentLanguage = (localStorage.getItem(
  localStorageKeys.currentLanguage
) || SupportedLanguage.Japanese) as SupportedLanguage;

export const i18n = createI18n({
  locale: currentLanguage || SupportedLanguage.Japanese,
  fallbackLocale: SupportedLanguage.English,
  messages: translations
});
