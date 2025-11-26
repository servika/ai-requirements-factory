import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../config/constants.js';

/**
 * Base AI Agent class for interacting with Claude API
 */
export class BaseAgent {
  constructor(apiKey, model) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
    this.model = model;
    this.retryConfig = CONFIG.RETRY;
  }

  /**
   * Determine if an error is retryable
   * @param {Error} error - The error to check
   * @returns {boolean} - True if the error should be retried
   */
  isRetryableError(error) {
    // Check for HTTP status codes
    if (error.status && this.retryConfig.RETRYABLE_ERRORS.includes(error.status)) {
      return true;
    }

    // Check for network error codes
    const errorCode = error.code || error.message;
    return this.retryConfig.RETRYABLE_ERROR_MESSAGES.some(msg =>
      errorCode && errorCode.includes(msg)
    );
  }

  /**
   * Calculate delay for exponential backoff
   * @param {number} attempt - Current attempt number (0-indexed)
   * @returns {number} - Delay in milliseconds
   */
  calculateBackoffDelay(attempt) {
    const delay = this.retryConfig.INITIAL_DELAY * Math.pow(this.retryConfig.BACKOFF_MULTIPLIER, attempt);
    return Math.min(delay, this.retryConfig.MAX_DELAY);
  }

  /**
   * Sleep for a given duration
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} - Promise that resolves after the delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute a function with retry logic
   * @param {Function} fn - The function to execute
   * @param {Function} onRetry - Callback when retry occurs (attempt, error, delay)
   * @returns {Promise} - Result of the function
   */
  async executeWithRetry(fn, onRetry = null) {
    let lastError;

    for (let attempt = 0; attempt < this.retryConfig.MAX_ATTEMPTS; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // If it's the last attempt or not a retryable error, throw immediately
        if (attempt === this.retryConfig.MAX_ATTEMPTS - 1 || !this.isRetryableError(error)) {
          throw error;
        }

        // Calculate delay and notify about retry
        const delay = this.calculateBackoffDelay(attempt);
        console.warn(`⚠️  Retry attempt ${attempt + 1}/${this.retryConfig.MAX_ATTEMPTS - 1} after ${delay}ms due to: ${error.message}`);

        // Call the onRetry callback if provided
        if (onRetry) {
          await onRetry(attempt + 1, error, delay);
        }

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Execute an agent task with a given prompt
   * @param {string} systemPrompt - The system prompt defining the agent's role
   * @param {string} userPrompt - The user's input/task
   * @param {number} maxTokens - Maximum tokens for response
   * @param {Function} onRetry - Optional callback when retry occurs (attempt, error, delay)
   * @returns {Promise<string>} - The agent's response
   */
  async execute(systemPrompt, userPrompt, maxTokens = 4096, onRetry = null) {
    return await this.executeWithRetry(async () => {
      try {
        const message = await this.client.messages.create({
          model: this.model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        });

        return message.content[0].text;
      } catch (error) {
        console.error('Error executing agent:', error.message);
        throw error;
      }
    }, onRetry);
  }

  /**
   * Execute an agent task with conversation history
   * @param {string} systemPrompt - The system prompt defining the agent's role
   * @param {Array} messages - Array of message objects with role and content
   * @param {number} maxTokens - Maximum tokens for response
   * @param {Function} onRetry - Optional callback when retry occurs (attempt, error, delay)
   * @returns {Promise<string>} - The agent's response
   */
  async executeWithHistory(systemPrompt, messages, maxTokens = 4096, onRetry = null) {
    return await this.executeWithRetry(async () => {
      try {
        const message = await this.client.messages.create({
          model: this.model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: messages
        });

        return message.content[0].text;
      } catch (error) {
        console.error('Error executing agent with history:', error.message);
        throw error;
      }
    }, onRetry);
  }
}