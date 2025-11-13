import chalk from 'chalk';
import { COLORS } from '../config/constants.js';

/**
 * Display utilities for formatted console output
 */
export class Display {
  /**
   * Display the wizard banner
   */
  static showBanner() {
    console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║             AI Agent Wizard - Software Development Lifecycle               ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════════════════════╝\n'));

    console.log(chalk.white('This wizard will guide you through:\n'));
    console.log(chalk.white('  1. Requirements & User Stories (Business Analyst)'));
    console.log(chalk.white('  2. Requirements Review (Requirements Reviewer)'));
    console.log(chalk.white('  3. Technical Architecture & Stack (Technical Architect)'));
    console.log(chalk.white('  4. Technical Design & API Specs (Technical Designer)'));
    console.log(chalk.white('  5. Testing Strategy (Testing Strategist)\n'));
  }

  /**
   * Display formatted output with header
   */
  static showOutput(title, content) {
    console.log('\n' + chalk.cyan('='.repeat(80)));
    console.log(chalk.cyan.bold(`  ${title}`));
    console.log(chalk.cyan('='.repeat(80)) + '\n');
    console.log(content);
    console.log('\n' + chalk.cyan('='.repeat(80)) + '\n');
  }

  /**
   * Display step header
   */
  static showStepHeader(stepNumber, totalSteps, stepName) {
    console.log(chalk.magenta(`\n${'─'.repeat(80)}`));
    console.log(chalk.magenta.bold(`  Step ${stepNumber}/${totalSteps}: ${stepName}`));
    console.log(chalk.magenta(`${'─'.repeat(80)}\n`));
  }

  /**
   * Display review options
   */
  static showReviewOptions() {
    console.log(chalk.yellow('\nPlease review the output above.\n'));
    console.log(chalk.white('Options:'));
    console.log(chalk.green('  1. Accept and continue to next step'));
    console.log(chalk.blue('  2. Request changes (provide feedback)'));
    console.log(chalk.red('  3. Quit wizard\n'));
  }

  /**
   * Display completion message
   */
  static showCompletion() {
    console.log(chalk.green.bold('\n╔════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green.bold('║                     Wizard Completed Successfully!                         ║'));
    console.log(chalk.green.bold('╚════════════════════════════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Display file saved message
   */
  static showFileSaved(filepath) {
    console.log(chalk.gray(`\nSaved to: ${filepath}`));
  }

  /**
   * Display info message
   */
  static info(message) {
    console.log(chalk.white(message));
  }

  /**
   * Display success message
   */
  static success(message) {
    console.log(chalk.green(message));
  }

  /**
   * Display warning message
   */
  static warning(message) {
    console.log(chalk.yellow(message));
  }

  /**
   * Display error message
   */
  static error(message) {
    console.log(chalk.red(message));
  }

  /**
   * Display regeneration message
   */
  static showRegenerating() {
    console.log(chalk.blue('\nRegenerating with your feedback...\n'));
  }

  /**
   * Display termination message
   */
  static showTermination() {
    console.log(chalk.yellow('\nWizard terminated by user.'));
  }
}