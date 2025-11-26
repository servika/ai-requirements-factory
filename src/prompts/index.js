/**
 * Prompt module exports
 */

import { businessAnalystPrompt } from './business-analyst.js';
import { requirementsReviewerPrompt } from './requirements-reviewer.js';
import { technicalArchitectPrompt } from './technical-architect.js';
import { technicalDesignerPrompt } from './technical-designer.js';
import { testingStrategistPrompt } from './testing-strategist.js';
import { taskPlannerPrompt } from './task-planner.js';
import * as sdlcTaskAllocator from './sdlc-task-allocator.js';

export const AGENT_PROMPTS = {
  businessAnalyst: businessAnalystPrompt,
  requirementsReviewer: requirementsReviewerPrompt,
  technicalArchitect: technicalArchitectPrompt,
  technicalDesigner: technicalDesignerPrompt,
  testingStrategist: testingStrategistPrompt,
  taskPlanner: taskPlannerPrompt,
  sdlcTaskAllocator: sdlcTaskAllocator
};

export {
  businessAnalystPrompt,
  requirementsReviewerPrompt,
  technicalArchitectPrompt,
  technicalDesignerPrompt,
  testingStrategistPrompt,
  taskPlannerPrompt,
  sdlcTaskAllocator
};