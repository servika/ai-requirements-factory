# AI Factory - System Architecture

This document describes the architecture and design of the AI Factory wizard system.

## Overview

AI Factory is a CLI-based multi-agent orchestration system that guides users through the Software Development Lifecycle using specialized AI agents powered by Anthropic's Claude.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User (CLI)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    index.js (Entry Point)                    │
│  - Environment validation                                    │
│  - Configuration loading                                     │
│  - Wizard initialization                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Wizard Orchestrator                       │
│  (src/wizard.js)                                            │
│                                                              │
│  - State management                                         │
│  - Step progression logic                                   │
│  - User interaction handling                                │
│  - File output management                                   │
│  - Review and iteration loop                                │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌──────────────────────────┐
│    Agent Prompts         │     │    Agent Executor        │
│   (src/prompts.js)       │     │   (src/agent.js)        │
│                          │     │                          │
│  - Business Analyst      │     │  - API communication     │
│  - Requirements Reviewer │     │  - Message handling      │
│  - Technical Architect   │     │  - Error management      │
│  - Technical Designer    │     │  - Response parsing      │
│  - Testing Strategist    │     │                          │
└──────────────────────────┘     └────────────┬─────────────┘
                                              │
                                              ▼
                                 ┌────────────────────────────┐
                                 │   Anthropic Claude API     │
                                 │   (claude-sonnet-4)        │
                                 └────────────────────────────┘
```

## Component Breakdown

### 1. Entry Point (`index.js`)

**Responsibilities:**
- Load environment variables
- Validate API key presence
- Initialize and run the wizard
- Global error handling

**Key Functions:**
- `main()`: Entry point, validates configuration and starts wizard

### 2. Wizard Orchestrator (`src/wizard.js`)

**Responsibilities:**
- Manage wizard state across all steps
- Control step progression and iteration
- Handle user input and review process
- Save outputs to files
- Display formatted results

**Key Components:**

**State Management:**
```javascript
{
  systemDescription: string,    // User's initial input
  outputs: {                     // Outputs from each stage
    requirements: string,
    requirementsReview: string,
    architecture: string,
    technicalDesign: string,
    testingStrategy: string
  },
  currentStep: number           // Current wizard step
}
```

**Step Definition:**
```javascript
{
  id: string,                   // Unique step identifier
  name: string,                 // Display name
  prompt: AgentPrompt,          // Prompt configuration
  getInput: () => string,       // Function to get input for this step
  saveKey: string              // Key for saving output
}
```

**Key Methods:**
- `run()`: Main wizard loop
- `executeStep()`: Execute a single agent step
- `getUserReview()`: Get user feedback and decision
- `saveToFile()`: Save output to individual file
- `saveCompleteOutput()`: Create combined documentation

### 3. Agent Prompts (`src/prompts.js`)

**Responsibilities:**
- Define system prompts for each agent role
- Generate contextual user prompts
- Support feedback-based iteration

**Prompt Structure:**
```javascript
{
  name: string,                                    // Agent name
  systemPrompt: string,                           // Role definition
  getUserPrompt: (input, feedback?) => string    // Context-aware prompt generator
}
```

**Five Agent Definitions:**

1. **Business Analyst** - Requirements and user stories
2. **Requirements Reviewer** - Validation and gap analysis
3. **Technical Architect** - System architecture and tech stack
4. **Technical Designer** - Components, APIs, data models
5. **Testing Strategist** - Comprehensive testing strategy

### 4. Agent Executor (`src/agent.js`)

**Responsibilities:**
- Interface with Anthropic API
- Handle API authentication
- Execute single-shot and conversational interactions
- Error handling and retry logic

**Key Methods:**
- `execute(systemPrompt, userPrompt, maxTokens)`: Single interaction
- `executeWithHistory(systemPrompt, messages, maxTokens)`: Multi-turn conversation

## Data Flow

### Initial Flow (Happy Path)

```
1. User Input
   └─> System Description entered

2. Step 1: Business Analyst
   ├─> Input: System Description
   ├─> Agent generates requirements
   ├─> Output saved to file
   ├─> User reviews
   └─> User accepts → Next step

3. Step 2: Requirements Reviewer
   ├─> Input: Requirements from Step 1
   ├─> Agent reviews and validates
   ├─> Output saved to file
   ├─> User reviews
   └─> User accepts → Next step

4. Step 3: Technical Architect
   ├─> Input: Requirements + Review
   ├─> Agent designs architecture
   ├─> Output saved to file
   ├─> User reviews
   └─> User accepts → Next step

5. Step 4: Technical Designer
   ├─> Input: Architecture
   ├─> Agent creates detailed design
   ├─> Output saved to file
   ├─> User reviews
   └─> User accepts → Next step

6. Step 5: Testing Strategist
   ├─> Input: Technical Design
   ├─> Agent creates test strategy
   ├─> Output saved to file
   ├─> User reviews
   └─> User accepts → Complete

7. Completion
   └─> Generate combined documentation
```

### Iteration Flow

```
User requests changes (option 2)
   ├─> User provides feedback
   ├─> Agent regenerates with feedback context
   ├─> New output displayed
   ├─> User reviews again
   └─> Accept or request more changes
