import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import enJSON from '../public/locales/en.json'
import deJSON from '../public/locales/de.json'
import itJSON from '../public/locales/it.json'

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: enJSON,
    },
    de: {
      translation: deJSON,
    },
    it: {
      translation: itJSON,
    },
  },
  fallbackLng: 'en', // Set the initial language of the App
  returnEmptyString: false,
  returnNull: false,

  interpolation: {
    escapeValue: false,
  },
})
