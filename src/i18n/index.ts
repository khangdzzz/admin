
import * as en from './en.json'
import * as ja from './ja.json'
import { createI18n } from 'vue-i18n'

const translations = {
    en,
    ja
}

export const i18n = createI18n({
    locale: 'en', // default language: en: English, ja: Japanese
    fallbackLocale: 'en',
    messages: translations
})



