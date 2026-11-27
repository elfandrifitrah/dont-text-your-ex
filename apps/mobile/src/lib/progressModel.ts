import { addDays, todayISO } from '@/src/lib/dates';
import { MOODS, type Mood } from '@/src/content/plan';

const MAX_LETTERS = 80;
const MAX_BODY = 10_000;

export type Letter = {
  id: string;
  body: string;
  source: string;
  createdAt: string;
};

export type Progress = {
  version: 1;
  /** Local calendar date of day 1. */
  planStartDate: string;
  ended: string | null;
  triggers: string[];
  moods: Partial<Record<string, Mood>>;
  letters: Letter[];
  checklist: Partial<Record<string, boolean>>;
};

export function defaultProgress(today = todayISO()): Progress {
  return {
    version: 1,
    planStartDate: today,
    ended: null,
    triggers: [],
    moods: {},
    letters: [],
    checklist: {},
  };
}

function isMood(value: unknown): value is Mood {
  return typeof value === 'string' && (MOODS as readonly string[]).includes(value);
}

function isISODate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function sanitizeProgress(raw: unknown, today = todayISO()): Progress {
  const base = defaultProgress(today);
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Partial<Progress>;

  const moods: Progress['moods'] = {};
  if (data.moods && typeof data.moods === 'object') {
    for (const [date, mood] of Object.entries(data.moods)) {
      if (isISODate(date) && isMood(mood)) moods[date] = mood;
    }
  }

  const letters: Letter[] = [];
  if (Array.isArray(data.letters)) {
    for (const item of data.letters) {
      if (!item || typeof item !== 'object') continue;
      const letter = item as Partial<Letter>;
      if (typeof letter.id !== 'string' || !letter.id) continue;
      if (typeof letter.body !== 'string' || !letter.body.trim()) continue;
      letters.push({
        id: letter.id.slice(0, 80),
        body: letter.body.slice(0, MAX_BODY),
        source: typeof letter.source === 'string' && letter.source.trim()
          ? letter.source.slice(0, 80)
          : 'Vault',
        createdAt:
          typeof letter.createdAt === 'string' ? letter.createdAt : new Date().toISOString(),
      });
      if (letters.length >= MAX_LETTERS) break;
    }
  }

  const checklist: Progress['checklist'] = {};
  if (data.checklist && typeof data.checklist === 'object') {
    for (const [id, done] of Object.entries(data.checklist)) {
      if (typeof id === 'string' && id.length > 0 && id.length <= 40 && typeof done === 'boolean') {
        checklist[id] = done;
      }
    }
  }

  const triggers = Array.isArray(data.triggers)
    ? data.triggers.filter((item): item is string => typeof item === 'string' && item.length <= 40).slice(0, 8)
    : [];

  return {
    version: 1,
    planStartDate: isISODate(data.planStartDate) ? data.planStartDate : base.planStartDate,
    ended: typeof data.ended === 'string' && data.ended.length <= 40 ? data.ended : null,
    triggers,
    moods,
    letters,
    checklist,
  };
}

export function anchorForDay(day: number, today = todayISO()): string {
  const clamped = Math.max(1, Math.min(30, Math.round(day)));
  return addDays(today, -(clamped - 1));
}

export function newLetterId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const LIMITS = { maxLetters: MAX_LETTERS, maxBody: MAX_BODY };
