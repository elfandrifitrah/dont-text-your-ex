import { Text } from 'react-native';

import { Screen } from '@/components/Screen';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function VaultScreen() {
  const c = Colors[useColorScheme()];

  return (
    <Screen
      title="Unsent Vault"
      subtitle="Everything you wisely didn't send."
    >
      <Text style={{ color: c.text, fontSize: 16, lineHeight: 24 }}>
        Letters will persist per-user in Firestore (`vaultLetters`) with
        ownership rules — not in anonymous public collections.
      </Text>
    </Screen>
  );
}
