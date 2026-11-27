import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { signOutUser } from '@/src/lib/auth';
import { useAuth } from '@/src/providers/AuthProvider';

export default function TodayScreen() {
  const c = Colors[useColorScheme()];
  const { user, loading, isAnonymous } = useAuth();

  return (
    <Screen
      title="Today"
      subtitle="You don't need closure from them. You need distance."
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Streak, daily focus, and mood check-in sync in Phase 3. Auth and comments
        are live for Phase 2.
      </Text>

      <View style={{ gap: 8, marginTop: 8 }}>
        {loading ? (
          <Text style={{ color: c.textMuted }}>Checking session…</Text>
        ) : user ? (
          <Text style={{ color: c.textMuted, lineHeight: 20 }}>
            Signed in{isAnonymous ? ' as guest' : ''} · uid{' '}
            {user.uid.slice(0, 8)}…
          </Text>
        ) : (
          <Text style={{ color: c.textMuted }}>Not signed in.</Text>
        )}

        <Link href="/(auth)/welcome" asChild>
          <Pressable
            style={{
              backgroundColor: c.accent,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {user ? 'Account' : 'Sign in / guest'}
            </Text>
          </Pressable>
        </Link>

        <Link href="/comments" asChild>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: c.line,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor: c.surface,
            }}
          >
            <Text style={{ color: c.text, fontWeight: '600' }}>Live feedback</Text>
          </Pressable>
        </Link>

        {user ? (
          <Pressable onPress={() => signOutUser()}>
            <Text
              style={{
                color: c.textMuted,
                textAlign: 'center',
                fontWeight: '600',
                paddingVertical: 8,
              }}
            >
              Sign out
            </Text>
          </Pressable>
        ) : null}

        {isAnonymous ? (
          <Link href="/(auth)/upgrade">
            <Text style={{ color: c.accent, fontWeight: '600', textAlign: 'center' }}>
              Upgrade guest to email
            </Text>
          </Link>
        ) : null}
      </View>
    </Screen>
  );
}
