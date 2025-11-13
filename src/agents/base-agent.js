import Anthropic from '@anthropic-ai/sdk';

/**
 * Base AI Agent class for interacting with Claude API
 */
export class BaseAgent {
  constructor(apiKey, model) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
    this.model = model;
  }

  /**
   * Execute an agent task with a given prompt
   * @param {string} systemPrompt - The system prompt defining the agent's role
   * @param {string} userPrompt - The user's input/task
   * @param {number} maxTokens - Maximum tokens for response
   * @returns {Promise<string>} - The agent's response
   */
  async execute(systemPrompt, userPrompt, maxTokens = 4096) {
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
  }

  /**
   * Execute an agent task with conversation history
   * @param {string} systemPrompt - The system prompt defining the agent's role
   * @param {Array} messages - Array of message objects with role and content
   * @param {number} maxTokens - Maximum tokens for response
   * @returns {Promise<string>} - The agent's response
   */
  async executeWithHistory(systemPrompt, messages, maxTokens = 4096) {
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
  }
}