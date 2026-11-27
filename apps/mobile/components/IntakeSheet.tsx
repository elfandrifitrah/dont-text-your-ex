import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Chip, PrimaryButton } from '@/components/ui';
import { ENDED_OPTIONS, TRIGGER_OPTIONS, WHEN_OPTIONS } from '@/src/content/intake';

type Props = {
  visible: boolean;
  ended: string | null;
  triggers: string[];
  onClose: () => void;
  onApply: (input: { ended: string | null; whenDay: number | null; triggers: string[] }) => void;
};

export function IntakeSheet({ visible, ended, triggers, onClose, onApply }: Props) {
  const c = Colors[useColorScheme()];
  const [endedSel, setEndedSel] = useState<string | null>(ended);
  const [whenDay, setWhenDay] = useState<number | null>(null);
  const [triggerSel, setTriggerSel] = useState<string[]>(triggers);

  useEffect(() => {
    if (!visible) return;
    setEndedSel(ended);
    setTriggerSel(triggers);
    setWhenDay(null);
  }, [visible, ended, triggers]);

  function toggleTrigger(value: string) {
    setTriggerSel((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <Pressable
          style={[styles.sheet, { backgroundColor: c.background }]}
          onPress={(event) => event.stopPropagation()}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: c.text }]}>Tune your 30 days</Text>
            <Text style={[styles.lede, { color: c.textMuted }]}>
              Three questions. Your plan, streak start, and daily focus adjust to your answers.
            </Text>

            <Text style={[styles.q, { color: c.text }]}>Who ended it?</Text>
            <View style={styles.chips}>
              {ENDED_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={endedSel === option.value}
                  onPress={() => setEndedSel(option.value)}
                />
              ))}
            </View>

            <Text style={[styles.q, { color: c.text }]}>When was the breakup?</Text>
            <View style={styles.chips}>
              {WHEN_OPTIONS.map((option) => (
                <Chip
                  key={option.day}
                  label={option.label}
                  selected={whenDay === option.day}
                  onPress={() => setWhenDay(option.day)}
                />
              ))}
            </View>

            <Text style={[styles.q, { color: c.text }]}>What triggers the urge most?</Text>
            <View style={styles.chips}>
              {TRIGGER_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={triggerSel.includes(option.value)}
                  onPress={() => toggleTrigger(option.value)}
                />
              ))}
            </View>

            <PrimaryButton
              label="Build my plan"
              onPress={() => {
                onApply({ ended: endedSel, whenDay, triggers: triggerSel });
                onClose();
              }}
            />
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.ghost}>
              <Text style={[styles.ghostLabel, { color: c.textMuted }]}>Not now</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(33, 26, 21, 0.45)',
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: { padding: 20, gap: 10, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700' },
  lede: { fontSize: 15, lineHeight: 21 },
  q: { marginTop: 8, fontSize: 15, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ghost: { paddingVertical: 12, alignItems: 'center' },
  ghostLabel: { fontSize: 15, fontWeight: '600' },
});
