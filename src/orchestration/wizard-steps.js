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
      saveKey: 'requirementsReview'
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
      getInput: () => state.getOutput('architecture'),
      saveKey: 'technicalDesign'
    },
    {
      id: 'testingStrategist',
      name: 'Testing Strategy',
      prompt: AGENT_PROMPTS.testingStrategist,
      getInput: () => state.getOutput('technicalDesign'),
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
    }
  ];
}