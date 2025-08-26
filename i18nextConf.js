import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import translationFile from '@app/assets/locales/ar.json';

const fallbackLng = ['en'];
const availableLanguages = ['en', 'ar'];

const resources = {
  en: {
    translation: translationFile,
  },
  ar: {
    translation: translationFile,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,

    detection: {
      checkWhitelist: true,
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
