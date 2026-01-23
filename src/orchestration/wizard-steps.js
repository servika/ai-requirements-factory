import { AGENT_PROMPTS } from '../prompts/index.js';

/**
 * Define wizard steps configuration
 */
export function createWizardSteps(state) {
  return [
    {
      id: 'businessAnalyst',
      name: 'Requirements & User Stories',
      prompt: AGENT_PROMPTS.businessAnalyst,
      getInput: () => state.getSystemDescription(),
      saveKey: 'requirements'
    },
    {
      id: 'requirementsReviewer',
      name: 'Requirements Review',
      prompt: AGENT_PROMPTS.requirementsReviewer,
      getInput: () => state.getOutput('requirements'),
      saveKey: 'requirementsReview',
      // Auto-feedback configuration: run this step automatically,
      // use its output as feedback to regenerate a previous step
      autoFeedback: {
        targetStepIndex: 0,  // Feed back to step 0 (Business Analyst)
        targetSaveKey: 'requirements'  // The output key to regenerate
      }
    },
    {
      id: 'technicalArchitect',
      name: 'Technical Architecture & Stack',
      prompt: AGENT_PROMPTS.technicalArchitect,
      getInput: () => state.getOutput('requirements') + '\n\n' + state.getOutput('requirementsReview'),
      saveKey: 'architecture'
    },
    {
      id: 'technicalDesigner',
      name: 'Technical Design & API Specification',
      prompt: AGENT_PROMPTS.technicalDesigner,
      getInput: () => (
        '=== REQUIREMENTS & USER STORIES ===\n\n' +
        (state.getOutput('requirements') || '') +
        '\n\n=== REQUIREMENTS REVIEW ===\n\n' +
        (state.getOutput('requirementsReview') || '') +
        '\n\n=== TECHNICAL ARCHITECTURE ===\n\n' +
        (state.getOutput('architecture') || '')
      ),
      saveKey: 'technicalDesign'
    },
    {
      id: 'testingStrategist',
      name: 'Testing Strategy',
      prompt: AGENT_PROMPTS.testingStrategist,
      getInput: () => (
        '=== REQUIREMENTS & USER STORIES ===\n\n' +
        (state.getOutput('requirements') || '') +
        '\n\n=== TECHNICAL ARCHITECTURE ===\n\n' +
        (state.getOutput('architecture') || '') +
        '\n\n=== TECHNICAL DESIGN ===\n\n' +
        (state.getOutput('technicalDesign') || '')
      ),
      saveKey: 'testingStrategy'
    },
    {
      id: 'taskPlanner',
      name: 'Task Planner & Implementation Plan',
      prompt: AGENT_PROMPTS.taskPlanner,
      getInput: () => (
        '=== REQUIREMENTS & USER STORIES ===\n\n' +
        (state.getOutput('requirements') || '') +
        '\n\n=== REQUIREMENTS REVIEW ===\n\n' +
        (state.getOutput('requirementsReview') || '') +
        '\n\n=== TECHNICAL ARCHITECTURE & STACK ===\n\n' +
        (state.getOutput('architecture') || '') +
        '\n\n=== TECHNICAL DESIGN & API SPECIFICATION ===\n\n' +
        (state.getOutput('technicalDesign') || '') +
        '\n\n=== TESTING STRATEGY ===\n\n' +
        (state.getOutput('testingStrategy') || '')
      ),
      saveKey: 'taskPlanner'
    },
    {
      id: 'sdlcTaskAllocator',
      name: 'SDLC Task Allocation',
      prompt: AGENT_PROMPTS.sdlcTaskAllocator,
      getInput: () => ({
        systemDescription: state.getSystemDescription(),
        requirements: state.getOutput('requirements') || '',
        requirementsReview: state.getOutput('requirementsReview') || '',
        architecture: state.getOutput('architecture') || '',
        technicalDesign: state.getOutput('technicalDesign') || '',
        testingStrategy: state.getOutput('testingStrategy') || '',
        taskPlanner: state.getOutput('taskPlanner') || ''
      }),
      saveKey: 'sdlcTaskAllocation'
    },
    {
      id: 'agentTaskGenerator',
      name: 'Agent Task Generation',
      prompt: AGENT_PROMPTS.agentTaskGenerator,
      getInput: () => (
        '=== TECHNICAL ARCHITECTURE ===\n\n' +
        (state.getOutput('architecture') || '') +
        '\n\n=== TECHNICAL DESIGN ===\n\n' +
        (state.getOutput('technicalDesign') || '') +
        '\n\n=== SDLC TASK ALLOCATION ===\n\n' +
        (state.getOutput('sdlcTaskAllocation') || '')
      ),
      saveKey: 'agentTasks'
    }
  ];
}