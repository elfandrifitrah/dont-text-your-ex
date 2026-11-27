import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, Kicker } from '@/components/ui';

const TOTAL = 90;

function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function BreathReset() {
  const c = Colors[useColorScheme()];
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL);
  const [phase, setPhase] = useState('Ready?');
  const [hint, setHint] = useState("Tap start when you're ready.");
  const [doneNote, setDoneNote] = useState<string | null>(null);
  const reduceRef = useRef(false);
  const scale = useRef(new Animated.Value(0.72)).current;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(TOTAL);
  const breathPhase = useRef<'in' | 'hold' | 'out' | 'idle'>('idle');

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) reduceRef.current = enabled;
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reduceRef.current = enabled;
    });
    return () => {
      active = false;
      subscription.remove();
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function pulse(to: number) {
    if (reduceRef.current) return;
    Animated.timing(scale, {
      toValue: to,
      duration: 3800,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }

  function stop(done: boolean) {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    breathPhase.current = 'idle';
    remainingRef.current = TOTAL;
    setRunning(false);
    setRemaining(TOTAL);
    setPhase(done ? 'Urge survived' : 'Ready?');
    setHint(
      done
        ? 'Ninety seconds, done. Re-read your draft — notice it has less power now?'
        : "Tap start when you're ready.",
    );
    setDoneNote(done ? 'Reset complete. The draft can wait — probably forever.' : null);
    scale.setValue(0.72);
  }

  function tick() {
    remainingRef.current -= 0.25;
    if (remainingRef.current <= 0) {
      stop(true);
      return;
    }
    setRemaining(remainingRef.current);
    const elapsed = TOTAL - remainingRef.current;
    const cycle = elapsed % 12;
    if (cycle < 4) {
      setPhase('Breathe in');
      if (breathPhase.current !== 'in') {
        breathPhase.current = 'in';
        pulse(1);
      }
    } else if (cycle < 8) {
      setPhase('Hold');
      breathPhase.current = 'hold';
    } else {
      setPhase('Let it go');
      if (breathPhase.current !== 'out') {
        breathPhase.current = 'out';
        pulse(0.72);
      }
    }
  }

  function toggle() {
    if (running) {
      stop(false);
      return;
    }
    setDoneNote(null);
    setRunning(true);
    remainingRef.current = TOTAL;
    setRemaining(TOTAL);
    setHint('Follow the circle. Nothing else to do for 90 seconds.');
    breathPhase.current = 'idle';
    timer.current = setInterval(tick, 250);
    tick();
  }

  return (
    <Card>
      <Kicker>90-second reset</Kicker>
      <Text style={[styles.title, { color: c.text }]}>Outlast the urge</Text>
      <Text style={[styles.body, { color: c.textMuted }]}>
        An urge peaks around 45 seconds and fades by 90. You don't have to defeat the wave. You
        only have to not text while you're on top of it.
      </Text>
      <View style={styles.row}>
        <Animated.View
          style={[
            styles.circle,
            { borderColor: c.accent, backgroundColor: c.background, transform: [{ scale }] },
          ]}
        >
          <Text style={[styles.phase, { color: c.text }]}>{phase}</Text>
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.time, { color: c.text }]}>{formatTime(remaining)}</Text>
          <Text style={[styles.body, { color: c.textMuted }]}>{hint}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={toggle}
        style={[styles.button, { borderColor: c.line }]}
      >
        <Text style={[styles.buttonLabel, { color: c.text }]}>
          {running ? 'Stop' : 'Start breathing'}
        </Text>
      </Pressable>
      {doneNote ? <Text style={[styles.body, { color: c.accentDeep }]}>{doneNote}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  circle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  phase: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  time: { fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
  button: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonLabel: { fontWeight: '700', fontSize: 15 },
});
