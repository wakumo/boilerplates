import { Language, TranslationPath, translations } from '@/lib/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface LocalizationContextType {
  language: Language;
  locale: string;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationPath, params?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const AVAILABLE_LANGUAGES = ['ja', 'en'] as Language[];
const AVAILABLE_LOCALES = ['ja-JP', 'en-US'];
const LANGUAGE_STORAGE_KEY = '@app_language';

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [language, setLanguageState] = useState<Language>(AVAILABLE_LANGUAGES[0] as Language);
  const [locale, setLocale] = useState<string>(AVAILABLE_LOCALES[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = async () => {
    if (isInitialized) return;
    try {
      await initializeLanguage();
    } finally {
      setIsInitialized(true);
    }
  };
  const initializeLanguage = async () => {
    try {
      // Check for saved language preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage as Language)) {
        setLanguageAndLocale(savedLanguage as Language);
        return;
      }
      throw new Error('No valid language found');
    } catch {
      setLanguageAndLocale(AVAILABLE_LANGUAGES[0] as Language);
    }
  };

  const setLanguageAndLocale = (value: Language) => {
    let index = AVAILABLE_LANGUAGES.indexOf(value);
    if (index === -1) index = 0;
    setLanguageState(AVAILABLE_LANGUAGES[index]);
    setLocale(AVAILABLE_LOCALES[index]);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, AVAILABLE_LANGUAGES[index]);
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      // Switch FCM broadcast topic subscription to new language only if notifications are enabled
      if (language !== newLanguage) {
        setLanguageAndLocale(newLanguage);
      }
    } catch (error) {
      console.log('Error setting language:', error);
    }
  };

  // Translation function with nested key support
  const t = useCallback(
    (key: TranslationPath, params?: Record<string, string | number>): string => {
      try {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            value = translations.en;
            for (const k2 of keys) {
              if (value && typeof value === 'object' && k2 in value) {
                value = value[k2];
              } else {
                return key; // Return key if not found in any language
              }
            }
            break;
          }
        }

        if (typeof value !== 'string') {
          return key; // Return key if value is not a string
        }

        // Replace parameters if provided
        if (params) {
          return Object.entries(params).reduce((text, [paramKey, paramValue]) => {
            return text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
          }, value);
        }

        return value;
      } catch (error) {
        console.warn('Translation error for key:', key, error);
        return key;
      }
    },
    [language]
  );
  const value = useMemo(
    () => ({
      language,
      locale,
      isInitialized,
      initialize,
      setLanguage,
      t,
    }),
    [language, locale, isInitialized, t]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
