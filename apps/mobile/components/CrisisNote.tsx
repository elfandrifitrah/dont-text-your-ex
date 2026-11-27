import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { CRISIS_COPY, CRISIS_LINKS } from '@/src/lib/crisis';

function smsHomeUrl(): string {
  return Platform.OS === 'android' ? 'sms:741741?body=HOME' : 'sms:741741&body=HOME';
}

export function CrisisNote() {
  const c = Colors[useColorScheme()];

  const open = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.copy, { color: c.crisis }]}>{CRISIS_COPY}</Text>
      <View style={styles.links}>
        <Pressable accessibilityRole="link" onPress={() => open(CRISIS_LINKS.phone988)}>
          <Text style={[styles.link, { color: c.accent }]}>Call 988</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => open(smsHomeUrl())}>
          <Text style={[styles.link, { color: c.accent }]}>Text HOME to 741741</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => open(CRISIS_LINKS.findAHelpline)}>
          <Text style={[styles.link, { color: c.accent }]}>findahelpline.org</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  copy: { fontSize: 12, lineHeight: 18 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  link: { fontSize: 13, fontWeight: '700' },
});
