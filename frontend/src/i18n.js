import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Aggiungi il supporto per React
  .init({
    lng: 'en', // Lingua predefinita
    fallbackLng: 'en', // Lingua di fallback
    resources: {
      en: {
        translation: require('./locales/en.json'),
      },
      fr: {
        translation: require('./locales/it.json'),
      },
    },
  });

export default i18n;