import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CrisisNote } from '@/components/CrisisNote';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function leaveAuth() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)');
}

export default function WelcomeScreen() {
  const c = Colors[useColorScheme()];

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.brand, { color: c.accent }]}>Don't Text Your Ex</Text>
      <Text style={[styles.headline, { color: c.text }]}>
        A 30-day no-contact coach. Your streak, vault, and checklist stay on this device.
      </Text>
      <Text style={[styles.body, { color: c.textMuted }]}>
        No account needed for the 2am draft. Sign-in for a second phone comes later — closing the
        app does not wipe today.
      </Text>

      <Pressable
        accessibilityRole="button"
        style={[styles.primary, { backgroundColor: c.accent }]}
        onPress={leaveAuth}
      >
        <Text style={styles.primaryLabel}>Continue on this device</Text>
      </Pressable>
      <Link href="/(auth)/sign-in" asChild>
        <Pressable style={[styles.secondary, { borderColor: c.line }]}>
          <Text style={[styles.secondaryLabel, { color: c.text }]}>Sign in</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Pressable style={styles.guest}>
          <Text style={[styles.guestLabel, { color: c.textMuted }]}>Create account</Text>
        </Pressable>
      </Link>

      <CrisisNote />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  headline: { fontSize: 26, fontWeight: '700', lineHeight: 32, marginTop: 4 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  primary: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondary: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryLabel: { fontWeight: '600', fontSize: 16 },
  guest: { paddingVertical: 8, alignItems: 'center' },
  guestLabel: { fontSize: 15, fontWeight: '600' },
});
