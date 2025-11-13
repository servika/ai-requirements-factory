import { Wizard } from './src/orchestration/index.js';
import { Environment } from './src/config/environment.js';

/**
 * Main entry point for the AI Agent Wizard
 */
async function main() {
  // Validate environment configuration
  const validation = Environment.validate();

  if (!validation.isValid) {
    Environment.displayConfigError();
    process.exit(1);
  }

  try {
    const { apiKey, model } = validation.config;
    const wizard = new Wizard(apiKey, model);
    await wizard.run();
  } catch (error) {
    console.error('\n❌ Error running wizard:', error.message);
    process.exit(1);
  }
}

// Run the wizard
main();
