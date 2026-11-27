import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { isFirebaseConfigured } from '@/src/lib/firebase';
import { CRISIS_COPY } from '@/src/lib/crisis';

export default function WelcomeScreen() {
  const c = Colors[useColorScheme()];
  const configured = isFirebaseConfigured();

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.brand, { color: c.accent }]}>Don't Text Your Ex</Text>
      <Text style={[styles.headline, { color: c.text }]}>
        A 30-day no-contact coach. Save your streak across phone and web.
      </Text>
      <Text style={[styles.body, { color: c.textMuted }]}>
        Phase 1 stubs — wiring to Firebase Auth lands in Phase 2. Guest mode will
        use anonymous auth with optional email upgrade for comments and sync.
      </Text>

      {!configured ? (
        <Text style={[styles.warn, { color: c.accentDeep }]}>
          Firebase env not set yet. Copy `.env.example` → `.env` with your
          restricted web config before enabling live auth.
        </Text>
      ) : null}

      <Link href="/(auth)/sign-in" asChild>
        <Pressable style={[styles.primary, { backgroundColor: c.accent }]}>
          <Text style={styles.primaryLabel}>Sign in</Text>
        </Pressable>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Pressable style={[styles.secondary, { borderColor: c.line }]}>
          <Text style={[styles.secondaryLabel, { color: c.text }]}>
            Create account
          </Text>
        </Pressable>
      </Link>
      <Pressable
        style={styles.guest}
        onPress={() => {
          // Stub: Phase 2 calls signInAnonymously() then router.replace('/(tabs)')
        }}
      >
        <Text style={[styles.guestLabel, { color: c.textMuted }]}>
          Continue as guest (stub)
        </Text>
      </Pressable>

      <Text style={[styles.crisis, { color: c.crisis }]}>{CRISIS_COPY}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  headline: { fontSize: 26, fontWeight: '700', lineHeight: 32, marginTop: 4 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  warn: { fontSize: 13, lineHeight: 18 },
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
  guest: { paddingVertical: 12, alignItems: 'center' },
  guestLabel: { fontSize: 15, fontWeight: '600' },
  crisis: { marginTop: 20, fontSize: 11, lineHeight: 16 },
});
