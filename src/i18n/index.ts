import * as en from "./en.json";
import * as ja from "./ja.json";
import { createI18n } from "vue-i18n";
import { service } from "@/services";
import { localStorageKeys } from "@/services/local-storage-keys";

const translations = {
  en,
  ja
};

const currentLanguage = service.localStorage.getItem(
  localStorageKeys.currentLanguage
);

export const i18n = createI18n({
  locale: currentLanguage || "ja", // default language: en: English, ja: Japanese
  fallbackLocale: "en",
  messages: translations
});
