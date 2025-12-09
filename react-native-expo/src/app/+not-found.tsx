import React from 'react';
import { StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalization } from '@/contexts/localization-context';

export default function NotFoundScreen() {
  const { t } = useLocalization();
  const pathname = usePathname();
  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">{t('not_found.content', { pathname })}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
