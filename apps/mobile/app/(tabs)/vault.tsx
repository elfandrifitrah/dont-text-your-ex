import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, Kicker, QuietButton } from '@/components/ui';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/src/lib/progress';

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return (
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  );
}

export default function VaultScreen() {
  const c = Colors[useColorScheme()];
  const { progress, addLetter, deleteLetter } = useProgress();
  const [draft, setDraft] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  function save() {
    const ok = addLetter(draft, 'Written in the vault');
    if (!ok) {
      setNote("Write the thing you won't send — then save it here.");
      return;
    }
    setDraft('');
    setNote('Saved. It lives here now, not in their messages.');
  }

  return (
    <Screen title="Unsent Vault" subtitle="Everything you wisely didn't send.">
      <Card>
        <Kicker>Write it. Keep it. Don't send it.</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          Say the whole thing — here
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          An unsent letter gives the feeling somewhere to go that isn't their phone. Letters stay
          on this device.
        </Text>
        <TextInput
          multiline
          value={draft}
          onChangeText={(value) => setDraft(value.slice(0, 10_000))}
          placeholder="Dear you. Here's everything I'm not going to send…"
          placeholderTextColor={c.textMuted}
          textAlignVertical="top"
          style={{
            minHeight: 110,
            borderWidth: 1,
            borderColor: c.line,
            borderRadius: 12,
            padding: 12,
            color: c.text,
            backgroundColor: c.background,
            fontSize: 16,
            lineHeight: 22,
          }}
        />
        <QuietButton label="Save to vault" onPress={save} />
        {note ? <Text style={{ color: c.accentDeep, fontSize: 14 }}>{note}</Text> : null}
      </Card>

      <Card>
        <Kicker>Your vault</Kicker>
        {progress.letters.length === 0 ? (
          <View style={{ gap: 4, paddingVertical: 8 }}>
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '700' }}>
              Nothing here yet — good
            </Text>
            <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>
              The next 2am draft belongs in this vault, not in their messages.
            </Text>
          </View>
        ) : (
          progress.letters.map((letter) => {
            const open = openId === letter.id;
            const preview =
              letter.body.length > 110 ? `${letter.body.slice(0, 110)}…` : letter.body;
            return (
              <View
                key={letter.id}
                style={{ gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: c.line }}
              >
                <Text style={{ color: c.textMuted, fontSize: 12 }}>
                  {formatWhen(letter.createdAt)} · {letter.source}
                </Text>
                <Text style={{ color: c.text, fontSize: 15, lineHeight: 22 }}>
                  {open ? letter.body : preview}
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Pressable accessibilityRole="button" onPress={() => setOpenId(open ? null : letter.id)}>
                    <Text style={{ color: c.accent, fontWeight: '700' }}>
                      {open ? 'Show less' : 'Read it back'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      deleteLetter(letter.id);
                      setNote('Letter deleted.');
                    }}
                  >
                    <Text style={{ color: c.textMuted, fontWeight: '700' }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </Card>

      <Card>
        <Kicker>Kintsugi · Mended, not erased</Kicker>
        <Text style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>
          The crack is not the shame. It's the seam.
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          You don't have to pretend it didn't happen to prove you've healed. These letters are the
          gold in the repair.
        </Text>
      </Card>
    </Screen>
  );
}