```

## File System Integration

### Input
- `.env` file (optional): API key configuration
- Environment variables: Runtime configuration
- Command-line arguments: Alternative API key input

### Output Structure
```
output/
├── 1-businessAnalyst.md
├── 2-requirementsReviewer.md
├── 3-technicalArchitect.md
├── 4-technicalDesigner.md
├── 5-testingStrategist.md
└── COMPLETE-DOCUMENTATION.md
```

### Output Format
- Markdown files for easy reading and conversion
- Timestamped in combined documentation
- Individual files for granular access
- Combined document for holistic view

## Design Patterns

### 1. Strategy Pattern (Agent Prompts)
Each agent uses a different strategy (prompt) for the same interface (generate documentation).

### 2. State Machine (Wizard)
The wizard implements a state machine with transitions:
- `pending` → `in_progress` → `completed` (happy path)
- `in_progress` → `in_progress` (iteration)
- Any state → `quit` (user exit)

### 3. Pipeline Pattern (Step Execution)
Each step's output feeds into the next step's input, creating a processing pipeline.

### 4. Template Method (Agent Execution)
The base agent execution flow is fixed, but specific prompts vary per agent.

## Error Handling Strategy

### API Errors
- Network failures: Display error, allow retry
- Authentication errors: Clear message about API key
- Rate limiting: Inform user to wait and retry
- Invalid responses: Log and display user-friendly message

### User Input Errors
- Empty system description: Require input before proceeding
- Invalid menu choices: Re-prompt with valid options
- Interrupt (Ctrl+C): Graceful shutdown, save progress

### File System Errors
- Output directory creation: Create recursively if missing
- File write failures: Display error, continue wizard
- Permission errors: Clear message about file permissions

## Configuration & Extensibility

### Adding New Agents

1. **Add prompt in `src/prompts.js`:**
```javascript
export const AGENT_PROMPTS = {
  // ... existing agents
  newAgent: {
    name: 'New Agent Name',
    systemPrompt: '...',
    getUserPrompt: (input, feedback) => '...'
  }
};
```

2. **Add step in `src/wizard.js`:**
```javascript
this.steps = [
  // ... existing steps
  {
    id: 'newAgent',
    name: 'New Agent Stage',
    prompt: AGENT_PROMPTS.newAgent,
    getInput: () => this.state.outputs.previousStage,
    saveKey: 'newAgentOutput'
  }
];
```

### Customizing Agents

**Modify Prompt Behavior:**
- Edit `systemPrompt` to change agent personality/approach
- Adjust `getUserPrompt()` to change input formatting
- Modify output parsing in wizard for custom formats

**Adjust Response Length:**
- Change `maxTokens` parameter in `executeStep()`
- Default: 8192 for complex outputs, 4096 for simpler ones

**Change Model:**
- Set `CLAUDE_MODEL` environment variable
- Options: `claude-sonnet-4-20250514`, `claude-opus-4-20250514`

## Performance Considerations

### Response Time
- Average: 2-4 minutes per stage
- Factors: Complexity, token count, API load
- Optimization: Using appropriate token limits

### Token Usage
- System prompts: ~500-1500 tokens each
- User input: Variable (100-5000 tokens)
- Responses: 2000-8000 tokens
- Total per run: ~50,000-100,000 tokens

### Caching
- No caching implemented (each request is fresh)
- Potential improvement: Cache responses per system description hash

## Security Considerations

### API Key Management
- Never log or display API keys
- Support multiple input methods
- Use environment variables (best practice)
- `.env` in `.gitignore` by default

### Input Validation
- System description: No length limit (user responsibility)
- User review choices: Validated against allowed options
- File paths: Use safe path joining

### Output Safety
- No user input in file names (prevents injection)
- Output directory created with safe permissions
- No execution of generated content

## Testing Strategy (For AI Factory Itself)

### Unit Tests (Recommended)
- Agent prompt generation
- State management
- Input validation
- File operations

### Integration Tests (Recommended)
- Agent execution with mock API
- Step progression
- User review flow
- File output

### E2E Tests (Optional)
- Full wizard run with real API
- Iteration scenarios
- Error handling paths

## Monitoring & Observability

### Logging
- Current: Console output only
- Potential: File-based logging, structured logs

### Metrics
- Current: None
- Potential: Response times, token usage, success rates

### Error Tracking
- Current: Console error output
- Potential: Error aggregation, alerting

## Future Enhancements

### Short Term
- Add more agents (DevOps, Security, etc.)
- Export to PDF/HTML formats
- Progress saving and resume
- Template library for common systems

### Medium Term
- Web interface
- Team collaboration features
- Version control integration
- Custom agent creation UI

### Long Term
- AI-driven code generation
- Integration with IDEs
- Project management tool integration
- Multi-language support

## Dependencies

### Production Dependencies
- `@anthropic-ai/sdk` (^0.30.0): Official Anthropic API client
- `chalk` (^5.3.0): Terminal styling
- `ora` (^8.0.1): Terminal spinners
- `dotenv` (^16.4.5): Environment variables
- `readline` (built-in): User input

### Development Dependencies
- None currently
- Recommended: `jest`, `eslint`, `prettier`

## Deployment Considerations

### As CLI Tool
- Current implementation (npm start)
- Can be packaged as global npm package
- Binary executable with pkg or nexe

### As Service
- Wrap in API server (Express, Fastify)
- Add authentication and user management
- Store outputs in database
- Queue system for long-running tasks

### As Library
- Export Wizard and Agent classes
- Allow programmatic usage
- Support custom prompts and agents
- Event-based notifications

## Conclusion

AI Factory demonstrates a clean, modular architecture for orchestrating multiple AI agents in a sequential workflow. The design prioritizes:

1. **Extensibility**: Easy to add new agents and stages
2. **User Control**: Review and iteration at each step
3. **Transparency**: Clear output and state management
4. **Reliability**: Error handling and graceful degradation
5. **Simplicity**: Minimal dependencies, clear code structure

The architecture supports both the current CLI use case and future expansion into web services, team collaboration, and advanced automation scenarios.