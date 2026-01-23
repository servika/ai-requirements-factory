import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

/**
 * Tests for Agent Prompt definitions
 * 
 * Verifies that all prompts are properly structured and contain expected content.
 */

describe('Agent Prompts Export', () => {
  test('AGENT_PROMPTS exports all 8 agents', async () => {
    const { AGENT_PROMPTS } = await import('../src/prompts/index.js');
    
    const expectedAgents = [
      'businessAnalyst',
      'requirementsReviewer',
      'technicalArchitect',
      'technicalDesigner',
      'testingStrategist',
      'taskPlanner',
      'sdlcTaskAllocator',
      'agentTaskGenerator'
    ];
    
    expectedAgents.forEach(agent => {
      assert.ok(AGENT_PROMPTS[agent], `AGENT_PROMPTS should export ${agent}`);
    });
  });
});

describe('Business Analyst Prompt', () => {
  test('has required structure', async () => {
    const { businessAnalystPrompt } = await import('../src/prompts/01-business-analyst.js');
    
    assert.ok(businessAnalystPrompt.name, 'should have name');
    assert.ok(businessAnalystPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof businessAnalystPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains BABOK methodology references', async () => {
    const { businessAnalystPrompt } = await import('../src/prompts/01-business-analyst.js');
    
    const prompt = businessAnalystPrompt.systemPrompt;
    
    assert.ok(prompt.includes('BABOK') || prompt.includes('Business Analysis'), 
      'should reference BABOK or Business Analysis');
    assert.ok(prompt.includes('User Story') || prompt.includes('user stories'), 
      'should mention user stories');
    assert.ok(prompt.includes('Acceptance Criteria') || prompt.includes('acceptance criteria'),
      'should mention acceptance criteria');
  });

  test('systemPrompt contains quality attribute references', async () => {
    const { businessAnalystPrompt } = await import('../src/prompts/01-business-analyst.js');
    
    const prompt = businessAnalystPrompt.systemPrompt;
    
    // Should contain Wiegers quality attributes or similar
    const qualityTerms = ['Unambiguous', 'Complete', 'Consistent', 'Verifiable', 'Traceable'];
    const hasQualityReferences = qualityTerms.some(term => prompt.includes(term));
    
    assert.ok(hasQualityReferences, 'should reference quality attributes');
  });

  test('getUserPrompt generates different output with feedback', async () => {
    const { businessAnalystPrompt } = await import('../src/prompts/01-business-analyst.js');
    
    const input = 'Build a task management app';
    const withoutFeedback = businessAnalystPrompt.getUserPrompt(input);
    const withFeedback = businessAnalystPrompt.getUserPrompt(input, 'Add security requirements');
    
    assert.notEqual(withoutFeedback, withFeedback, 'should generate different prompts');
    assert.ok(withFeedback.includes('security') || withFeedback.includes('feedback'), 
      'feedback version should reference the feedback');
  });
});

describe('Requirements Reviewer Prompt', () => {
  test('has required structure', async () => {
    const { requirementsReviewerPrompt } = await import('../src/prompts/02-requirements-reviewer.js');
    
    assert.ok(requirementsReviewerPrompt.name, 'should have name');
    assert.ok(requirementsReviewerPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof requirementsReviewerPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains review methodology', async () => {
    const { requirementsReviewerPrompt } = await import('../src/prompts/02-requirements-reviewer.js');
    
    const prompt = requirementsReviewerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('review') || prompt.includes('Review'), 'should mention review');
    assert.ok(prompt.includes('quality') || prompt.includes('Quality'), 'should mention quality');
  });

  test('systemPrompt contains gap analysis', async () => {
    const { requirementsReviewerPrompt } = await import('../src/prompts/02-requirements-reviewer.js');
    
    const prompt = requirementsReviewerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('gap') || prompt.includes('Gap') || prompt.includes('missing'),
      'should mention gap analysis or missing items');
  });
});

