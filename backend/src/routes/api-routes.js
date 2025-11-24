import express from 'express';

export function createApiRoutes(sessionManager, wizardService) {
  const router = express.Router();

  // Get all sessions
  router.get('/sessions', (req, res) => {
    try {
      const sessions = sessionManager.getAllSessions();
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get session by ID
  router.get('/sessions/:sessionId', (req, res) => {
    try {
      const session = sessionManager.getSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create session
  router.post('/sessions', (req, res) => {
    try {
      const { systemDescription } = req.body;
      if (!systemDescription) {
        return res.status(400).json({ error: 'System description is required' });
      }

      const session = sessionManager.createSession(systemDescription);
      res.status(201).json({ session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get step output
  router.get('/sessions/:sessionId/steps/:stepIndex', (req, res) => {
    try {
      const session = sessionManager.getSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const stepIndex = parseInt(req.params.stepIndex);
      const step = wizardService.getStep(stepIndex);

      const output = session.outputs[step.saveKey];
      res.json({ output });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Download complete documentation
  router.get('/sessions/:sessionId/download', (req, res) => {
    try {
      const session = sessionManager.getSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const steps = wizardService.getAllSteps();
      // Exclude Requirements Review from download
      const allOutputs = steps
        .filter((step) => step.saveKey !== 'requirementsReview')
        .map((step) => {
          const output = session.outputs[step.saveKey];
          if (!output) return '';
          return `# ${step.name}\n\n${output}\n\n${'='.repeat(80)}\n\n`;
        })
        .join('');

      const fullDoc =
        `# Software Development Lifecycle Documentation\n\n` +
        `Generated: ${new Date().toISOString()}\n\n` +
        `## System Description\n\n${session.systemDescription}\n\n` +
        `${'='.repeat(80)}\n\n${allOutputs}`;

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=COMPLETE-DOCUMENTATION.md'
      );
      res.send(fullDoc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete session
  router.delete('/sessions/:sessionId', (req, res) => {
    try {
      const deleted = sessionManager.deleteSession(req.params.sessionId);
      if (!deleted) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json({ message: 'Session deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}