import assert from 'node:assert/strict';
import { test } from 'node:test';

import { addDays, clampDay, rawDayNumber, todayISO } from './dates.ts';

test('todayISO uses the local calendar date', () => {
  assert.equal(todayISO(new Date(2026, 10, 27, 23, 30)), '2026-11-27');
});

test('raw day counts the anchor as day 1 and crosses month boundaries', () => {
  assert.equal(rawDayNumber('2026-11-27', '2026-11-27'), 1);
  assert.equal(rawDayNumber('2026-11-22', '2026-11-27'), 6);
  assert.equal(rawDayNumber('2026-10-29', '2026-11-27'), 30);
  assert.equal(rawDayNumber('2026-10-01', '2026-11-27'), 58);
});

test('addDays anchors a chosen day back to a start date', () => {
  assert.equal(addDays('2026-11-27', 0), '2026-11-27');
  assert.equal(addDays('2026-11-27', -5), '2026-11-22');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('clampDay stays inside the 30-day plan', () => {
  assert.equal(clampDay(0), 1);
  assert.equal(clampDay(1), 1);
  assert.equal(clampDay(30), 30);
  assert.equal(clampDay(58), 30);
});