describe('Technical Architect Prompt', () => {
  test('has required structure', async () => {
    const { technicalArchitectPrompt } = await import('../src/prompts/03-technical-architect.js');
    
    assert.ok(technicalArchitectPrompt.name, 'should have name');
    assert.ok(technicalArchitectPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof technicalArchitectPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains SEI/architecture methodology', async () => {
    const { technicalArchitectPrompt } = await import('../src/prompts/03-technical-architect.js');
    
    const prompt = technicalArchitectPrompt.systemPrompt;
    
    // Should contain architecture methodology references
    const archTerms = ['ATAM', 'ADD', 'Quality Attribute', 'tradeoff', 'C4'];
    const hasArchReferences = archTerms.some(term => prompt.includes(term));
    
    assert.ok(hasArchReferences, 'should reference architecture methodologies');
  });

  test('systemPrompt mentions tradeoff analysis', async () => {
    const { technicalArchitectPrompt } = await import('../src/prompts/03-technical-architect.js');
    
    const prompt = technicalArchitectPrompt.systemPrompt;
    
    assert.ok(prompt.includes('tradeoff') || prompt.includes('Tradeoff') || prompt.includes('trade-off'),
      'should mention tradeoff analysis');
  });
});

describe('Technical Designer Prompt', () => {
  test('has required structure', async () => {
    const { technicalDesignerPrompt } = await import('../src/prompts/04-technical-designer.js');
    
    assert.ok(technicalDesignerPrompt.name, 'should have name');
    assert.ok(technicalDesignerPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof technicalDesignerPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains API design references', async () => {
    const { technicalDesignerPrompt } = await import('../src/prompts/04-technical-designer.js');
    
    const prompt = technicalDesignerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('API') || prompt.includes('endpoint'), 'should mention API design');
  });

  test('systemPrompt contains data model references', async () => {
    const { technicalDesignerPrompt } = await import('../src/prompts/04-technical-designer.js');
    
    const prompt = technicalDesignerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('data') || prompt.includes('schema') || prompt.includes('model'),
      'should mention data modeling');
  });
});

