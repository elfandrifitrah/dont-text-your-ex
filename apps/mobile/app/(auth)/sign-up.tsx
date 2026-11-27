import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SignUpScreen() {
  const c = Colors[useColorScheme()];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(
    'Accounts are not connected yet. Progress already stays on this device without one.',
  );

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
        style={[styles.primary, { backgroundColor: c.accent }]}
        onPress={() =>
          setStatus(
            'Not connected yet. Continue on this device from the previous screen — nothing you save is lost on refresh.',
          )
        }
      >
        <Text style={styles.primaryLabel}>Create account</Text>
      </Pressable>
      <Text style={[styles.status, { color: c.textMuted }]}>{status}</Text>
      <Link href="/(auth)/sign-in" style={{ marginTop: 8 }}>
        <Text style={{ color: c.accent, fontWeight: '600' }}>
          Already have an account? Sign in
        </Text>
      </Link>
      <Pressable
        accessibilityRole="button"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: c.text, fontWeight: '700' }}>Back to today</Text>
      </Pressable>
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
  },
  primaryLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
  status: { fontSize: 13, lineHeight: 18, marginTop: 8 },
});
