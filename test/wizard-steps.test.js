import assert from 'node:assert/strict';
import { test } from 'node:test';
import { WizardState } from '../src/orchestration/wizard-state.js';
import { createWizardSteps } from '../src/orchestration/wizard-steps.js';

test('createWizardSteps wires inputs across the workflow', () => {
  const state = new WizardState();
  state.setSystemDescription('SYS');
  state.saveOutput('requirements', 'REQ');
  state.saveOutput('requirementsReview', 'REVIEW');
  state.saveOutput('architecture', 'ARCH');
  state.saveOutput('technicalDesign', 'DESIGN');
  state.saveOutput('testingStrategy', 'TEST');
  state.saveOutput('taskPlanner', 'TASK');
  state.saveOutput('sdlcTaskAllocation', 'ALLOC');

  const steps = createWizardSteps(state);

  assert.equal(steps.length, 8);
  assert.equal(steps[0].id, 'businessAnalyst');
  assert.equal(steps[7].id, 'agentTaskGenerator');

  assert.equal(steps[0].getInput(), 'SYS');
  assert.equal(steps[2].getInput(), 'REQ\n\nREVIEW');

  const plannerInput = steps[5].getInput();
  assert.ok(plannerInput.includes('=== REQUIREMENTS & USER STORIES ==='));
  assert.ok(plannerInput.includes('REQ'));
  assert.ok(plannerInput.includes('=== TESTING STRATEGY ==='));
  assert.ok(plannerInput.includes('TEST'));

  assert.deepEqual(steps[6].getInput(), {
    systemDescription: 'SYS',
    requirements: 'REQ',
    requirementsReview: 'REVIEW',
    architecture: 'ARCH',
    technicalDesign: 'DESIGN',
    testingStrategy: 'TEST',
    taskPlanner: 'TASK'
  });

  // Technical Designer receives requirements, review, and architecture
  const designerInput = steps[3].getInput();
  assert.ok(designerInput.includes('=== REQUIREMENTS & USER STORIES ==='));
  assert.ok(designerInput.includes('=== TECHNICAL ARCHITECTURE ==='));
  assert.ok(designerInput.includes('ARCH'));

  // Testing Strategist receives requirements, architecture, and design
  const testingInput = steps[4].getInput();
  assert.ok(testingInput.includes('=== REQUIREMENTS & USER STORIES ==='));
  assert.ok(testingInput.includes('=== TECHNICAL DESIGN ==='));
  assert.ok(testingInput.includes('DESIGN'));

  // Agent Task Generator receives architecture, design, and allocation
  const agentInput = steps[7].getInput();
  assert.ok(agentInput.includes('=== TECHNICAL ARCHITECTURE ==='));
  assert.ok(agentInput.includes('=== TECHNICAL DESIGN ==='));
  assert.ok(agentInput.includes('=== SDLC TASK ALLOCATION ==='));
  assert.ok(agentInput.includes('ALLOC'));
});
