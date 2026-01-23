import assert from 'node:assert/strict';
import { test } from 'node:test';
import sdlcTaskAllocatorPromptDefault, {
  getUserPrompt,
  systemPrompt,
  sdlcTaskAllocatorPrompt
} from '../src/prompts/07-sdlc-task-allocator.js';

test('sdlc task allocator prompt exports are wired', () => {
  assert.equal(sdlcTaskAllocatorPromptDefault, sdlcTaskAllocatorPrompt);
  assert.equal(sdlcTaskAllocatorPrompt.systemPrompt, systemPrompt);
  assert.equal(sdlcTaskAllocatorPrompt.getUserPrompt, getUserPrompt);
});

test('getUserPrompt injects all inputs into the template', () => {
  const inputs = {
    systemDescription: 'SYS DESC',
    requirements: 'REQS',
    requirementsReview: 'REVIEW',
    architecture: 'ARCH',
    technicalDesign: 'DESIGN',
    testingStrategy: 'TEST',
    taskPlanner: 'TASKS'
  };

  const prompt = getUserPrompt(inputs);

  assert.ok(prompt.includes('Based on the comprehensive project documentation'));
  assert.ok(prompt.includes('# PROJECT OVERVIEW'));
  assert.ok(prompt.includes('SYS DESC'));
  assert.ok(prompt.includes('# REQUIREMENTS & USER STORIES'));
  assert.ok(prompt.includes('REQS'));
  assert.ok(prompt.includes('# REQUIREMENTS REVIEW & GAP ANALYSIS'));
  assert.ok(prompt.includes('REVIEW'));
  assert.ok(prompt.includes('# SYSTEM ARCHITECTURE'));
  assert.ok(prompt.includes('ARCH'));
  assert.ok(prompt.includes('# TECHNICAL DESIGN SPECIFICATIONS'));
  assert.ok(prompt.includes('DESIGN'));
  assert.ok(prompt.includes('# TESTING STRATEGY'));
  assert.ok(prompt.includes('TEST'));
  assert.ok(prompt.includes('# TASK BREAKDOWN & IMPLEMENTATION ROADMAP'));
  assert.ok(prompt.includes('TASKS'));
  assert.ok(prompt.includes('# YOUR TASK'));
});

test('prepareForAgentTaskGenerator passes through allocation', () => {
  const allocation = 'ALLOC';
  assert.equal(
    sdlcTaskAllocatorPrompt.prepareForAgentTaskGenerator(allocation),
    allocation
  );
});

