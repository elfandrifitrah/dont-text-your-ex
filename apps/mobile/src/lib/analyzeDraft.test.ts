import assert from 'node:assert/strict';
import { test } from 'node:test';

import { analyzeDraft, isLateNight, unsentLetter } from './analyzeDraft.ts';

test('a longing late-night draft is a hard stop', () => {
  const result = analyzeDraft('I miss you. Can we talk?', ['late']);
  assert.equal(result.kind, 'dont-send');
  assert.equal(result.title, "Don't send it.");
  assert.ok(result.score >= 4);
  assert.ok(result.signals.some((signal) => signal.title === "It's a longing message"));
  assert.ok(result.signals.some((signal) => signal.title === "Context: it's late at night"));
});

test('a short neutral note is parked, not waved through', () => {
  const result = analyzeDraft('Leaving your book with Sam tomorrow.', []);
  assert.equal(result.kind, 'park');
  assert.equal(result.title, 'Park it for 24 hours.');
  assert.equal(result.signals[0].title, 'No red-flag phrases detected');
});

test('questions, caps, and length stack without dropping the first signals', () => {
  const essay = `${'PLEASE CALL ME BACK? '.repeat(20)}ARE YOU THERE?`;
  const result = analyzeDraft(essay, []);
  assert.ok(result.signals.length <= 5);
  assert.ok(result.signals.some((signal) => signal.title === "It's full of questions"));
  assert.ok(result.score >= 4);
});

test('the unsent letter keeps the draft and the day', () => {
  const letter = unsentLetter('  I miss you  ', 4);
  assert.match(letter, /^Unsent — written for me/);
  assert.match(letter, /I miss you/);
  assert.match(letter, /Day 4 of 30/);
});

test('late night is the hours after 10pm and before 5am', () => {
  assert.equal(isLateNight(new Date(2026, 0, 1, 22, 0)), true);
  assert.equal(isLateNight(new Date(2026, 0, 1, 2, 15)), true);
  assert.equal(isLateNight(new Date(2026, 0, 1, 21, 59)), false);
  assert.equal(isLateNight(new Date(2026, 0, 1, 5, 0)), false);
});
