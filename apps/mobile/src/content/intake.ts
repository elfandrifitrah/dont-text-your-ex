export const ENDED_OPTIONS = [
  { value: 'They ended it', label: 'They ended it' },
  { value: 'I ended it', label: 'I ended it' },
  { value: 'It was mutual', label: 'Mutual' },
  { value: "It's complicated", label: "It's complicated" },
] as const;

export const WHEN_OPTIONS = [
  { day: 1, label: 'Today' },
  { day: 4, label: 'A few days ago' },
  { day: 8, label: 'About a week ago' },
  { day: 15, label: 'Two weeks ago' },
] as const;

export const TRIGGER_OPTIONS = [
  { value: 'late nights', label: 'Late nights' },
  { value: 'seeing their posts', label: 'Their posts & stories' },
  { value: 'drinking', label: 'Drinking' },
  { value: 'lonely weekends', label: 'Lonely weekends' },
  { value: 'shared places', label: 'Shared places & songs' },
] as const;

export function intakeSummary(ended: string | null, triggers: string[]): string {
  const bits: string[] = [];
  if (ended) bits.push(ended.toLowerCase());
  if (triggers.length) bits.push(`your triggers: ${triggers.join(', ')}`);
  if (!bits.length) {
    return 'Three quick questions tune the 30 days to your situation — who ended it, when, and what sets you off.';
  }
  return `Tuned to your situation — ${bits.join('; ')}. Reopen this any time to adjust.`;
}
