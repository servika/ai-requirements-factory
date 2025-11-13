# AI Factory - Project Structure

This document describes the modular folder structure and organization of the AI Factory codebase.

## Directory Structure

```
AI-factory/
├── index.js                              # Main entry point
├── package.json                          # Dependencies and scripts
├── .env.example                          # Environment variable template
├── .gitignore                            # Git ignore rules
│
├── docs/                                 # Documentation
│   ├── README.md                         # Main documentation
│   ├── QUICK-START.md                   # Quick setup guide
│   ├── EXAMPLES.md                      # Usage examples
│   ├── ARCHITECTURE.md                  # System architecture
│   └── PROJECT-STRUCTURE.md             # This file
│
└── src/                                  # Source code
    ├── index.js                         # Module exports
    │
    ├── agents/                          # AI Agent implementations
    │   ├── index.js                     # Agent exports
    │   └── base-agent.js                # Base agent with Claude API integration
    │
    ├── prompts/                         # Agent prompt definitions
    │   ├── index.js                     # Prompt exports
    │   ├── business-analyst.js          # Business Analyst prompt
    │   ├── requirements-reviewer.js     # Requirements Reviewer prompt
    │   ├── technical-architect.js       # Technical Architect prompt
    │   ├── technical-designer.js        # Technical Designer prompt
    │   └── testing-strategist.js        # Testing Strategist prompt
    │
    ├── orchestration/                   # Wizard orchestration logic
    │   ├── index.js                     # Orchestration exports
    │   ├── wizard.js                    # Main wizard orchestrator
    │   ├── wizard-state.js              # State management
    │   └── wizard-steps.js              # Step configuration
    │
    ├── config/                          # Configuration modules
    │   ├── constants.js                 # Application constants
    │   └── environment.js               # Environment configuration
    │
    └── utils/                           # Utility modules
        ├── index.js                     # Utility exports
        ├── display.js                   # Console display utilities
        ├── file-manager.js              # File I/O operations
        └── input-handler.js             # User input handling
```

## Module Overview

### Root Level

**index.js**
- Application entry point
- Validates environment configuration
- Initializes and runs the wizard
- Global error handling

**package.json**
- Project metadata
- Dependencies: `@anthropic-ai/sdk`, `chalk`, `ora`, `dotenv`
- Scripts: `start`, `test`

### src/agents/

Contains AI agent implementations that interact with the Claude API.

**base-agent.js**
- `BaseAgent` class for Claude API communication
- Methods:
  - `execute(systemPrompt, userPrompt, maxTokens)`: Single interaction
  - `executeWithHistory(systemPrompt, messages, maxTokens)`: Multi-turn conversation
- Error handling and response parsing

### src/prompts/

Contains prompt definitions for each specialized agent.

Each prompt file exports an object with:
- `name`: Agent display name
- `systemPrompt`: Role and behavior definition
- `getUserPrompt(input, feedback)`: Contextual prompt generator

**business-analyst.js**
- Creates user stories and requirements
- Focus on stakeholder needs and acceptance criteria

**requirements-reviewer.js**
- Reviews and validates requirements
- Identifies gaps and missing elements

**technical-architect.js**
- Designs system architecture
- Recommends technology stack

**technical-designer.js**
- Creates detailed component design
- Defines API specifications and data models

**testing-strategist.js**
- Develops comprehensive testing strategy
- Covers unit, integration, E2E, and performance testing

### src/orchestration/

Contains wizard orchestration and workflow management.

**wizard.js**
- Main `Wizard` class orchestrating the multi-stage workflow
- Methods:
  - `run()`: Main wizard loop
  - `processStep(stepIndex)`: Process a single step with iteration
  - `executeStep(stepIndex, feedback)`: Execute agent for a step
  - `saveCompleteOutput()`: Generate combined documentation
- Integrates all components (agents, prompts, utils)

**wizard-state.js**
- `WizardState` class for state management
- Stores:
  - System description
  - Outputs from each step
  - Current step index
- Methods for getting/setting state

**wizard-steps.js**
- `createWizardSteps(state)`: Factory function for step configuration
- Returns array of step definitions with:
  - `id`: Unique identifier
  - `name`: Display name
  - `prompt`: Agent prompt configuration
  - `getInput()`: Function to get input for this step
  - `saveKey`: Key for saving output

### src/config/

Configuration and environment management.

**constants.js**
- Application constants:
  - `CONFIG`: General configuration (models, tokens, output settings)
  - `MENU_OPTIONS`: User menu choices
  - `COLORS`: Terminal color scheme
- Centralized configuration for easy maintenance

**environment.js**
- `Environment` class for environment management
- Methods:
  - `getApiKey(argv)`: Get API key from env or CLI
  - `getModel()`: Get Claude model configuration
  - `validate()`: Validate all required config
  - `displayConfigError()`: Show configuration error messages
- Supports multiple API key input methods

### src/utils/

Utility modules for common operations.

**display.js**
- `Display` class for formatted console output
- Methods:
  - `showBanner()`: Display wizard banner
  - `showOutput(title, content)`: Display formatted output
  - `showStepHeader()`: Display step header
  - `showReviewOptions()`: Display review menu
  - `showCompletion()`: Display completion message
  - `info/success/warning/error()`: Colored messages
- Consistent terminal UI using chalk

**file-manager.js**
- `FileManager` class for file operations
- Methods:
  - `ensureOutputDir()`: Create output directory
  - `saveFile(filename, content)`: Save file to output directory
  - `generateCompleteDocument()`: Generate combined documentation
  - `saveCompleteDocument()`: Save complete documentation
