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
import { authErrorMessage, signUpWithEmail } from '@/src/lib/auth';
import { useAuth } from '@/src/providers/AuthProvider';

export default function SignUpScreen() {
  const c = Colors[useColorScheme()];
  const { isAnonymous } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(
    isAnonymous
      ? 'You are a guest — creating an account will upgrade this session (same uid).'
      : '',
  );

  async function onSignUp() {
    setBusy(true);
    setStatus('');
    try {
      await signUpWithEmail(email, password, displayName);
      router.replace('/(tabs)');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.label, { color: c.textMuted }]}>Display name (optional)</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={40}
        placeholder="How comments may know you"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
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
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        placeholderTextColor={c.textMuted}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.line },
        ]}
      />
      <Pressable
        style={[styles.primary, { backgroundColor: c.accent, opacity: busy ? 0.7 : 1 }]}
        onPress={onSignUp}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryLabel}>
            {isAnonymous ? 'Upgrade & create account' : 'Create account'}
          </Text>
        )}
      </Pressable>
      {status ? (
        <Text style={[styles.status, { color: c.textMuted }]}>{status}</Text>
      ) : null}
      <Link href="/(auth)/sign-in" style={{ marginTop: 8 }}>
        <Text style={{ color: c.accent, fontWeight: '600' }}>
          Already have an account? Sign in
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
