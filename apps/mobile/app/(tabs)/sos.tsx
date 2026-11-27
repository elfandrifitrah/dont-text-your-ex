import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SosScreen() {
  const c = Colors[useColorScheme()];

  return (
    <Screen
      title="SOS Check"
      subtitle="For the 2am draft. Especially for the 2am draft."
      showCrisisFooter
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Draft checker, verdict, rewritten unsent letter, and 90-second breath
        reset will port from the static demo — still fully on-device.
      </Text>
      <Text style={{ color: c.accent, fontSize: 14, fontWeight: '600' }}>
        Crisis resources stay visible without signing in.
      </Text>
    </Screen>
  );
}
