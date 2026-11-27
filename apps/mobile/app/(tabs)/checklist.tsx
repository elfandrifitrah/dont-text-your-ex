import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { Screen } from '@/components/Screen';
import { Card, Kicker, QuietButton } from '@/components/ui';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { CHECKLIST, STUFF_SCRIPT } from '@/src/content/checklist';
import { useProgress } from '@/src/lib/progress';

export default function ChecklistScreen() {
  const c = Colors[useColorScheme()];
  const { progress, toggleChecklist } = useProgress();
  const [note, setNote] = useState<string | null>(null);
  const done = CHECKLIST.filter((item) => progress.checklist[item.id]).length;

  async function copyScript() {
    try {
      const ok = await Clipboard.setStringAsync(STUFF_SCRIPT);
      setNote(
        ok === false
          ? 'Copy didn’t work here — select the script and copy it.'
          : 'Script copied — fill in the brackets, send once, done.',
      );
    } catch {
      setNote('Copy didn’t work here — select the script and copy it.');
    }
  }

  return (
    <Screen
      title="Breakup admin"
      subtitle="Mute, subscriptions, scripts — hygiene, not drama."
    >
      <Card>
        <Kicker>Breakup admin</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          Untangle the practical stuff
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          The emotional work goes faster when the logistics stop ambushing you. {done} of{' '}
          {CHECKLIST.length} handled.
        </Text>
        {CHECKLIST.map((item) => {
          const checked = Boolean(progress.checklist[item.id]);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              onPress={() => toggleChecklist(item.id)}
              style={{
                flexDirection: 'row',
                gap: 12,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: c.line,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor: checked ? c.accent : c.line,
                  backgroundColor: checked ? c.accent : 'transparent',
                  marginTop: 2,
                }}
              />
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    color: c.text,
                    fontSize: 16,
                    fontWeight: '700',
                    textDecorationLine: checked ? 'line-through' : 'none',
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>{item.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </Card>

      <Card>
        <Kicker>Stuff-return script</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          One message. Logistics only.
        </Text>
        <Text selectable style={{ color: c.text, fontSize: 15, lineHeight: 22 }}>
          {STUFF_SCRIPT}
        </Text>
        <QuietButton label="Copy the script" onPress={copyScript} />
        {note ? <Text style={{ color: c.accentDeep, fontSize: 14 }}>{note}</Text> : null}
        <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>
          If even this feels like too much contact, a friend can send it. Asking for help here is
          allowed.
        </Text>
      </Card>
    </Screen>
  );
}
