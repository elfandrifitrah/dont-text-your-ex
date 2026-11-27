export type PlanDay = { title: string; body: string };

export const PLAN_DAYS: PlanDay[] = [
  {
    title: 'Mute everything',
    body: "Mute — don't just unfollow — their accounts and their closest friends'. Out of sight is not childish; it's strategy.",
  },
  {
    title: 'Tell one person',
    body: "Pick your no-contact witness. One friend who gets the 'I'm about to text them' call instead.",
  },
  {
    title: 'Box the evidence',
    body: 'Screenshots, gifts, the hoodie: one box, taped shut, out of the room. Not destroyed — just not within reach.',
  },
  {
    title: 'Rewrite the story',
    body: 'Write the honest version of the relationship, including the parts your 2am brain edits out. Keep it in the vault.',
  },
  {
    title: 'Sleep is the job',
    body: "The urge is worst when you're tired. Fixed wake time, phone charging outside the bedroom.",
  },
  {
    title: 'Delete the thread',
    body: 'Archive the chat so it stops ambushing you. The facts live in your notes now, not one tap away.',
  },
  {
    title: 'One-week mark',
    body: "Seven days. Note what actually helped this week — you'll reuse it in week 3, when motivation dips.",
  },
  {
    title: 'Audit your triggers',
    body: 'List the three moments the urge hit hardest. Each one gets a plan, not a pep talk.',
  },
  {
    title: 'Move on purpose',
    body: "Twenty minutes of walking counts. Movement metabolises the stress chemistry that feels like 'I must text them'.",
  },
  {
    title: 'The socials sweep',
    body: "Remove the 'just checking' routes: saved searches, their location sharing, the shared photo album alerts.",
  },
  {
    title: 'Feed the evenings',
    body: 'The danger window is after dinner. Book something — anything — into three evenings this week.',
  },
  {
    title: "Write the letter you'll never send",
    body: 'The full, unfiltered one. Vault it. Notice that sending was never the point; saying it was.',
  },
  {
    title: 'Two good hours',
    body: 'Stretch one absorbing activity to two hours. Attention is trainable, and it is the whole game.',
  },
  {
    title: 'Halfway Eve',
    body: 'Tomorrow is day 15. Write down how tonight-you differs from day-one-you. Specifics, not vibes.',
  },
  {
    title: 'Halfway',
    body: 'Fifteen days of evidence that you can feel it and not act on it. That is the entire skill.',
  },
  {
    title: 'Reconnect outward',
    body: "Message two friends who are not connected to your ex. Rebuild the social base that isn't shared.",
  },
  {
    title: 'Untangle the money',
    body: 'Shared subscriptions, split bills, the streaming login. Use the Admin list — logistics closure is emotional closure.',
  },
  {
    title: 'New territory',
    body: 'One place that has no memories attached becomes yours this week. A café, a route, a gym.',
  },
  {
    title: 'The dream journal',
    body: 'Breakup dreams spike around now. If you wake up wanting to text, write the dream down instead. It fades by breakfast.',
  },
  {
    title: 'Plan the hard day',
    body: 'Pick the upcoming day most likely to crack you — an anniversary, an event. Script it hour by hour.',
  },
  {
    title: 'Three-week mark',
    body: 'Check the streak like data. 21 days. What remains is habit, not hope — and habits can be changed.',
  },
  {
    title: 'Let one thing go',
    body: 'Delete one category of keepsake. The box gets smaller as you get bigger than it.',
  },
  {
    title: 'Say it out loud',
    body: 'Tell the story of the breakup to someone, start to finish, once. Hearing yourself tell it ends the rumination loop.',
  },
  {
    title: 'Future-self letter',
    body: 'Write to yourself on day 31. What do you want to be true? Seal it in the vault until then.',
  },
  {
    title: 'The contact test',
    body: 'If they reach out this week, you have 24 hours and the SOS check before any reply. No exceptions.',
  },
  {
    title: 'Reclaim a ritual',
    body: 'Take back one thing you did together and make it yours alone — the Sunday market, the running route.',
  },
  {
    title: 'Gratitude, honestly',
    body: 'Name two things the ending made possible. Not forced positivity — just the full ledger.',
  },
  {
    title: 'Prepare day 31',
    body: 'Decide now what happens after the 30 days: stay no-contact, or one calm, bounded conversation. Decide sober, not at 2am.',
  },
  {
    title: 'Read day one',
    body: "Open your day-4 honest story and your first unsent letter. Measure the distance you've travelled.",
  },
  {
    title: 'Day 30',
    body: "Thirty days. The urge may visit, but it no longer drives. Write the last vault letter: what you'd tell day-one you.",
  },
];

