import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory session manager
 * In production, use a database
 */
export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create a new session
   */
  createSession(systemDescription) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      systemDescription,
      outputs: {},
      currentStep: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * Update session
   */
  updateSession(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    Object.assign(session, updates, { updatedAt: new Date() });
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Save step output
   */
  saveStepOutput(sessionId, stepKey, output) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.outputs[stepKey] = output;
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get all sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Delete session
   */
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  /**
   * Clear all sessions
   */
  clearAll() {
    this.sessions.clear();
  }
}