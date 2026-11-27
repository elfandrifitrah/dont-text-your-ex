import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
  authErrorMessage,
  requestPasswordReset,
  signInWithEmail,
} from '@/src/lib/auth';

export default function SignInScreen() {
  const c = Colors[useColorScheme()];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function onSignIn() {
    setBusy(true);
    setStatus('');
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email.trim()) {
      setStatus('Enter your email above, then tap reset.');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      await requestPasswordReset(email);
      setStatus('Password reset email sent — check your inbox.');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.label, { color: c.textMuted }]}>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
      <Text style={[styles.label, { color: c.textMuted }]}>Password</Text>
      <TextInput
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
      <Pressable
        style={[styles.primary, { backgroundColor: c.accent, opacity: busy ? 0.7 : 1 }]}
        onPress={onSignIn}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryLabel}>Sign in</Text>
        )}
      </Pressable>
      <Pressable onPress={onReset} disabled={busy} style={{ paddingVertical: 8 }}>
        <Text style={{ color: c.textMuted, fontWeight: '600' }}>
          Forgot password? Send reset email
        </Text>
      </Pressable>
      {status ? (
        <Text style={[styles.status, { color: c.textMuted }]}>{status}</Text>
      ) : null}
      <Link href="/(auth)/sign-up" style={{ marginTop: 8 }}>
        <Text style={{ color: c.accent, fontWeight: '600' }}>
          Need an account? Sign up
        </Text>
      </Link>
      <Link href="/(auth)/upgrade" style={{ marginTop: 8 }}>
        <Text style={{ color: c.textMuted, fontWeight: '600' }}>
          Guest? Upgrade to email
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, gap: 8 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primary: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  status: { fontSize: 13, lineHeight: 18, marginTop: 8 },
});
