import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ChecklistScreen() {
  const c = Colors[useColorScheme()];

  return (
    <Screen
      title="Breakup admin"
      subtitle="Mute, subscriptions, scripts — hygiene, not drama."
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Checklist progress will sync to the signed-in user. Content matches the
        prototype admin list.
      </Text>
    </Screen>
  );
}
