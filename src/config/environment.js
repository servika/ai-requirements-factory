import dotenv from 'dotenv';
import { CONFIG } from './constants.js';

// Load environment variables
dotenv.config();

/**
 * Environment configuration manager
 */
export class Environment {
  /**
   * Get Anthropic API key from environment or command line
   * @param {Array} argv - Command line arguments
   * @returns {string|null} - API key or null if not found
   */
  static getApiKey(argv = process.argv) {
    return process.env.ANTHROPIC_API_KEY || argv[2] || null;
  }

  /**
   * Get Claude model from environment or use default
   * @returns {string} - Model identifier
   */
  static getModel() {
    return process.env.CLAUDE_MODEL || CONFIG.DEFAULT_MODEL;
  }

  /**
   * Validate that all required environment variables are set
   * @returns {Object} - Validation result with isValid and errors
   */
  static validate() {
    const errors = [];
    const apiKey = this.getApiKey();

    if (!apiKey) {
      errors.push('ANTHROPIC_API_KEY is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      config: {
        apiKey,
        model: this.getModel()
      }
    };
  }

  /**
   * Display error message for missing configuration
   */
  static displayConfigError() {
    console.error('\n❌ Error: ANTHROPIC_API_KEY is required\n');
    console.log('Please provide your API key in one of these ways:\n');
    console.log('  1. Set environment variable: export ANTHROPIC_API_KEY=your_key');
    console.log('  2. Create a .env file with: ANTHROPIC_API_KEY=your_key');
    console.log('  3. Pass as argument: node index.js your_key\n');
  }
}