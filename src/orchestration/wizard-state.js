/**
 * Wizard state management
 */
export class WizardState {
  constructor() {
    this.systemDescription = '';
    this.outputs = {};
    this.currentStep = 0;
  }

  /**
   * Set system description
   */
  setSystemDescription(description) {
    this.systemDescription = description;
  }

  /**
   * Save output for a step
   */
  saveOutput(key, content) {
    this.outputs[key] = content;
  }

  /**
   * Get output by key
   */
  getOutput(key) {
    return this.outputs[key];
  }

  /**
   * Get all outputs
   */
  getAllOutputs() {
    return this.outputs;
  }

  /**
   * Set current step
   */
  setCurrentStep(step) {
    this.currentStep = step;
  }

  /**
   * Get current step
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Get system description
   */
  getSystemDescription() {
    return this.systemDescription;
  }
}