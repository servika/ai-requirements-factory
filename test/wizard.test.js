import assert from 'node:assert/strict';
import { test, mock, describe, beforeEach, afterEach } from 'node:test';

/**
 * Tests for Wizard orchestration logic
 * 
 * Note: These tests verify the logic structure without actually calling the API.
 * Integration tests with real API calls should be run separately.
 */

describe('Wizard Auto-Feedback Configuration', () => {
  test('requirementsReviewer step has autoFeedback configuration', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    const steps = createWizardSteps(state);
    
    // Find the requirements reviewer step
    const reviewerStep = steps.find(s => s.id === 'requirementsReviewer');
    
    assert.ok(reviewerStep, 'requirementsReviewer step should exist');
    assert.ok(reviewerStep.autoFeedback, 'requirementsReviewer should have autoFeedback config');
    assert.equal(reviewerStep.autoFeedback.targetStepIndex, 0, 'should target step 0 (businessAnalyst)');
    assert.equal(reviewerStep.autoFeedback.targetSaveKey, 'requirements', 'should target requirements output');
  });

  test('other steps do not have autoFeedback configuration', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    const steps = createWizardSteps(state);
    
    // All steps except requirementsReviewer should NOT have autoFeedback
    const stepsWithAutoFeedback = steps.filter(s => s.autoFeedback);
    
    assert.equal(stepsWithAutoFeedback.length, 1, 'only one step should have autoFeedback');
    assert.equal(stepsWithAutoFeedback[0].id, 'requirementsReviewer');
  });
});

describe('Wizard Step Context Propagation', () => {
  test('technicalDesigner receives requirements, review, and architecture', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    state.saveOutput('requirements', 'REQ_CONTENT');
    state.saveOutput('requirementsReview', 'REVIEW_CONTENT');
    state.saveOutput('architecture', 'ARCH_CONTENT');
    
    const steps = createWizardSteps(state);
    const designerStep = steps.find(s => s.id === 'technicalDesigner');
    
    const input = designerStep.getInput();
    
    assert.ok(input.includes('REQ_CONTENT'), 'should include requirements');
    assert.ok(input.includes('REVIEW_CONTENT'), 'should include requirements review');
    assert.ok(input.includes('ARCH_CONTENT'), 'should include architecture');
    assert.ok(input.includes('=== REQUIREMENTS & USER STORIES ==='), 'should have requirements header');
    assert.ok(input.includes('=== TECHNICAL ARCHITECTURE ==='), 'should have architecture header');
  });

  test('testingStrategist receives requirements, architecture, and design', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    state.saveOutput('requirements', 'REQ_CONTENT');
    state.saveOutput('architecture', 'ARCH_CONTENT');
    state.saveOutput('technicalDesign', 'DESIGN_CONTENT');
    
    const steps = createWizardSteps(state);
    const testingStep = steps.find(s => s.id === 'testingStrategist');
    
    const input = testingStep.getInput();
    
    assert.ok(input.includes('REQ_CONTENT'), 'should include requirements');
    assert.ok(input.includes('ARCH_CONTENT'), 'should include architecture');
    assert.ok(input.includes('DESIGN_CONTENT'), 'should include technical design');
  });

  test('agentTaskGenerator receives architecture, design, and allocation', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    state.saveOutput('architecture', 'ARCH_CONTENT');
    state.saveOutput('technicalDesign', 'DESIGN_CONTENT');
    state.saveOutput('sdlcTaskAllocation', 'ALLOC_CONTENT');
    
    const steps = createWizardSteps(state);
    const generatorStep = steps.find(s => s.id === 'agentTaskGenerator');
    
    const input = generatorStep.getInput();
    
    assert.ok(input.includes('ARCH_CONTENT'), 'should include architecture');
    assert.ok(input.includes('DESIGN_CONTENT'), 'should include technical design');
    assert.ok(input.includes('ALLOC_CONTENT'), 'should include SDLC allocation');
    assert.ok(input.includes('=== TECHNICAL ARCHITECTURE ==='), 'should have architecture header');
    assert.ok(input.includes('=== SDLC TASK ALLOCATION ==='), 'should have allocation header');
  });

  test('taskPlanner receives all previous outputs', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    state.saveOutput('requirements', 'REQ');
    state.saveOutput('requirementsReview', 'REVIEW');
    state.saveOutput('architecture', 'ARCH');
    state.saveOutput('technicalDesign', 'DESIGN');
    state.saveOutput('testingStrategy', 'TESTING');
    
    const steps = createWizardSteps(state);
    const plannerStep = steps.find(s => s.id === 'taskPlanner');
    
    const input = plannerStep.getInput();
    
    assert.ok(input.includes('REQ'), 'should include requirements');
    assert.ok(input.includes('REVIEW'), 'should include review');
    assert.ok(input.includes('ARCH'), 'should include architecture');
    assert.ok(input.includes('DESIGN'), 'should include design');
    assert.ok(input.includes('TESTING'), 'should include testing strategy');
  });

  test('sdlcTaskAllocator receives structured object with all outputs', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    state.setSystemDescription('SYS_DESC');
    state.saveOutput('requirements', 'REQ');
    state.saveOutput('requirementsReview', 'REVIEW');
    state.saveOutput('architecture', 'ARCH');
    state.saveOutput('technicalDesign', 'DESIGN');
    state.saveOutput('testingStrategy', 'TESTING');
    state.saveOutput('taskPlanner', 'TASKS');
    
    const steps = createWizardSteps(state);
    const allocatorStep = steps.find(s => s.id === 'sdlcTaskAllocator');
    
    const input = allocatorStep.getInput();
    
    assert.equal(typeof input, 'object', 'should return object');
    assert.equal(input.systemDescription, 'SYS_DESC');
    assert.equal(input.requirements, 'REQ');
    assert.equal(input.requirementsReview, 'REVIEW');
    assert.equal(input.architecture, 'ARCH');
    assert.equal(input.technicalDesign, 'DESIGN');
    assert.equal(input.testingStrategy, 'TESTING');
    assert.equal(input.taskPlanner, 'TASKS');
  });
});

