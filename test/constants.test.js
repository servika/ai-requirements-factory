import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sanitizeError } from '../src/config/constants.js';

test('sanitizeError returns raw messages in development', () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';

  try {
    const error = new Error('Boom');
    assert.equal(sanitizeError(error, 'fallback'), 'Boom');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test('sanitizeError maps known production errors', () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    const rateLimited = new Error('Too many');
    rateLimited.status = 429;
    assert.equal(
      sanitizeError(rateLimited),
      'Too many requests. Please wait a moment and try again.'
    );

    const unavailable = new Error('Down');
    unavailable.status = 503;
    assert.equal(
      sanitizeError(unavailable),
      'Service temporarily unavailable. Please try again in a moment.'
    );

    const networkError = new Error('Reset');
    networkError.code = 'ECONNRESET';
    assert.equal(
      sanitizeError(networkError),
      'Network connection error. Please check your connection and try again.'
    );

    const generic = new Error('Oops');
    assert.equal(sanitizeError(generic, 'fallback'), 'fallback');
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});
