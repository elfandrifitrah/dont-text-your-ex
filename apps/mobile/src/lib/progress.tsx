import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { clampDay, rawDayNumber, todayISO } from '@/src/lib/dates';
import {
  LIMITS,
  anchorForDay,
  defaultProgress,
  newLetterId,
  sanitizeProgress,
  type Letter,
  type Progress,
} from '@/src/lib/progressModel';
import type { Mood } from '@/src/content/plan';

const STORAGE_KEY = 'dtye.progress.v1';

type Api = {
  progress: Progress;
  today: string;
  day: number;
  rawDay: number;
  moodToday: Mood | null;
  setMood: (mood: Mood) => void;
  setIntake: (input: {
    ended: string | null;
    whenDay: number | null;
    triggers: string[];
  }) => void;
  addLetter: (body: string, source: string) => boolean;
  deleteLetter: (id: string) => void;
  toggleChecklist: (id: string) => void;
};

const ProgressContext = createContext<Api | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (!cancelled) setProgress(sanitizeProgress(parsed));
      } catch {
        if (!cancelled) setProgress(defaultProgress());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!progress) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
  }, [progress]);

  const update = useCallback((fn: (prev: Progress) => Progress) => {
    setProgress((prev) => (prev ? fn(prev) : prev));
  }, []);

  const api = useMemo<Api | null>(() => {
    if (!progress) return null;
    const today = todayISO();
    const rawDay = rawDayNumber(progress.planStartDate, today);
    return {
      progress,
      today,
      day: clampDay(rawDay),
      rawDay,
      moodToday: progress.moods[today] ?? null,
      setMood: (mood) => {
        const date = todayISO();
        update((prev) => ({ ...prev, moods: { ...prev.moods, [date]: mood } }));
      },
      setIntake: ({ ended, whenDay, triggers }) => {
        update((prev) => ({
          ...prev,
          ended,
          triggers: triggers.slice(0, 8),
          planStartDate:
            whenDay != null ? anchorForDay(whenDay, todayISO()) : prev.planStartDate,
        }));
      },
      addLetter: (body, source) => {
        const trimmed = body.trim();
        if (!trimmed) return false;
        const letter: Letter = {
          id: newLetterId(),
          body: trimmed.slice(0, LIMITS.maxBody),
          source: source.slice(0, 80) || 'Vault',
          createdAt: new Date().toISOString(),
        };
        update((prev) => ({
          ...prev,
          letters: [letter, ...prev.letters].slice(0, LIMITS.maxLetters),
        }));
        return true;
      },
      deleteLetter: (id) => {
        update((prev) => ({
          ...prev,
          letters: prev.letters.filter((letter) => letter.id !== id),
        }));
      },
      toggleChecklist: (id) => {
        update((prev) => ({
          ...prev,
          checklist: { ...prev.checklist, [id]: !prev.checklist[id] },
        }));
      },
    };
  }, [progress, update]);

  if (!api) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#d2431b" />
        <Text style={styles.loadingText}>Opening your day…</Text>
      </View>
    );
  }

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Api {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#f7f4ef',
  },
  loadingText: { color: '#6f6357', fontSize: 15 },
});