describe('Wizard Step Order and IDs', () => {
  test('wizard has exactly 8 steps in correct order', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    const steps = createWizardSteps(state);
    
    assert.equal(steps.length, 8, 'should have 8 steps');
    
    const expectedIds = [
      'businessAnalyst',
      'requirementsReviewer',
      'technicalArchitect',
      'technicalDesigner',
      'testingStrategist',
      'taskPlanner',
      'sdlcTaskAllocator',
      'agentTaskGenerator'
    ];
    
    expectedIds.forEach((id, index) => {
      assert.equal(steps[index].id, id, `step ${index} should be ${id}`);
    });
  });

  test('all steps have required properties', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    const steps = createWizardSteps(state);
    
    steps.forEach((step, index) => {
      assert.ok(step.id, `step ${index} should have id`);
      assert.ok(step.name, `step ${index} should have name`);
      assert.ok(step.prompt, `step ${index} should have prompt`);
      assert.ok(typeof step.getInput === 'function', `step ${index} should have getInput function`);
      assert.ok(step.saveKey, `step ${index} should have saveKey`);
    });
  });

  test('all step prompts have required methods', async () => {
    const { createWizardSteps } = await import('../src/orchestration/wizard-steps.js');
    const { WizardState } = await import('../src/orchestration/wizard-state.js');
    
    const state = new WizardState();
    const steps = createWizardSteps(state);
    
    steps.forEach((step, index) => {
      assert.ok(step.prompt.name, `step ${index} prompt should have name`);
      assert.ok(step.prompt.systemPrompt, `step ${index} prompt should have systemPrompt`);
      assert.ok(typeof step.prompt.getUserPrompt === 'function', `step ${index} prompt should have getUserPrompt function`);
    });
  });
});

describe('Prompt getUserPrompt with feedback', () => {
  test('businessAnalyst getUserPrompt handles feedback', async () => {
    const { businessAnalystPrompt } = await import('../src/prompts/01-business-analyst.js');
    
    const systemDescription = 'Build a todo app';
    const promptWithoutFeedback = businessAnalystPrompt.getUserPrompt(systemDescription);
    const promptWithFeedback = businessAnalystPrompt.getUserPrompt(systemDescription, 'Add more NFRs');
    
    assert.ok(promptWithoutFeedback.includes('todo app'), 'should include system description');
    assert.ok(promptWithFeedback.includes('Add more NFRs'), 'should include feedback');
    assert.notEqual(promptWithoutFeedback, promptWithFeedback, 'prompts should be different with feedback');
  });

  test('requirementsReviewer getUserPrompt handles requirements input', async () => {
    const { requirementsReviewerPrompt } = await import('../src/prompts/02-requirements-reviewer.js');
    
    const requirements = '# Requirements\n- User stories here';
    const prompt = requirementsReviewerPrompt.getUserPrompt(requirements);
    
    assert.ok(prompt.includes('User stories here'), 'should include requirements');
    assert.ok(prompt.includes('review'), 'should mention review');
  });

  test('technicalArchitect getUserPrompt handles combined input', async () => {
    const { technicalArchitectPrompt } = await import('../src/prompts/03-technical-architect.js');
    
    const combinedInput = '=== REQUIREMENTS ===\nReq content\n\n=== REVIEW ===\nReview content';
    const prompt = technicalArchitectPrompt.getUserPrompt(combinedInput);
    
    assert.ok(prompt.includes('Req content'), 'should include requirements');
    assert.ok(prompt.includes('Review content'), 'should include review');
  });
});