export const WEEKS = [
  {
    label: 'Week 1',
    theme: 'Week 1 · Stop the bleeding',
    intro: 'Cut every easy path back to them. Willpower loses to access, so remove the access.',
    from: 1,
    to: 7,
  },
  {
    label: 'Week 2',
    theme: 'Week 2 · Ride the waves',
    intro: 'The urge comes in waves now, not a flood. Learn your pattern and plan around it.',
    from: 8,
    to: 14,
  },
  {
    label: 'Week 3',
    theme: 'Week 3 · Rebuild the days',
    intro: 'Fill the slots the relationship used to occupy — with people, movement, and one absorbing project.',
    from: 15,
    to: 21,
  },
  {
    label: 'Week 4',
    theme: 'Week 4 · Close the loop',
    intro: 'Turn the story into something finished. Decide what day 31 looks like before you get there.',
    from: 22,
    to: 30,
  },
] as const;

export const PHASES = [
  {
    name: 'Wilt',
    week: 'Week 1 · Shock & urge',
    body: 'Everything droops. The urge to reach out is loudest here — so Week 1 removes access instead of relying on willpower.',
  },
  {
    name: 'Root',
    week: 'Week 2 · Waves',
    body: 'Nothing shows above ground yet, but sleep, food and one honest routine are roots going down. The waves still come — they just pass faster.',
  },
  {
    name: 'Bud',
    week: 'Week 3 · Rebuilding',
    body: "Energy returns in small, closed buds — a plan with friends, a place with no memories. Don't force it open; just keep showing up.",
  },
  {
    name: 'Bloom',
    week: 'Week 4 · Your life again',
    body: 'The flower is not “over it” theatre. It is proof the cracked ground was never the whole story — and Day 31 is yours to design.',
  },
] as const;

export function focusForDay(day: number): PlanDay {
  return PLAN_DAYS[Math.max(0, Math.min(29, day - 1))];
}

export function weekIndexForDay(day: number): number {
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  if (day <= 21) return 2;
  return 3;
}

export function phaseIndexForDay(day: number): number {
  return Math.min(3, Math.floor((Math.max(1, day) - 1) / 7));
}

export function streakLine(day: number, rawDay: number): string {
  if (rawDay > 30) {
    return 'The 30 days are done. The urge may still visit — the vault and the pause still work.';
  }
  if (day === 1) {
    return "Day one is the hardest signature you'll ever write. The SOS check exists for tonight.";
  }
  return `${day} days of not reopening the wound. The urge peaks at night — that's what the SOS check is for.`;
}

export const MOODS = ['Rough', 'Heavy', 'Steady', 'Lighter', 'Strong'] as const;
export type Mood = (typeof MOODS)[number];

export function moodReply(mood: Mood): string {
  switch (mood) {
    case 'Rough':
      return "Rough days are data, not failure. Lower every bar today except one: don't send the text.";
    case 'Heavy':
      return "Heavy is normal — let the plan carry you today. One small task from today's focus is enough.";
    case 'Steady':
      return 'Steady is the streak working. Bank it — steady days are what healing actually looks like.';
    case 'Lighter':
      return "Lighter. Notice that? The feeling moved without you texting anyone. That's the whole lesson.";
    case 'Strong':
      return 'Strong day. Write one line in the vault about what helped — future rough-day you will need it.';
  }
}
