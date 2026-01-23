import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { FileManager } from '../src/utils/file-manager.js';

test('FileManager saves files to the output directory', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-factory-'));

  try {
    const manager = new FileManager(tempDir);
    const filepath = await manager.saveFile('example.md', 'hello');
    const content = await fs.readFile(filepath, 'utf8');

    assert.equal(content, 'hello');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('FileManager generates complete documentation without review section', () => {
  const manager = new FileManager('unused');
  const outputs = {
    requirements: 'REQ',
    requirementsReview: '__REVIEW_ONLY__',
    architecture: 'ARCH',
    technicalDesign: 'DESIGN',
    testingStrategy: 'TEST',
    taskPlanner: 'TASK',
    sdlcTaskAllocation: 'ALLOC'
  };

  const doc = manager.generateCompleteDocument('SYS', outputs);

  assert.ok(doc.includes('Software Development Lifecycle Documentation'));
  assert.ok(doc.includes('System Description'));
  assert.ok(doc.includes('SYS'));
  assert.ok(doc.includes('Requirements & User Stories'));
  assert.ok(doc.includes('REQ'));
  assert.ok(doc.includes('Technical Architecture'));
  assert.ok(doc.includes('ARCH'));
  assert.ok(!doc.includes('__REVIEW_ONLY__'));
});
