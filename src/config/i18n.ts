import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ptTranslations from '../locales/pt/translation.json'
import deTranslations from '../locales/de/translation.json'
import enTranslations from '../locales/en/translation.json'

const resources = {
  pt: { translation: ptTranslations },
  de: { translation: deTranslations },
  en: { translation: enTranslations }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'de', 'en'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  })

i18n.on('languageChanged', (lng) => {
  console.log(`🔄 Language changed to: ${lng}`)
  document.documentElement.lang = lng
})

export default i18n 