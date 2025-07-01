import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './en/translation.json';
import translationID from './id/translation.json';

const resources = {
  en: { translation: translationEN },
  id: { translation: translationID }
};

i18n
  .use(LanguageDetector) // deteksi bahasa dari browser/localStorage
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id', // jika bahasa tidak dikenali, pakai default 'id'
    interpolation: {
      escapeValue: false // React sudah aman terhadap XSS
    }
  });

export default i18n;
