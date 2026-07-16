import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/i18n';

type Language = 'en' | 'ar';
type Dir = 'ltr' | 'rtl';

interface LanguageContextValue {
  language: Language;
  dir: Dir;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('loshy-lang') as Language) || 'en';
  });

  const dir: Dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    i18n.changeLanguage(language);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('loshy-lang', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
