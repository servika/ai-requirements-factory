/**
 * Socket.IO event handlers
 */
export class SocketController {
  constructor(io, sessionManager, wizardService) {
    this.io = io;
    this.sessionManager = sessionManager;
    this.wizardService = wizardService;
  }

  /**
   * Handle socket connection
   */
  handleConnection(socket) {
    console.log('Client connected:', socket.id);

    // Start wizard
    socket.on('wizard:start', async ({ systemDescription }) => {
      try {
        const session = this.sessionManager.createSession(systemDescription);
        socket.join(session.id);
        socket.data.sessionId = session.id;

        socket.emit('session:created', { sessionId: session.id });
        console.log('Session created:', session.id);

        // Automatically execute first step
        await this.executeStep(socket, 0, null);
      } catch (error) {
        console.error('Error starting wizard:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Execute step
    socket.on('step:execute', async ({ stepIndex, feedback }) => {
      await this.executeStep(socket, stepIndex, feedback);
    });

    // Accept step
    socket.on('step:accept', async ({ stepIndex }) => {
      try {
        const sessionId = socket.data.sessionId;
        const session = this.sessionManager.getSession(sessionId);

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Update current step
        this.sessionManager.updateSession(sessionId, {
          currentStep: stepIndex + 1,
        });

        // Automatically execute next step if available
        if (stepIndex + 1 < this.wizardService.getAllSteps().length) {
          await this.executeStep(socket, stepIndex + 1, null);
        } else {
          socket.emit('wizard:completed', { sessionId });
        }
      } catch (error) {
        console.error('Error accepting step:', error);
        socket.emit('step:error', {
          step: stepIndex,
          error: error.message,
        });
      }
    });

    // Request revision
    socket.on('step:revise', async ({ stepIndex, feedback }) => {
      console.log(`\n🔄 Revision requested for Step ${stepIndex + 1}`);
      console.log(`   Feedback: ${feedback.substring(0, 100)}...`);

      // For Requirements Reviewer (step 1), apply feedback to Business Analyst (step 0)
      if (stepIndex === 1) {
        console.log(`   ↩️  Applying feedback to Step 1 (Business Analyst)`);

        // Clear the Requirements Review output to avoid confusion
        const sessionId = socket.data.sessionId;
        this.sessionManager.saveStepOutput(sessionId, 'requirementsReview', null);

        // Notify frontend that we're navigating to step 0
        socket.emit('step:navigate', { targetStep: 0 });

        // Clear the output on the frontend as well
        socket.emit('step:cleared', { step: 'requirementsReview' });

        await this.executeStep(socket, 0, feedback);
      } else {
        // For other steps, regenerate the same step with feedback
        await this.executeStep(socket, stepIndex, feedback);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  }

  /**
   * Execute a step and emit results
   */
  async executeStep(socket, stepIndex, feedback) {
    const sessionId = socket.data.sessionId;
    const session = this.sessionManager.getSession(sessionId);

    if (!session) {
      console.error(`❌ Session not found: ${sessionId}`);
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    const step = this.wizardService.getStep(stepIndex);

    try {
      console.log(`\n🚀 Starting Step ${stepIndex + 1}: ${step.name}`);
      console.log(`   Session: ${sessionId}`);
      if (feedback) {
        console.log(`   With feedback: ${feedback.substring(0, 50)}...`);
      }

      socket.emit('step:started', { step: step.id });

      console.log(`   🤖 Calling AI agent...`);
      const startTime = Date.now();

      const output = await this.wizardService.executeStep(
        stepIndex,
        session,
        feedback
      );

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`   ✅ Step completed in ${duration}s`);
      console.log(`   📝 Output length: ${output.length} characters\n`);

      this.sessionManager.saveStepOutput(sessionId, step.saveKey, output);

      socket.emit('step:completed', {
        step: step.id,
        output,
      });
    } catch (error) {
      console.error(`\n❌ Error executing Step ${stepIndex + 1}:`, error.message);
      console.error('Stack trace:', error.stack);
      socket.emit('step:error', {
        step: step.id,
        error: error.message,
      });
    }
  }
}