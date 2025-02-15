import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Limpar qualquer configuração anterior de idioma
localStorage.removeItem('i18nextLng')

const i18nConfig = {
  fallbackLng: 'de',
  supportedLngs: ['de', 'en', 'pt'],
  defaultNS: 'translation',
  ns: ['translation'],
  lng: 'de',
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    requestOptions: {
      cache: 'no-store'
    }
  },
  detection: {
    order: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage']
  },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    skipTranslationOnMissingKey: false
  }
}

// Inicializar i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig)
  .then(() => {
    // Forçar o idioma alemão após a inicialização
    return i18n.changeLanguage('de')
  })
  .then(() => {
    // Atualizar o HTML e localStorage
    document.documentElement.setAttribute('lang', 'de')
    localStorage.setItem('i18nextLng', 'de')
    
    // Carregar recursos para o alemão
    return i18n.loadNamespaces('translation')
  })
  .catch(error => {
    console.error('Error initializing i18n:', error)
  })

// Listener para mudanças de idioma
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng)
  localStorage.setItem('i18nextLng', lng)
  
  // Recarregar recursos quando o idioma mudar
  i18n.reloadResources(lng, 'translation').catch(error => {
    console.error('Error reloading translations:', error)
  })
})

export default i18n