/**
 * Configuration constants for the AI Factory wizard
 */

export const CONFIG = {
  // Claude API configuration
  DEFAULT_MODEL: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
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

  // Input validation limits
  INPUT: {
    // Max length (characters) for a system description
    MAX_SYSTEM_DESCRIPTION_LENGTH: 20000,
    // Minimum length to be considered meaningful
    MIN_SYSTEM_DESCRIPTION_LENGTH: 10,
    // Max length (characters) for revision feedback
    MAX_FEEDBACK_LENGTH: 10000,
    // Max accepted JSON request body size
    MAX_REQUEST_BODY_SIZE: '100kb',
  },

  // Session management
  SESSION: {
    // Time-to-live for an idle session before eviction (ms)
    TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
    // How often to sweep for expired sessions (ms)
    CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
    // Hard cap on concurrent sessions kept in memory
    MAX_SESSIONS: 500,
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

/**
 * Validate a user-supplied system description.
 * @param {unknown} value - The raw input to validate
 * @returns {{ valid: boolean, value?: string, error?: string }} Validation result with trimmed value
 */
export function validateSystemDescription(value) {
  if (typeof value !== 'string') {
    return { valid: false, error: 'System description is required' };
  }

  const trimmed = value.trim();

  if (trimmed.length < CONFIG.INPUT.MIN_SYSTEM_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `System description must be at least ${CONFIG.INPUT.MIN_SYSTEM_DESCRIPTION_LENGTH} characters`,
    };
  }

  if (trimmed.length > CONFIG.INPUT.MAX_SYSTEM_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `System description must not exceed ${CONFIG.INPUT.MAX_SYSTEM_DESCRIPTION_LENGTH} characters`,
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate optional revision feedback.
 * @param {unknown} value - The raw feedback to validate (may be null/undefined)
 * @returns {{ valid: boolean, value?: string|null, error?: string }} Validation result
 */
export function validateFeedback(value) {
  if (value === null || value === undefined) {
    return { valid: true, value: null };
  }

  if (typeof value !== 'string') {
    return { valid: false, error: 'Feedback must be a string' };
  }

  if (value.length > CONFIG.INPUT.MAX_FEEDBACK_LENGTH) {
    return {
      valid: false,
      error: `Feedback must not exceed ${CONFIG.INPUT.MAX_FEEDBACK_LENGTH} characters`,
    };
  }

  return { valid: true, value };
}

/**
 * Sanitize error messages for production
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - User-friendly fallback message for production
 * @returns {string} - Sanitized error message
 */
export function sanitizeError(error, fallbackMessage = 'An error occurred. Please try again.') {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // In development, show full error details for debugging
    return error.message || error.toString();
  }

  // In production, show sanitized messages
  // Only show specific error types that are safe for users
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error.status === 503 || error.status === 504) {
    return 'Service temporarily unavailable. Please try again in a moment.';
  }

  if (error.isNetworkError || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return 'Network connection error. Please check your connection and try again.';
  }

  // For all other errors, use the fallback message
  return fallbackMessage;
}
