import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { BreathReset } from '@/components/BreathReset';
import { Screen } from '@/components/Screen';
import { Card, Chip, Kicker, PrimaryButton, QuietButton } from '@/components/ui';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {
  SOS_CONTEXTS,
  analyzeDraft,
  isLateNight,
  unsentLetter,
  type Analysis,
} from '@/src/lib/analyzeDraft';
import { useProgress } from '@/src/lib/progress';

export default function SosScreen() {
  const c = Colors[useColorScheme()];
  const { day, addLetter } = useProgress();
  const [draft, setDraft] = useState('');
  const [contexts, setContexts] = useState<string[]>(() => (isLateNight() ? ['late'] : []));
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setContexts((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setAnalysis(null);
    setSaved(false);
  }

  function check() {
    const text = draft.trim();
    if (!text) {
      setError("Paste the draft first — the one in your messages app.");
      setAnalysis(null);
      return;
    }
    setError(null);
    setSaved(false);
    setAnalysis(analyzeDraft(text, contexts));
  }

  function save() {
    const text = draft.trim();
    if (!text || !analysis) return;
    const ok = addLetter(unsentLetter(text, day), 'From an SOS check');
    if (!ok) return;
    setSaved(true);
    router.push('/(tabs)/vault');
  }

  return (
    <Screen
      title="SOS Check"
      subtitle="For the 2am draft. Especially for the 2am draft."
      showCrisisFooter
    >
      <Card>
        <Kicker>SOS · Should I send this?</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          Paste the draft. Breathe. Then decide.
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          Nothing you write here is sent. The check stays on this device. The draft is saved only
          if you put the unsent letter in the vault.
        </Text>
        <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }}>
          The message you're about to send
        </Text>
        <TextInput
          multiline
          value={draft}
          onChangeText={(value) => {
            setDraft(value.slice(0, 8000));
            setSaved(false);
            setAnalysis(null);
            setError(null);
          }}
          placeholder="e.g. I know I shouldn't be texting you but I just saw your story and I miss you. Can we just talk once?"
          placeholderTextColor={c.textMuted}
          textAlignVertical="top"
          style={{
            minHeight: 120,
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
        <Text style={{ color: c.textMuted, fontSize: 12 }}>{draft.length} characters</Text>
        <Text style={{ color: c.text, fontWeight: '700', fontSize: 13 }}>
          What's true right now? (optional)
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SOS_CONTEXTS.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={contexts.includes(item.id)}
              onPress={() => toggle(item.id)}
            />
          ))}
        </View>
        {error ? <Text style={{ color: c.accentDeep, fontSize: 14 }}>{error}</Text> : null}
        <PrimaryButton label="Get the verdict" onPress={check} />
      </Card>

      {analysis ? (
        <Card>
          <Kicker>The verdict</Kicker>
          <Text style={{ color: c.text, fontSize: 22, fontWeight: '800' }}>{analysis.title}</Text>
          <Text style={{ color: c.text, fontSize: 15, lineHeight: 22 }}>{analysis.line}</Text>
          {analysis.signals.map((signal) => (
            <Text key={signal.title} style={{ color: c.text, fontSize: 14, lineHeight: 20 }}>
              <Text style={{ fontWeight: '700' }}>{signal.title}. </Text>
              {signal.detail}
            </Text>
          ))}
          <QuietButton
            label={saved ? 'Saved to the vault' : 'Keep the unsent letter'}
            onPress={save}
          />
        </Card>
      ) : null}

      <BreathReset />
    </Screen>
  );
}
