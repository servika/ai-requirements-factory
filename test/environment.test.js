import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Environment } from '../src/config/environment.js';
import { CONFIG } from '../src/config/constants.js';

test('Environment resolves API key from env or argv', () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  try {
    process.env.ANTHROPIC_API_KEY = 'env-key';
    assert.equal(Environment.getApiKey(['node', 'script', 'arg-key']), 'env-key');

    delete process.env.ANTHROPIC_API_KEY;
    assert.equal(Environment.getApiKey(['node', 'script', 'arg-key']), 'arg-key');
  } finally {
    if (originalKey === undefined) {
      delete process.env.ANTHROPIC_API_KEY;
    } else {
      process.env.ANTHROPIC_API_KEY = originalKey;
    }
  }
});

test('Environment validates required configuration', () => {
  const originalKey = process.env.ANTHROPIC_API_KEY;

  try {
    delete process.env.ANTHROPIC_API_KEY;
    const result = Environment.validate();
    assert.equal(result.isValid, false);
    assert.ok(result.errors.includes('ANTHROPIC_API_KEY is required'));
  } finally {
    if (originalKey === undefined) {
      delete process.env.ANTHROPIC_API_KEY;
    } else {
      process.env.ANTHROPIC_API_KEY = originalKey;
    }
  }
});

test('Environment resolves model from env or defaults', () => {
  const originalModel = process.env.CLAUDE_MODEL;

  try {
    process.env.CLAUDE_MODEL = 'custom-model';
    assert.equal(Environment.getModel(), 'custom-model');

    delete process.env.CLAUDE_MODEL;
    assert.equal(Environment.getModel(), CONFIG.DEFAULT_MODEL);
  } finally {
    if (originalModel === undefined) {
      delete process.env.CLAUDE_MODEL;
    } else {
      process.env.CLAUDE_MODEL = originalModel;
    }
  }
});