describe('Testing Strategist Prompt', () => {
  test('has required structure', async () => {
    const { testingStrategistPrompt } = await import('../src/prompts/05-testing-strategist.js');
    
    assert.ok(testingStrategistPrompt.name, 'should have name');
    assert.ok(testingStrategistPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof testingStrategistPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains test pyramid references', async () => {
    const { testingStrategistPrompt } = await import('../src/prompts/05-testing-strategist.js');
    
    const prompt = testingStrategistPrompt.systemPrompt;
    
    assert.ok(prompt.includes('pyramid') || prompt.includes('Pyramid') || 
              (prompt.includes('unit') && prompt.includes('integration')),
      'should mention test pyramid or test levels');
  });

  test('systemPrompt contains risk-based testing references', async () => {
    const { testingStrategistPrompt } = await import('../src/prompts/05-testing-strategist.js');
    
    const prompt = testingStrategistPrompt.systemPrompt;
    
    assert.ok(prompt.includes('risk') || prompt.includes('Risk'),
      'should mention risk-based testing');
  });
});

describe('Task Planner Prompt', () => {
  test('has required structure', async () => {
    const { taskPlannerPrompt } = await import('../src/prompts/06-task-planner.js');
    
    assert.ok(taskPlannerPrompt.name, 'should have name');
    assert.ok(taskPlannerPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof taskPlannerPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains WBS references', async () => {
    const { taskPlannerPrompt } = await import('../src/prompts/06-task-planner.js');
    
    const prompt = taskPlannerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('WBS') || prompt.includes('Work Breakdown') || prompt.includes('breakdown'),
      'should mention WBS or work breakdown');
  });

  test('systemPrompt contains MVP/prioritization references', async () => {
    const { taskPlannerPrompt } = await import('../src/prompts/06-task-planner.js');
    
    const prompt = taskPlannerPrompt.systemPrompt;
    
    assert.ok(prompt.includes('MVP') || prompt.includes('priority') || prompt.includes('Priority'),
      'should mention MVP or prioritization');
  });
});

describe('SDLC Task Allocator Prompt', () => {
  test('has required structure', async () => {
    const { sdlcTaskAllocatorPrompt } = await import('../src/prompts/07-sdlc-task-allocator.js');
    
    assert.ok(sdlcTaskAllocatorPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof sdlcTaskAllocatorPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains RACI references', async () => {
    const { sdlcTaskAllocatorPrompt } = await import('../src/prompts/07-sdlc-task-allocator.js');
    
    const prompt = sdlcTaskAllocatorPrompt.systemPrompt;
    
    assert.ok(prompt.includes('RACI') || prompt.includes('Responsible') || prompt.includes('Accountable'),
      'should mention RACI matrix');
  });

  test('systemPrompt contains role references', async () => {
    const { sdlcTaskAllocatorPrompt } = await import('../src/prompts/07-sdlc-task-allocator.js');
    
    const prompt = sdlcTaskAllocatorPrompt.systemPrompt;
    
    assert.ok(prompt.includes('role') || prompt.includes('Role') || prompt.includes('team'),
      'should mention roles or team');
  });

  test('getUserPrompt accepts object input', async () => {
    const { sdlcTaskAllocatorPrompt } = await import('../src/prompts/07-sdlc-task-allocator.js');
    
    const input = {
      systemDescription: 'Test system',
      requirements: 'Test requirements',
      requirementsReview: 'Test review',
      architecture: 'Test architecture',
      technicalDesign: 'Test design',
      testingStrategy: 'Test strategy',
      taskPlanner: 'Test tasks'
    };
    
    const prompt = sdlcTaskAllocatorPrompt.getUserPrompt(input);
    
    assert.ok(prompt.includes('Test system'), 'should include system description');
    assert.ok(prompt.includes('Test requirements'), 'should include requirements');
    assert.ok(prompt.includes('Test architecture'), 'should include architecture');
  });
});

describe('Agent Task Generator Prompt', () => {
  test('has required structure', async () => {
    const { agentTaskGeneratorPrompt } = await import('../src/prompts/08-agent-task-generator.js');
    
    assert.ok(agentTaskGeneratorPrompt.name, 'should have name');
    assert.ok(agentTaskGeneratorPrompt.systemPrompt, 'should have systemPrompt');
    assert.ok(typeof agentTaskGeneratorPrompt.getUserPrompt === 'function', 'should have getUserPrompt function');
  });

  test('systemPrompt contains prompt engineering references', async () => {
    const { agentTaskGeneratorPrompt } = await import('../src/prompts/08-agent-task-generator.js');
    
    const prompt = agentTaskGeneratorPrompt.systemPrompt;
    
    assert.ok(prompt.includes('prompt') || prompt.includes('Prompt') || prompt.includes('AI agent'),
      'should mention prompts or AI agents');
  });

  test('systemPrompt contains verification/review references', async () => {
    const { agentTaskGeneratorPrompt } = await import('../src/prompts/08-agent-task-generator.js');
    
    const prompt = agentTaskGeneratorPrompt.systemPrompt;
    
    assert.ok(prompt.includes('verification') || prompt.includes('Verification') || 
              prompt.includes('review') || prompt.includes('Review'),
      'should mention verification or review');
  });

  test('getUserPrompt handles string input', async () => {
    const { agentTaskGeneratorPrompt } = await import('../src/prompts/08-agent-task-generator.js');
    
    const input = 'SDLC allocation content here';
    const prompt = agentTaskGeneratorPrompt.getUserPrompt(input);
    
    assert.ok(prompt.includes('allocation') || prompt.includes('SDLC'), 
      'should process string input');
  });
});

describe('Prompt System Prompt Lengths', () => {
  test('all system prompts have substantial content', async () => {
    const { AGENT_PROMPTS } = await import('../src/prompts/index.js');
    
    // Each system prompt should have meaningful content (at least 500 chars)
    const minLength = 500;
    
    Object.entries(AGENT_PROMPTS).forEach(([name, prompt]) => {
      assert.ok(
        prompt.systemPrompt.length >= minLength,
        `${name} systemPrompt should have at least ${minLength} chars, has ${prompt.systemPrompt.length}`
      );
    });
  });
});
