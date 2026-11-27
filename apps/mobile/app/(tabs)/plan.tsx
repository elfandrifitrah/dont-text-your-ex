import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, Chip, Kicker } from '@/components/ui';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { intakeSummary } from '@/src/content/intake';
import { PHASES, PLAN_DAYS, WEEKS, phaseIndexForDay, weekIndexForDay } from '@/src/content/plan';
import { useProgress } from '@/src/lib/progress';

export default function PlanScreen() {
  const c = Colors[useColorScheme()];
  const { day, progress } = useProgress();
  const [week, setWeek] = useState(() => weekIndexForDay(day));
  useEffect(() => {
    setWeek(weekIndexForDay(day));
  }, [day]);
  const currentWeek = WEEKS[week];
  const phase = phaseIndexForDay(day);
  const days = PLAN_DAYS.map((entry, index) => ({ ...entry, day: index + 1 })).filter(
    (entry) => entry.day >= currentWeek.from && entry.day <= currentWeek.to,
  );

  return (
    <Screen
      title="Your 30 Days"
      subtitle="One focus a day. Small, finishable, compounding."
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {WEEKS.map((item, index) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={week === index}
            onPress={() => setWeek(index)}
          />
        ))}
      </View>

      <Card>
        <Kicker>{currentWeek.theme}</Kicker>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>{currentWeek.intro}</Text>
        {days.map((entry) => {
          const status = entry.day < day ? 'Done' : entry.day === day ? 'Today' : '';
          return (
            <View
              key={entry.day}
              style={{
                flexDirection: 'row',
                gap: 12,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: c.line,
              }}
            >
              <View style={{ width: 42 }}>
                <Text style={{ color: c.textMuted, fontSize: 11, fontWeight: '700' }}>DAY</Text>
                <Text style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>{entry.day}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: c.text, fontSize: 16, fontWeight: '700' }}>{entry.title}</Text>
                <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>{entry.body}</Text>
              </View>
              {status ? (
                <Text style={{ color: status === 'Today' ? c.accentDeep : c.textMuted, fontWeight: '700' }}>
                  {status}
                </Text>
              ) : null}
            </View>
          );
        })}
      </Card>

      <Card>
        <Kicker>The four phases</Kicker>
        <Text style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>
          Wilting is a phase, not the ending
        </Text>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          A breakup moves like a plant — same roots, different season. You are not stuck; you are
          in a stage.
        </Text>
        {PHASES.map((item, index) => (
          <View
            key={item.name}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 12,
              backgroundColor: index === phase ? c.background : 'transparent',
            }}
          >
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '700' }}>
              {item.name}{' '}
              <Text style={{ color: c.textMuted, fontSize: 13, fontWeight: '600' }}>{item.week}</Text>
            </Text>
            <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 20 }}>{item.body}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Kicker>Why 30 days</Kicker>
        <Text style={{ color: c.textMuted, fontSize: 15, lineHeight: 22 }}>
          Not magic — momentum. Thirty days is long enough for the nightly urge to lose its grip
          and for new routines to take the slot the relationship used to fill.{' '}
          {progress.ended || progress.triggers.length
            ? intakeSummary(progress.ended, progress.triggers)
            : 'Personalize the plan on Today if the breakup wasn’t this morning.'}
        </Text>
      </Card>
    </Screen>
  );
}