- Handles all file I/O operations

**input-handler.js**
- `InputHandler` class for user input
- Methods:
  - `ask(question)`: Prompt for user input
  - `getSystemDescription()`: Get initial system description
  - `getReviewDecision()`: Get user review decision
  - `close()`: Clean up readline interface
- Manages readline interface lifecycle

## Module Dependencies

### Dependency Graph

```
index.js
  └─> orchestration/wizard.js
       ├─> agents/base-agent.js
       │    └─> @anthropic-ai/sdk
       ├─> prompts/index.js
       │    └─> All prompt files
       ├─> orchestration/wizard-state.js
       ├─> orchestration/wizard-steps.js
       │    └─> prompts/index.js
       ├─> utils/display.js
       │    └─> chalk
       ├─> utils/file-manager.js
       │    └─> fs/promises, path
       ├─> utils/input-handler.js
       │    └─> readline
       └─> config/constants.js

config/environment.js
  ├─> dotenv
  └─> config/constants.js
```

### External Dependencies

- **@anthropic-ai/sdk** (^0.30.0): Claude API client
- **chalk** (^5.3.0): Terminal styling
- **ora** (^8.0.1): Terminal spinners
- **dotenv** (^16.4.5): Environment variable loading
- **readline** (built-in): User input handling
- **fs/promises** (built-in): File operations
- **path** (built-in): Path manipulation

## Design Principles

### 1. Separation of Concerns
Each module has a single, well-defined responsibility:
- **Agents**: API communication
- **Prompts**: Agent behavior definitions
- **Orchestration**: Workflow management
- **Config**: Configuration and environment
- **Utils**: Reusable utilities

### 2. Modular Architecture
- Easy to add new agents by creating a prompt file
- Easy to modify UI by editing display utilities
- Easy to change storage by modifying file-manager
- Easy to extend with new capabilities

### 3. Clear Interfaces
Each module exports a clean interface:
- Classes with public methods
- Factory functions for configuration
- Named exports for clarity

### 4. Testability
Modular structure enables:
- Unit testing individual modules
- Mocking dependencies
- Integration testing workflows
- Isolated component testing

### 5. Maintainability
- Related code grouped together
- Clear module boundaries
- Consistent naming conventions
- Comprehensive documentation

## Adding New Features

### Adding a New Agent

1. **Create prompt file**: `src/prompts/new-agent.js`
```javascript
export const newAgentPrompt = {
  name: 'New Agent Name',
  systemPrompt: '...',
  getUserPrompt: (input, feedback) => '...'
};
```

2. **Export from index**: `src/prompts/index.js`
```javascript
import { newAgentPrompt } from './new-agent.js';
export const AGENT_PROMPTS = {
  // ... existing
  newAgent: newAgentPrompt
};
```

3. **Add step**: `src/orchestration/wizard-steps.js`
```javascript
{
  id: 'newAgent',
  name: 'New Agent Stage',
  prompt: AGENT_PROMPTS.newAgent,
  getInput: () => state.getOutput('previousStep'),
  saveKey: 'newAgentOutput'
}
```

### Adding a New Utility

1. **Create utility file**: `src/utils/new-util.js`
```javascript
export class NewUtil {
  // Implementation
}
```

2. **Export from index**: `src/utils/index.js`
```javascript
export { NewUtil } from './new-util.js';
```

3. **Use in wizard**: Import and use in `wizard.js`

### Modifying Configuration

1. **Add constant**: `src/config/constants.js`
```javascript
export const CONFIG = {
  // ... existing
  NEW_SETTING: 'value'
};
```

2. **Use throughout application**: Import from `config/constants.js`

## Testing Strategy

### Unit Tests (Recommended)
```
tests/
├── agents/
│   └── base-agent.test.js
├── prompts/
│   └── business-analyst.test.js
├── orchestration/
│   ├── wizard-state.test.js
│   └── wizard-steps.test.js
├── config/
│   └── environment.test.js
└── utils/
    ├── display.test.js
    ├── file-manager.test.js
    └── input-handler.test.js
```

### Integration Tests
- Test step execution with mock API
- Test user interaction flows
- Test file output generation

### E2E Tests
- Full wizard run with real API
- Error handling scenarios
- User iteration flows

## Build and Distribution

### Current Setup
- ES modules (`"type": "module"` in package.json)
- Node.js 18+ required
- No build step needed

### Future Options
- **npm package**: Publish to npm registry
- **Binary executable**: Use `pkg` or `nexe`
- **Docker container**: Containerize for deployment
- **Web service**: Wrap in Express/Fastify API

## Performance Considerations

### Memory
- State stored in memory during execution
- Large outputs may require streaming in future

### API Calls
- Sequential execution (one step at a time)
- Could be parallelized for independent steps in future

### File I/O
- Async operations using fs/promises
- Output directory created lazily

## Security Considerations

### API Key Management
- Never logged or displayed
- Supports multiple input methods
- Not stored in version control

### User Input
- System description not validated (user responsibility)
- Menu choices validated
- No code execution of user input

### File Operations
- Safe path joining
- Output directory with standard permissions
- No user input in filenames

## Conclusion

The modular structure of AI Factory provides:
- Clear separation of concerns
- Easy extensibility
- High testability
- Good maintainability
- Professional code organization

This structure supports both current CLI use case and future expansion into web services, libraries, and advanced features.