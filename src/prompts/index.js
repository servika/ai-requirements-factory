/**
 * Prompt module exports
 */

import { businessAnalystPrompt } from './01-business-analyst.js';
import { requirementsReviewerPrompt } from './02-requirements-reviewer.js';
import { technicalArchitectPrompt } from './03-technical-architect.js';
import { technicalDesignerPrompt } from './04-technical-designer.js';
import { testingStrategistPrompt } from './05-testing-strategist.js';
import { taskPlannerPrompt } from './06-task-planner.js';
import { sdlcTaskAllocatorPrompt } from './07-sdlc-task-allocator.js';
import { agentTaskGeneratorPrompt } from './08-agent-task-generator.js';

export const AGENT_PROMPTS = {
  businessAnalyst: businessAnalystPrompt,
  requirementsReviewer: requirementsReviewerPrompt,
  technicalArchitect: technicalArchitectPrompt,
  technicalDesigner: technicalDesignerPrompt,
  testingStrategist: testingStrategistPrompt,
  taskPlanner: taskPlannerPrompt,
  sdlcTaskAllocator: sdlcTaskAllocatorPrompt,
  agentTaskGenerator: agentTaskGeneratorPrompt
};

export {
  businessAnalystPrompt,
  requirementsReviewerPrompt,
  technicalArchitectPrompt,
  technicalDesignerPrompt,
  testingStrategistPrompt,
  taskPlannerPrompt,
  sdlcTaskAllocatorPrompt,
  agentTaskGeneratorPrompt
};