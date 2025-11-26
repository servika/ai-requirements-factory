import { BaseAgent } from '../../../src/agents/index.js';
import { AGENT_PROMPTS } from '../../../src/prompts/index.js';
import { CONFIG } from '../../../src/config/constants.js';

/**
 * Wizard service for executing agent steps
 */
export class WizardService {
  constructor(apiKey, model) {
    this.agent = new BaseAgent(apiKey, model);
    this.steps = [
      {
        id: 'businessAnalyst',
        name: 'Requirements & User Stories',
        prompt: AGENT_PROMPTS.businessAnalyst,
        saveKey: 'requirements',
      },
      {
        id: 'requirementsReviewer',
        name: 'Requirements Review',
        prompt: AGENT_PROMPTS.requirementsReviewer,
        saveKey: 'requirementsReview',
      },
      {
        id: 'technicalArchitect',
        name: 'Technical Architecture & Stack',
        prompt: AGENT_PROMPTS.technicalArchitect,
        saveKey: 'architecture',
      },
      {
        id: 'technicalDesigner',
        name: 'Technical Design & API Specification',
        prompt: AGENT_PROMPTS.technicalDesigner,
        saveKey: 'technicalDesign',
      },
      {
        id: 'testingStrategist',
        name: 'Testing Strategy',
        prompt: AGENT_PROMPTS.testingStrategist,
        saveKey: 'testingStrategy',
      },
      {
        id: 'taskPlanner',
        name: 'Task Planner & Implementation Plan',
        prompt: AGENT_PROMPTS.taskPlanner,
        saveKey: 'taskPlanner',
      },
      {
        id: 'sdlcTaskAllocator',
        name: 'SDLC Task Allocation',
        prompt: AGENT_PROMPTS.sdlcTaskAllocator,
        saveKey: 'sdlcTaskAllocation',
      },
    ];
  }

  /**
   * Get input for a specific step
   */
  getStepInput(stepIndex, session) {
    const step = this.steps[stepIndex];

    switch (step.id) {
      case 'businessAnalyst':
        return session.systemDescription;

      case 'requirementsReviewer':
        return session.outputs.requirements || '';

      case 'technicalArchitect':
        return (
          (session.outputs.requirements || '') +
          '\n\n' +
          (session.outputs.requirementsReview || '')
        );

      case 'technicalDesigner':
        // Technical Designer needs requirements + architecture for complete context
        return (
          '=== REQUIREMENTS & USER STORIES ===\n\n' +
          (session.outputs.requirements || '') +
          '\n\n=== REQUIREMENTS REVIEW ===\n\n' +
          (session.outputs.requirementsReview || '') +
          '\n\n=== TECHNICAL ARCHITECTURE & STACK ===\n\n' +
          (session.outputs.architecture || '')
        );

      case 'testingStrategist':
        // Testing Strategist needs full context from all previous steps
        return (
          '=== REQUIREMENTS & USER STORIES ===\n\n' +
          (session.outputs.requirements || '') +
          '\n\n=== REQUIREMENTS REVIEW ===\n\n' +
          (session.outputs.requirementsReview || '') +
          '\n\n=== TECHNICAL ARCHITECTURE & STACK ===\n\n' +
          (session.outputs.architecture || '') +
          '\n\n=== TECHNICAL DESIGN & API SPECIFICATION ===\n\n' +
          (session.outputs.technicalDesign || '')
        );

      case 'taskPlanner':
        // Task Planner needs ALL previous outputs to create accurate implementation plan
        return (
          '=== REQUIREMENTS & USER STORIES ===\n\n' +
          (session.outputs.requirements || '') +
          '\n\n=== REQUIREMENTS REVIEW ===\n\n' +
          (session.outputs.requirementsReview || '') +
          '\n\n=== TECHNICAL ARCHITECTURE & STACK ===\n\n' +
          (session.outputs.architecture || '') +
          '\n\n=== TECHNICAL DESIGN & API SPECIFICATION ===\n\n' +
          (session.outputs.technicalDesign || '') +
          '\n\n=== TESTING STRATEGY ===\n\n' +
          (session.outputs.testingStrategy || '')
        );

      case 'sdlcTaskAllocator':
        // SDLC Task Allocator needs ALL outputs to create role-specific tasks
        return {
          systemDescription: session.systemDescription,
          requirements: session.outputs.requirements || '',
          requirementsReview: session.outputs.requirementsReview || '',
          architecture: session.outputs.architecture || '',
          technicalDesign: session.outputs.technicalDesign || '',
          testingStrategy: session.outputs.testingStrategy || '',
          taskPlanner: session.outputs.taskPlanner || ''
        };

      default:
        return '';
    }
  }

  /**
   * Execute a step
   * @param {number} stepIndex - Index of the step to execute
   * @param {Object} session - Session data
   * @param {string} feedback - Optional feedback for revision
   * @param {Function} onRetry - Optional callback when retry occurs (attempt, error, delay)
   */
  async executeStep(stepIndex, session, feedback = null, onRetry = null) {
    const step = this.steps[stepIndex];
    const input = this.getStepInput(stepIndex, session);
    const userPrompt = step.prompt.getUserPrompt(input, feedback);

    console.log(`      📊 Input length: ${input.length} characters`);
    console.log(`      📋 Prompt length: ${userPrompt.length} characters`);
    console.log(`      🎯 Max tokens: ${CONFIG.MAX_TOKENS.COMPLEX}`);

    try {
      console.log(`      ⏳ Waiting for Claude API response...`);
      const output = await this.agent.execute(
        step.prompt.systemPrompt,
        userPrompt,
        CONFIG.MAX_TOKENS.COMPLEX,
        onRetry
      );

      console.log(`      ✨ Received response from Claude`);
      return output;
    } catch (error) {
      console.error(`      ❌ API Error:`, error.message);
      throw new Error(`Failed to execute ${step.name}: ${error.message}`);
    }
  }

  /**
   * Get step information
   */
  getStep(stepIndex) {
    return this.steps[stepIndex];
  }

  /**
   * Get all steps
   */
  getAllSteps() {
    return this.steps;
  }
}