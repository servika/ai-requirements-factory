import ora from 'ora';
import chalk from 'chalk';
import { BaseAgent } from '../agents/index.js';
import { WizardState } from './wizard-state.js';
import { createWizardSteps } from './wizard-steps.js';
import { Display, FileManager, InputHandler } from '../utils/index.js';
import { CONFIG } from '../config/constants.js';

/**
 * Main Wizard orchestrator for managing the multi-stage AI agent workflow
 */
export class Wizard {
  constructor(apiKey, model) {
    this.agent = new BaseAgent(apiKey, model);
    this.state = new WizardState();
    this.steps = createWizardSteps(this.state);
    this.fileManager = new FileManager();
    this.inputHandler = new InputHandler();
  }

  /**
   * Execute a single step of the wizard
   */
  async executeStep(stepIndex, feedback = null) {
    const step = this.steps[stepIndex];
    const spinner = ora(`${step.prompt.name} is working...`).start();

    try {
      const input = step.getInput();
      const userPrompt = step.prompt.getUserPrompt(input, feedback);

      const response = await this.agent.execute(
        step.prompt.systemPrompt,
        userPrompt,
        CONFIG.MAX_TOKENS.COMPLEX
      );

      spinner.succeed(chalk.green(`${step.prompt.name} completed`));

      return response;
    } catch (error) {
      spinner.fail(chalk.red(`${step.prompt.name} failed`));
      throw error;
    }
  }

  /**
   * Process a single step with iteration support
   */
  async processStep(stepIndex) {
    const step = this.steps[stepIndex];
    let stepCompleted = false;
    let feedback = null;

    Display.showStepHeader(stepIndex + 1, this.steps.length, step.name);

    while (!stepCompleted) {
      // Execute the step
      const output = await this.executeStep(stepIndex, feedback);
      this.state.saveOutput(step.saveKey, output);

      // Display output
      Display.showOutput(step.name, output);

      // Save to file
      const filepath = await this.fileManager.saveFile(`${stepIndex + 1}-${step.id}.md`, output);
      Display.showFileSaved(filepath);

      // Get user review
      Display.showReviewOptions();
      const review = await this.inputHandler.getReviewDecision();

      if (review.action === CONFIG.USER_ACTIONS.ACCEPT) {
        stepCompleted = true;
      } else if (review.action === CONFIG.USER_ACTIONS.REVISE) {
        feedback = review.feedback;
        Display.showRegenerating();
      } else if (review.action === CONFIG.USER_ACTIONS.QUIT) {
        return CONFIG.USER_ACTIONS.QUIT;
      }
    }

    return CONFIG.USER_ACTIONS.ACCEPT;
  }

  /**
   * Run the complete wizard
   */
  async run() {
    Display.showBanner();

    // Get system description
    const systemDescription = await this.inputHandler.getSystemDescription();

    if (!systemDescription) {
      Display.error('System description is required. Exiting.');
      this.inputHandler.close();
      return;
    }

    this.state.setSystemDescription(systemDescription);

    // Execute each step
    for (let i = 0; i < this.steps.length; i++) {
      this.state.setCurrentStep(i);

      const result = await this.processStep(i);

      if (result === CONFIG.USER_ACTIONS.QUIT) {
        Display.showTermination();
        await this.saveCompleteOutput();
        this.inputHandler.close();
        return;
      }
    }

    // Wizard completed
    Display.showCompletion();
    await this.saveCompleteOutput();
    Display.info('All outputs have been saved to the "output" directory.\n');

    this.inputHandler.close();
  }

  /**
   * Save complete output as a single document
   */
  async saveCompleteOutput() {
    const filepath = await this.fileManager.saveCompleteDocument(
      this.state.getSystemDescription(),
      this.state.getAllOutputs()
    );
    Display.showFileSaved(filepath);
  }
}