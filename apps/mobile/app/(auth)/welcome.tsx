import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { authErrorMessage, continueAsGuest } from '@/src/lib/auth';
import { CRISIS_COPY } from '@/src/lib/crisis';
import { useAuth } from '@/src/providers/AuthProvider';

export default function WelcomeScreen() {
  const c = Colors[useColorScheme()];
  const { configured, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function onGuest() {
    setBusy(true);
    setStatus('');
    try {
      await continueAsGuest();
      router.replace('/(tabs)');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.brand, { color: c.accent }]}>Don't Text Your Ex</Text>
      <Text style={[styles.headline, { color: c.text }]}>
        A 30-day no-contact coach. Save your streak across phone and web.
      </Text>
      <Text style={[styles.body, { color: c.textMuted }]}>
        Sign in to sync vault and streak later. Guests can post comments; upgrade
        anytime to keep the same account id.
      </Text>

      {!configured ? (
        <Text style={[styles.warn, { color: c.accentDeep }]}>
          Firebase config missing. Check app.json extra / EXPO_PUBLIC_FIREBASE_*.
        </Text>
      ) : null}

      {user ? (
        <Text style={[styles.body, { color: c.textMuted }]}>
          Signed in{user.isAnonymous ? ' as guest' : ''}. You can return to Today.
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
      <Pressable style={styles.guest} onPress={onGuest} disabled={busy}>
        {busy ? (
          <ActivityIndicator color={c.accent} />
        ) : (
          <Text style={[styles.guestLabel, { color: c.textMuted }]}>
            Continue as guest
          </Text>
        )}
      </Pressable>
      {user ? (
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={{ color: c.accent, fontWeight: '600', textAlign: 'center' }}>
            Back to Today
          </Text>
        </Pressable>
      ) : null}

      {status ? (
        <Text style={[styles.warn, { color: c.accentDeep }]}>{status}</Text>
      ) : null}

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
  guest: { paddingVertical: 12, alignItems: 'center', minHeight: 44 },
  guestLabel: { fontSize: 15, fontWeight: '600' },
  crisis: { marginTop: 20, fontSize: 11, lineHeight: 16 },
});
