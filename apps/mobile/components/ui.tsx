import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function Card({ children }: { children: ReactNode }) {
  const c = Colors[useColorScheme()];
  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
      {children}
    </View>
  );
}

export function Kicker({ children }: { children: string }) {
  const c = Colors[useColorScheme()];
  return <Text style={[styles.kicker, { color: c.accentDeep }]}>{children}</Text>;
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const c = Colors[useColorScheme()];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? c.accent : c.surface,
          borderColor: selected ? c.accent : c.line,
        },
      ]}
    >
      <Text style={{ color: selected ? '#fff' : c.text, fontWeight: '600', fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const c = Colors[useColorScheme()];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.primary, { backgroundColor: c.accent }]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function QuietButton({ label, onPress }: { label: string; onPress: () => void }) {
  const c = Colors[useColorScheme()];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.quiet, { borderColor: c.line }]}
    >
      <Text style={[styles.quietLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primary: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  primaryLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  quiet: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quietLabel: { fontWeight: '600', fontSize: 15 },
});
