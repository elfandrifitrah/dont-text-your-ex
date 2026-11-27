/** On-device SOS heuristic. The draft never needs to leave the phone. */

export type Signal = { title: string; detail: string };

export type VerdictKind = 'dont-send' | 'park';

export type Analysis = {
  score: number;
  signals: Signal[];
  kind: VerdictKind;
  title: string;
  line: string;
};

export const SOS_CONTEXTS = [
  { id: 'late', label: "It's late at night" },
  { id: 'drinking', label: "I've been drinking" },
  { id: 'story', label: 'I just saw their post/story' },
  { id: 'miss', label: 'I just miss them' },
  { id: 'heard', label: 'Heard something about them' },
] as const;

export type SosContextId = (typeof SOS_CONTEXTS)[number]['id'];

function has(lower: string, phrases: string[]): string | null {
  for (const phrase of phrases) {
    if (lower.includes(phrase)) return phrase;
  }
  return null;
}

function verdictFor(score: number): Pick<Analysis, 'kind' | 'title' | 'line'> {
  if (score >= 4) {
    return {
      kind: 'dont-send',
      title: "Don't send it.",
      line: "This text is the urge talking, not you. In 24 hours you'll be relieved it's in the vault instead of their phone.",
    };
  }
  return {
    kind: 'park',
    title: 'Park it for 24 hours.',
    line: "Not the worst draft ever written — which is exactly why it's dangerous. If it still matters tomorrow at this time, the vault will hold it until then.",
  };
}

export function analyzeDraft(text: string, ctx: readonly string[]): Analysis {
  const lower = text.toLowerCase();
  const signals: Signal[] = [];
  let score = 0;
  let hit: string | null;

  if ((hit = has(lower, ['miss you', 'miss u', 'i miss']))) {
    signals.push({
      title: "It's a longing message",
      detail: `“…${hit}…” tells them you're still available — and restarts your day count at zero.`,
    });
    score += 3;
  }
  if ((hit = has(lower, ['sorry', 'forgive', 'my fault']))) {
    signals.push({
      title: "It's an apology bid",
      detail: `“…${hit}…” — apologising to reopen the door is a negotiation, not closure. The vault version says it without the hook.`,
    });
    score += 2;
  }
  if ((hit = has(lower, ['one more chance', 'another chance', 'try again', 'get back']))) {
    signals.push({
      title: "It's asking for another chance",
      detail: `“…${hit}…” is a decision you're trying to make at your lowest moment. Day-31 you gets a vote first.`,
    });
    score += 3;
  }
  if ((hit = has(lower, ['just checking', "hope you're", 'hope you are', 'how are you']))) {
    signals.push({
      title: "It's a 'just checking in' text",
      detail: `“…${hit}…” is the socially acceptable disguise for the same urge. They know. You'll know at 3am.`,
    });
    score += 2;
  }
  if ((hit = has(lower, ['love you', 'still love']))) {
    signals.push({
      title: 'It says the L-word',
      detail: `“…${hit}…” handed to someone who isn't choosing you becomes a weight you carry, not a bridge.`,
    });
    score += 3;
  }
  if ((hit = has(lower, ['happy birthday', 'congrats', 'congratulations']))) {
    signals.push({
      title: "It's an occasion excuse",
      detail: `“…${hit}…” — birthdays and milestones are the classic loophole. The no-contact rule has no holiday clause.`,
    });
    score += 2;
  }
  if ((hit = has(lower, ['drunk', 'had a few', 'been drinking']))) {
    signals.push({
      title: "You say it yourself: you've been drinking",
      detail: `“…${hit}…” — nothing decided in this state has ever survived the morning.`,
    });
    score += 3;
  }

  const questions = (text.match(/\?/g) ?? []).length;
  if (questions >= 2) {
    signals.push({
      title: "It's full of questions",
      detail: `${questions} question marks — each one is a hook you'll stare at, waiting for an answer that controls your whole night.`,
    });
    score += 2;
  }

  const letters = text.replace(/[^A-Za-z]/g, '');
  if (letters.length > 12 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.6) {
    signals.push({
      title: "It's in ALL CAPS",
      detail:
        "Shouting in text form. Whatever this says, tomorrow-you will read it in a calmer voice — and wince.",
    });
    score += 2;
  }

  if (text.length > 240) {
    signals.push({
      title: "It's an essay, not a text",
      detail: `${text.length} characters. The longer the message, the more of your night it owns afterwards. Essays belong in the vault.`,
    });
    score += 2;
  }

  if (ctx.includes('late')) {
    signals.push({
      title: "Context: it's late at night",
      detail: 'Willpower is a daytime resource. Almost nobody is glad about a text sent after 10pm in week one.',
    });
    score += 2;
  }
  if (ctx.includes('drinking')) {
    signals.push({
      title: "Context: you've been drinking",
      detail: "Alcohol lowers the guard and raises the stakes. This decision is above tonight's pay grade.",
    });
    score += 3;
  }
  if (ctx.includes('story')) {
    signals.push({
      title: 'Context: triggered by their post',
      detail:
        "You're reacting to a highlight reel, not information. Seeing their story is the trigger — the text would be the relapse.",
    });
    score += 2;
  }
  if (ctx.includes('miss')) {
    signals.push({
      title: 'Context: you just miss them',
      detail: 'Missing them is the feeling. Texting is just the fastest way to make it last longer.',
    });
    score += 1;
  }
  if (ctx.includes('heard')) {
    signals.push({
      title: 'Context: second-hand news',
      detail:
        'Reacting to gossip about them puts your healing on their schedule. Their life is no longer your news feed.',
    });
    score += 2;
  }

  if (!signals.length) {
    signals.push({
      title: 'No red-flag phrases detected',
      detail:
        "Still: you're in a 30-day no-contact window, and you opened the SOS check instead of your messages. That pause is the product working.",
    });
    score += 1;
  }

  return { score, signals: signals.slice(0, 5), ...verdictFor(score) };
}

export function unsentLetter(text: string, day: number): string {
  return (
    'Unsent — written for me, not for them.\n\n' +
    text.trim() +
    `\n\nI'm keeping this instead of sending it, because sending it would hand my healing to someone who isn't part of it anymore. Day ${day} of 30. Still standing.`
  );
}

export function isLateNight(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 5;
}
