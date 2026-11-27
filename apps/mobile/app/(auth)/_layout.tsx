import { Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AuthLayout() {
  const c = Colors[useColorScheme()];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.accent,
        headerTitleStyle: { color: c.text },
        contentStyle: { backgroundColor: c.background },
      }}
    >
      <Stack.Screen name="welcome" options={{ title: "Don't Text Your Ex" }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
      <Stack.Screen name="upgrade" options={{ title: 'Upgrade guest' }} />
    </Stack>
  );
}
