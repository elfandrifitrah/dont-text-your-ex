import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { Screen } from '@/components/Screen';
import { IntakeSheet } from '@/components/IntakeSheet';
import { Card, Chip, Kicker, PrimaryButton, QuietButton } from '@/components/ui';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { intakeSummary } from '@/src/content/intake';
import { MOODS, focusForDay, moodReply, streakLine } from '@/src/content/plan';
import { useProgress } from '@/src/lib/progress';

export default function TodayScreen() {
  const c = Colors[useColorScheme()];
  const { day, rawDay, moodToday, setMood, progress, setIntake } = useProgress();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const focus = focusForDay(day);
  const line = streakLine(day, rawDay);

  return (
    <Screen title={`Day ${day}`} subtitle={line}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: 30, now: day }}
        style={{ height: 8, borderRadius: 99, backgroundColor: c.line, overflow: 'hidden' }}
      >
        <View style={{ width: `${(day / 30) * 100}%`, height: '100%', backgroundColor: c.accent }} />
      </View>
      <Text style={{ color: c.textMuted, fontSize: 13 }}>{day} / 30 days · saved on this device</Text>

      <Card>
        <Kicker>Urge right now?</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          Draft it here first. Always.
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          Paste the message you're about to send and get a verdict, a version that's safe to keep,
          and a 90-second reset.
        </Text>
        <PrimaryButton
          label="Check a draft before you send it"
          onPress={() => router.push('/(tabs)/sos')}
        />
      </Card>

      <Card>
        <Kicker>{`Today's focus · Day ${day}`}</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>{focus.title}</Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>{focus.body}</Text>
      </Card>

      <Card>
        <Kicker>Daily check-in</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>How raw is today?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {MOODS.map((mood) => (
            <Chip
              key={mood}
              label={mood}
              selected={moodToday === mood}
              onPress={() => setMood(mood)}
            />
          ))}
        </View>
        {moodToday ? (
          <Text style={{ color: c.text, fontSize: 15, lineHeight: 22 }}>{moodReply(moodToday)}</Text>
        ) : null}
      </Card>

      <Card>
        <Kicker>Make it yours</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          A plan built around your triggers
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          {intakeSummary(progress.ended, progress.triggers)}
        </Text>
        <QuietButton label="Personalize my plan" onPress={() => setIntakeOpen(true)} />
      </Card>

      <IntakeSheet
        visible={intakeOpen}
        ended={progress.ended}
        triggers={progress.triggers}
        onClose={() => setIntakeOpen(false)}
        onApply={setIntake}
      />
    </Screen>
  );
}
