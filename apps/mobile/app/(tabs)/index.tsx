import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TodayScreen() {
  const c = Colors[useColorScheme()];

  return (
    <Screen
      title="Today"
      subtitle="You don't need closure from them. You need distance."
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Streak, daily focus, and mood check-in will sync here in Phase 3. This
        shell preserves the Today tab from the live demo.
      </Text>
      <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>
        Open the person icon to try the auth stubs (email/password + continue as
        guest).
      </Text>
    </Screen>
  );
}
