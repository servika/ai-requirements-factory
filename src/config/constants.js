/**
 * Configuration constants for the AI Factory wizard
 */

export const CONFIG = {
  // Claude API configuration
  DEFAULT_MODEL: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
  MAX_TOKENS: {
    SIMPLE: 16000,
    COMPLEX: 32000,
    EXTENDED: 64000
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000, // 1 second
    MAX_DELAY: 30000, // 30 seconds
    BACKOFF_MULTIPLIER: 2,
    RETRYABLE_ERRORS: [429, 500, 502, 503, 504], // HTTP status codes
    RETRYABLE_ERROR_MESSAGES: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED']
  },

  // Output configuration
  OUTPUT_DIR: 'output',
  COMPLETE_DOC_FILENAME: 'COMPLETE-DOCUMENTATION.md',

  // Wizard steps
  STEPS: {
    BUSINESS_ANALYST: 'businessAnalyst',
    REQUIREMENTS_REVIEWER: 'requirementsReviewer',
    TECHNICAL_ARCHITECT: 'technicalArchitect',
    TECHNICAL_DESIGNER: 'technicalDesigner',
    TESTING_STRATEGIST: 'testingStrategist'
  },

  // User actions
  USER_ACTIONS: {
    ACCEPT: 'accept',
    REVISE: 'revise',
    QUIT: 'quit'
  }
};

export const MENU_OPTIONS = {
  ACCEPT: '1',
  REVISE: '2',
  QUIT: '3'
};

export const COLORS = {
  PRIMARY: 'cyan',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue',
  MUTED: 'gray'
};
