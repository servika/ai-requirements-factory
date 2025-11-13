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
    }
  ];
}