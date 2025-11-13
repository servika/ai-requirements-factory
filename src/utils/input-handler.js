import readline from 'readline';
import chalk from 'chalk';
import { MENU_OPTIONS, CONFIG } from '../config/constants.js';

/**
 * User input handling utilities
 */
export class InputHandler {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Ask a question and get user input
   */
  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Get system description from user
   */
  async getSystemDescription() {
    console.log(chalk.yellow('Please provide a high-level description of the system you want to build:\n'));
    return this.ask(chalk.yellow('System Description: '));
  }

  /**
   * Get user review decision
   */
  async getReviewDecision() {
    const choice = await this.ask(chalk.yellow('Your choice (1/2/3): '));

    switch (choice) {
      case MENU_OPTIONS.ACCEPT:
        return { action: CONFIG.USER_ACTIONS.ACCEPT };

      case MENU_OPTIONS.REVISE:
        const feedback = await this.ask(chalk.yellow('Please provide your feedback: '));
        return { action: CONFIG.USER_ACTIONS.REVISE, feedback };

      case MENU_OPTIONS.QUIT:
        return { action: CONFIG.USER_ACTIONS.QUIT };

      default:
        console.log(chalk.red('Invalid choice. Please try again.'));
        return this.getReviewDecision();
    }
  }

  /**
   * Close the input handler
   */
  close() {
    this.rl.close();
  }
}