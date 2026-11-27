import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { CRISIS_COPY } from '@/src/lib/crisis';

export default function ModalScreen() {
  const c = Colors[useColorScheme()];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.text }]}>Don't Text Your Ex</Text>
      <Text style={[styles.body, { color: c.textMuted }]}>
        Expo shell for web, iOS, and Android. The GitHub Pages static demo remains
        at the repo root until cutover.
      </Text>
      <Text style={[styles.crisis, { color: c.crisis }]}>{CRISIS_COPY}</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  body: { fontSize: 15, lineHeight: 22 },
  crisis: { fontSize: 12, lineHeight: 18, marginTop: 12 },
});
