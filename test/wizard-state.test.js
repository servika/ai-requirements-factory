import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WizardState } from '../src/orchestration/wizard-state.js';

test('WizardState stores and retrieves workflow data', () => {
  const state = new WizardState();

  state.setSystemDescription('Build a billing system');
  state.saveOutput('requirements', 'REQ');
  state.setCurrentStep(3);

  assert.equal(state.getSystemDescription(), 'Build a billing system');
  assert.equal(state.getOutput('requirements'), 'REQ');
  assert.deepEqual(state.getAllOutputs(), { requirements: 'REQ' });
  assert.equal(state.getCurrentStep(), 3);
});
