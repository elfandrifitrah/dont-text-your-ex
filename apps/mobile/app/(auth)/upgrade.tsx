import { router } from 'expo-router';
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
import { authErrorMessage, continueAsGuest, upgradeGuestWithEmail } from '@/src/lib/auth';
import { useAuth } from '@/src/providers/AuthProvider';

export default function UpgradeScreen() {
  const c = Colors[useColorScheme()];
  const { user, isAnonymous } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function ensureGuestThenUpgrade() {
    setBusy(true);
    setStatus('');
    try {
      if (!user) {
        await continueAsGuest();
      }
      await upgradeGuestWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setStatus(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: c.background }]}>
      <Text style={[styles.lead, { color: c.text }]}>
        Keep your guest uid — link an email and password so comments and future
        vault data stay on this account.
      </Text>
      {!isAnonymous && user ? (
        <Text style={{ color: c.textMuted, marginBottom: 8 }}>
          You already have a full account. Use Sign in instead.
        </Text>
      ) : null}
      <Text style={[styles.label, { color: c.textMuted }]}>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
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
        onPress={ensureGuestThenUpgrade}
        disabled={busy || Boolean(user && !isAnonymous)}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryLabel}>Link email to this session</Text>
        )}
      </Pressable>
      {status ? (
        <Text style={[styles.status, { color: c.textMuted }]}>{status}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, gap: 8 },
  lead: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
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
