import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { CRISIS_COPY } from '@/src/lib/crisis';

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  showCrisisFooter?: boolean;
};

export function Screen({ title, subtitle, children, showCrisisFooter }: Props) {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text>
      ) : null}
      <View style={styles.body}>{children}</View>
      {showCrisisFooter ? (
        <Text style={[styles.crisis, { color: c.crisis }]}>{CRISIS_COPY}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { marginTop: 6, fontSize: 15, lineHeight: 22 },
  body: { marginTop: 20, gap: 12 },
  crisis: { marginTop: 28, fontSize: 12, lineHeight: 18 },
});
