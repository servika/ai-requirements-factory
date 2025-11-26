import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { CONFIG } from '../config/constants.js';

/**
 * File management utilities for saving wizard outputs
 */
export class FileManager {
  constructor(outputDir = CONFIG.OUTPUT_DIR) {
    this.outputDir = path.join(process.cwd(), outputDir);
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error(chalk.red(`Error creating output directory: ${error.message}`));
      throw error;
    }
  }

  /**
   * Save content to a file
   */
  async saveFile(filename, content) {
    try {
      await this.ensureOutputDir();
      const filepath = path.join(this.outputDir, filename);
      await fs.writeFile(filepath, content, 'utf-8');
      return filepath;
    } catch (error) {
      console.error(chalk.red(`Error saving file ${filename}: ${error.message}`));
      throw error;
    }
  }

  /**
   * Generate complete documentation from all outputs
   */
  generateCompleteDocument(systemDescription, outputs) {
    // Exclude Requirements Review from complete documentation
    const sections = [
      { title: 'System Description', content: systemDescription },
      { title: 'Requirements & User Stories', key: 'requirements' },
      { title: 'Technical Architecture', key: 'architecture' },
      { title: 'Technical Design', key: 'technicalDesign' },
      { title: 'Testing Strategy', key: 'testingStrategy' },
      { title: 'Task Planner & Implementation Plan', key: 'taskPlanner' },
      { title: 'SDLC Task Allocation', key: 'sdlcTaskAllocation' }
    ];

    let completeDoc = '# Software Development Lifecycle Documentation\n\n';
    completeDoc += `Generated: ${new Date().toISOString()}\n\n`;
    completeDoc += '---\n\n';

    for (const section of sections) {
      completeDoc += `## ${section.title}\n\n`;
      const content = section.content || outputs[section.key];
      if (content) {
        completeDoc += content + '\n\n';
        completeDoc += '---\n\n';
      }
    }

    return completeDoc;
  }

  /**
   * Save complete documentation
   */
  async saveCompleteDocument(systemDescription, outputs) {
    const content = this.generateCompleteDocument(systemDescription, outputs);
    return this.saveFile(CONFIG.COMPLETE_DOC_FILENAME, content);
  }
}