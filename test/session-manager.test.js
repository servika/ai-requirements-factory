import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SessionManager } from '../backend/src/services/session-manager.js';

function makeManager(options = {}) {
  // Disable the periodic timer; tests drive eviction explicitly
  return new SessionManager({ autoCleanup: false, ...options });
}

test('createSession stores a retrievable session', () => {
  const manager = makeManager();
  const session = manager.createSession('A system to build');

  assert.ok(session.id);
  assert.equal(manager.getSession(session.id).systemDescription, 'A system to build');
});

test('evictExpired removes sessions older than the TTL', () => {
  const manager = makeManager({ ttlMs: 1000 });
  const session = manager.createSession('Old session');

  // Force the session to look stale
  session.updatedAt = new Date(Date.now() - 5000);

  const evicted = manager.evictExpired();
  assert.equal(evicted, 1);
  assert.equal(manager.getSession(session.id), undefined);
});

test('evictExpired keeps sessions within the TTL', () => {
  const manager = makeManager({ ttlMs: 60_000 });
  const session = manager.createSession('Fresh session');

  assert.equal(manager.evictExpired(), 0);
  assert.ok(manager.getSession(session.id));
});

test('enforceMaxSessions evicts oldest when at capacity', () => {
  const manager = makeManager({ maxSessions: 2 });
  const first = manager.createSession('first');
  manager.createSession('second');
  // Creating a third should evict the oldest (first)
  manager.createSession('third');

  assert.equal(manager.getAllSessions().length, 2);
  assert.equal(manager.getSession(first.id), undefined);
});

test('stopCleanup is safe to call without an active timer', () => {
  const manager = makeManager();
  assert.doesNotThrow(() => manager.stopCleanup());
});
