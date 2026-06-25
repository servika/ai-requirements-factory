import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../../../src/config/constants.js';

/**
 * In-memory session manager with TTL-based eviction.
 *
 * Sessions are evicted once idle longer than CONFIG.SESSION.TTL_MS, and the
 * total number of sessions is capped at CONFIG.SESSION.MAX_SESSIONS (oldest
 * evicted first). For multi-instance or durable storage, back this with a
 * database or Redis instead.
 */
export class SessionManager {
  /**
   * @param {Object} [options] - Configuration overrides (mainly for testing)
   * @param {number} [options.ttlMs] - Idle time-to-live in milliseconds
   * @param {number} [options.cleanupIntervalMs] - Sweep interval in milliseconds
   * @param {number} [options.maxSessions] - Max concurrent sessions
   * @param {boolean} [options.autoCleanup=true] - Start the periodic sweep timer
   */
  constructor(options = {}) {
    this.sessions = new Map();
    this.ttlMs = options.ttlMs ?? CONFIG.SESSION.TTL_MS;
    this.cleanupIntervalMs = options.cleanupIntervalMs ?? CONFIG.SESSION.CLEANUP_INTERVAL_MS;
    this.maxSessions = options.maxSessions ?? CONFIG.SESSION.MAX_SESSIONS;
    this.cleanupTimer = null;

    if (options.autoCleanup ?? true) {
      this.startCleanup();
    }
  }

  /**
   * Start the periodic cleanup timer. Unref'd so it never blocks process exit.
   */
  startCleanup() {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => this.evictExpired(), this.cleanupIntervalMs);
    // Don't keep the event loop alive solely for the sweep
    if (typeof this.cleanupTimer.unref === 'function') {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stop the periodic cleanup timer (for graceful shutdown / tests).
   */
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Evict sessions idle longer than the TTL.
   * @returns {number} Number of sessions evicted
   */
  evictExpired() {
    const now = Date.now();
    let evicted = 0;
    for (const [id, session] of this.sessions) {
      if (now - session.updatedAt.getTime() > this.ttlMs) {
        this.sessions.delete(id);
        evicted++;
      }
    }
    if (evicted > 0) {
      console.log(`🧹 Evicted ${evicted} expired session(s)`);
    }
    return evicted;
  }

  /**
   * Evict the oldest sessions until under the max-size cap.
   * Map preserves insertion order, so the first entries are the oldest.
   */
  enforceMaxSessions() {
    while (this.sessions.size >= this.maxSessions) {
      const oldestKey = this.sessions.keys().next().value;
      if (oldestKey === undefined) break;
      this.sessions.delete(oldestKey);
    }
  }

  /**
   * Create a new session
   */
  createSession(systemDescription) {
    this.enforceMaxSessions();

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
