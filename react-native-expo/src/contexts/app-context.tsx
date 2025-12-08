import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalization } from '@/contexts/localization-context';

const AppContext = createContext<undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { initialize: initializeLocalization, isInitialized: localizationInitialized } =
    useLocalization();

  const [fontsLoaded] = useFonts({
    'NotoSansJP-Regular': require('../../assets/fonts/NotoSansJP-Regular.ttf'),
  });

  const [appInitialized, setAppInitialized] = useState(false);

  const isReady = fontsLoaded && localizationInitialized && appInitialized;

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([initializeLocalization()]);
      } finally {
        setAppInitialized(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const handleAppReady = () => {
      if (!isReady) return;
      SplashScreen.hide();
    };
    handleAppReady();
  }, [isReady]);

  if (!isReady) return null;

  return <AppContext.Provider value={undefined}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
