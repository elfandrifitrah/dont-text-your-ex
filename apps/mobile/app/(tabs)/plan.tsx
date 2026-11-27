import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function PlanScreen() {
  const c = Colors[useColorScheme()];

  return (
    <Screen
      title="Your 30 Days"
      subtitle="One focus a day. Small, finishable, compounding."
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Four phases — Wilt, Root, Bud, Bloom — will land here with the same day
        copy as the GitHub Pages prototype.
      </Text>
    </Screen>
  );
}
