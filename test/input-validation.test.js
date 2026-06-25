import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONFIG,
  validateSystemDescription,
  validateFeedback,
} from '../src/config/constants.js';

test('validateSystemDescription rejects non-string input', () => {
  assert.equal(validateSystemDescription(undefined).valid, false);
  assert.equal(validateSystemDescription(null).valid, false);
  assert.equal(validateSystemDescription(42).valid, false);
});

test('validateSystemDescription rejects too-short input', () => {
  const result = validateSystemDescription('   hi  ');
  assert.equal(result.valid, false);
  assert.match(result.error, /at least/);
});

test('validateSystemDescription rejects too-long input', () => {
  const tooLong = 'a'.repeat(CONFIG.INPUT.MAX_SYSTEM_DESCRIPTION_LENGTH + 1);
  const result = validateSystemDescription(tooLong);
  assert.equal(result.valid, false);
  assert.match(result.error, /exceed/);
});

test('validateSystemDescription trims and accepts valid input', () => {
  const result = validateSystemDescription('  A valid system description  ');
  assert.equal(result.valid, true);
  assert.equal(result.value, 'A valid system description');
});

test('validateFeedback accepts null/undefined as no feedback', () => {
  assert.deepEqual(validateFeedback(null), { valid: true, value: null });
  assert.deepEqual(validateFeedback(undefined), { valid: true, value: null });
});

test('validateFeedback rejects non-string, non-null input', () => {
  assert.equal(validateFeedback(123).valid, false);
});

test('validateFeedback rejects too-long feedback', () => {
  const tooLong = 'a'.repeat(CONFIG.INPUT.MAX_FEEDBACK_LENGTH + 1);
  const result = validateFeedback(tooLong);
  assert.equal(result.valid, false);
  assert.match(result.error, /exceed/);
});

test('validateFeedback accepts valid feedback', () => {
  const result = validateFeedback('Please add error handling');
  assert.equal(result.valid, true);
  assert.equal(result.value, 'Please add error handling');
});
