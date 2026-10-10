import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLang, TranslationDictionary, translations } from './translations.ts';

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>(() => {
    const saved = localStorage.getItem('bffmeter_lang');
    if (saved && (saved === 'en' || saved === 'bn' || saved === 'hi' || saved === 'es')) {
      return saved as SupportedLang;
    }
    return 'en';
  });

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang);
    localStorage.setItem('bffmeter_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(LanguageContext);
};
