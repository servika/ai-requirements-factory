# AI Factory - System Architecture

This document describes the architecture and design of the AI Factory wizard system.

## Overview

AI Factory is a multi-agent orchestration system that guides users through the Software Development Lifecycle using 8 specialized AI agents powered by Anthropic's Claude. It transforms a high-level system description into comprehensive implementation plans.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Interface                                  │
│                    (CLI Terminal / React Web App)                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Entry Point                                         │
│              (index.js for CLI / server.js for Web)                         │
│  - Environment validation                                                    │
│  - Configuration loading                                                     │
│  - Wizard initialization                                                     │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Wizard Orchestrator                                  │
│                      (src/orchestration/wizard.js)                          │
│                                                                              │
│  - State management (wizard-state.js)                                       │
│  - Step configuration (wizard-steps.js)                                     │
│  - Standard step processing with user review                                │
│  - Auto-feedback step processing (for review stage)                         │
│  - File output management                                                   │
└───────────┬─────────────────────────────────────┬───────────────────────────┘
            │                                     │
            ▼                                     ▼
┌───────────────────────────┐         ┌───────────────────────────────────────┐
│      Agent Prompts        │         │        Agent Executor                 │
│   (src/prompts/*.js)      │         │    (src/agents/base-agent.js)        │
│                           │         │                                       │
│  8 Specialized Agents:    │         │  - Anthropic API communication       │
│  - Business Analyst       │         │  - Message handling                  │
│  - Requirements Reviewer  │         │  - Retry logic with backoff          │
│  - Technical Architect    │         │  - Error management                  │
│  - Technical Designer     │         │                                       │
│  - Testing Strategist     │         └─────────────────┬─────────────────────┘
│  - Task Planner           │                           │
│  - SDLC Task Allocator    │                           ▼
│  - Agent Task Generator   │         ┌───────────────────────────────────────┐
└───────────────────────────┘         │       Anthropic Claude API            │
                                      │    (claude-sonnet-4-5-20250929)       │
                                      └───────────────────────────────────────┘
```

## The 8-Stage Pipeline

### Stage Overview

| Stage | Agent | Input | Output | User Interaction |
|-------|-------|-------|--------|------------------|
| 1 | Business Analyst | System description | Requirements, User Stories, NFRs | Manual review |
| 2 | Requirements Reviewer | Requirements | Review report | **Automatic** |
| 3 | Technical Architect | Req + Review | Architecture, C4, Tech Stack | Manual review |
| 4 | Technical Designer | Req + Review + Arch | APIs, Data Models, Components | Manual review |
| 5 | Testing Strategist | Req + Arch + Design | Test Strategy, Quality Gates | Manual review |
| 6 | Task Planner | ALL outputs | WBS, Critical Path, Tasks | Manual review |
| 7 | SDLC Allocator | ALL outputs | Role Tasks, RACI, Handoffs | Manual review |
| 8 | Agent Task Generator | Arch + Design + Alloc | AI Prompts, Verification | Manual review |

### Data Flow Diagram

```
USER INPUT
    │
    ▼
┌─────────────────┐
│ STAGE 1         │
│ Business        │──────────────────────────────────────────────────┐
│ Analyst         │                                                   │
└────────┬────────┘                                                   │
         │ Requirements                                               │
         ▼                                                            │
┌─────────────────┐                                                   │
│ STAGE 2 (AUTO)  │                                                   │
│ Requirements    │──┐                                                │
│ Reviewer        │  │ Review Feedback                                │
└────────┬────────┘  │                                                │
         │           │                                                │
         │           ▼                                                │
         │    ┌─────────────┐                                         │
         │    │ Regenerate  │ (Improved Requirements)                 │
         │    │ Stage 1     │─────────────────────────────────────────┤
         │    └─────────────┘                                         │
         │                                                            │
         ▼                                                            │
┌─────────────────┐                                                   │
│ STAGE 3         │◄──────────────────────────────────────────────────┤
│ Technical       │ (Requirements + Review)                           │
│ Architect       │                                                   │
└────────┬────────┘                                                   │
         │ Architecture                                               │
         ▼                                                            │
┌─────────────────┐                                                   │
│ STAGE 4         │◄──────────────────────────────────────────────────┤
│ Technical       │ (Requirements + Review + Architecture)            │
│ Designer        │                                                   │
└────────┬────────┘                                                   │
         │ Design                                                     │
         ▼                                                            │
┌─────────────────┐                                                   │
│ STAGE 5         │◄──────────────────────────────────────────────────┤
│ Testing         │ (Requirements + Architecture + Design)            │
│ Strategist      │                                                   │
└────────┬────────┘                                                   │
         │ Testing Strategy                                           │
         ▼                                                            │
┌─────────────────┐                                                   │
│ STAGE 6         │◄──────────────────────────────────────────────────┘
│ Task            │ (ALL previous outputs)
│ Planner         │
└────────┬────────┘
         │ Task Breakdown
         ▼
┌─────────────────┐
│ STAGE 7         │◄─── (ALL previous outputs including Task Plan)
│ SDLC Task       │
│ Allocator       │
└────────┬────────┘
         │ Role Allocation
         ▼
┌─────────────────┐
│ STAGE 8         │◄─── (Architecture + Design + Allocation)
│ Agent Task      │
│ Generator       │
└────────┬────────┘
         │
         ▼
  IMPLEMENTATION-READY PLAN
```

## Component Breakdown

### 1. Wizard Orchestrator (`src/orchestration/wizard.js`)

**Responsibilities:**
- Manage wizard state across all steps
- Control step progression
- Handle standard steps with user interaction
- Handle auto-feedback steps (automatic review)
- Save outputs to files

**Key Methods:**

```javascript
class Wizard {
  // Standard step with user review
  async processStep(stepIndex) {
    // Execute step → Display → Save → Get user decision
    // Support iteration with feedback
  }

  // Auto-feedback step (for requirements review)
  async processAutoFeedbackStep(stepIndex) {
    // 1. Execute review step automatically
    // 2. Use review as feedback to regenerate target step
    // 3. No user interaction needed
  }

  // Main run loop
  async run() {
    for (let i = 0; i < this.steps.length; i++) {
      if (step.autoFeedback) {
        await this.processAutoFeedbackStep(i);
      } else {
        await this.processStep(i);
      }
    }
  }
}
```

### 2. Step Configuration (`src/orchestration/wizard-steps.js`)

**Step Definition Structure:**
```javascript
{
  id: string,                    // Unique step identifier
  name: string,                  // Display name
  prompt: AgentPrompt,           // Prompt configuration
  getInput: () => string,        // Function to get input for this step
  saveKey: string,               // Key for saving output
  autoFeedback?: {               // Optional: auto-feedback configuration
    targetStepIndex: number,     // Step to feed back to
    targetSaveKey: string        // Output key to regenerate
  }
}
```

**Context Propagation:**

| Step | getInput() Returns |
|------|-------------------|
| 1 (BA) | System description |
| 2 (Review) | Requirements |
| 3 (Architect) | Requirements + Review |
| 4 (Designer) | Requirements + Review + Architecture |
| 5 (Testing) | Requirements + Architecture + Design |
| 6 (Planner) | ALL outputs (Req, Review, Arch, Design, Testing) |
| 7 (Allocator) | ALL outputs including Task Plan |
| 8 (Generator) | Architecture + Design + Allocation |

### 3. Agent Prompts (`src/prompts/*.js`)

Each prompt follows industry best practices:

| Agent | Methodology |
|-------|-------------|
| Business Analyst | BABOK v3, Karl Wiegers, INVEST criteria |
| Requirements Reviewer | Wiegers Quality Attributes, Gap Analysis |
| Technical Architect | SEI ATAM, ADD, Views & Beyond |
| Technical Designer | Design patterns, API contracts, Data modeling |
| Testing Strategist | Risk-based testing, Test pyramid, Shift-left |
| Task Planner | WBS principles, Critical path, MVP scoping |
| SDLC Allocator | RACI matrix, Handoff protocols |
| Agent Task Generator | Prompt engineering, Context management |

**Prompt Structure:**
```javascript
{
  name: string,                                    // Agent name
  systemPrompt: string,                            // Role definition with methodology
  getUserPrompt: (input, feedback?) => string     // Context-aware prompt generator
}
```

### 4. Agent Executor (`src/agents/base-agent.js`)

**Responsibilities:**
- Interface with Anthropic API
- Handle API authentication
- Retry logic with exponential backoff
- Error handling

**Key Features:**
```javascript
class BaseAgent {
  async execute(systemPrompt, userPrompt, maxTokens) {
    // Retry with exponential backoff
    // Handle rate limits
    // Return response text
  }
}
```

## Auto-Feedback Mechanism

The Requirements Reviewer (Stage 2) uses auto-feedback to improve requirements without user intervention:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTO-FEEDBACK FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Business Analyst generates requirements                     │
│     ↓                                                           │
│  2. User reviews and accepts Stage 1                            │
│     ↓                                                           │
│  3. AUTO: Requirements Reviewer generates review                │
│     ↓                                                           │
│  4. AUTO: Review fed back to Business Analyst                   │
│     ↓                                                           │
│  5. AUTO: Business Analyst regenerates improved requirements    │
│     ↓                                                           │
│  6. Continue to Stage 3 with improved requirements              │
│                                                                 │
│  No user interaction in steps 3-5                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Configuration:**
```javascript
{
  id: 'requirementsReviewer',
  name: 'Requirements Review',
  prompt: AGENT_PROMPTS.requirementsReviewer,
  getInput: () => state.getOutput('requirements'),
  saveKey: 'requirementsReview',
  autoFeedback: {
    targetStepIndex: 0,      // Feed back to Stage 1
    targetSaveKey: 'requirements'
  }
}
```

## State Management

### Wizard State (`src/orchestration/wizard-state.js`)

```javascript
{
  systemDescription: string,     // User's initial input
  currentStep: number,           // Current wizard step (0-7)
  outputs: {
    requirements: string,        // Stage 1 output (improved after Stage 2)
    requirementsReview: string,  // Stage 2 output
    architecture: string,        // Stage 3 output
    technicalDesign: string,     // Stage 4 output
    testingStrategy: string,     // Stage 5 output
    taskPlanner: string,         // Stage 6 output
    sdlcTaskAllocation: string,  // Stage 7 output
    agentTasks: string           // Stage 8 output
  }
}
```

## File System Integration

### Output Structure
```
output/
├── 1-businessAnalyst.md          # Requirements (improved by auto-review)
├── 2-requirementsReviewer.md     # Review report
├── 3-technicalArchitect.md       # Architecture, C4, ADRs
├── 4-technicalDesigner.md        # Components, APIs, Data Models
├── 5-testingStrategist.md        # Test Strategy, Quality Gates
├── 6-taskPlanner.md              # WBS, Critical Path, Tasks
├── 7-sdlcTaskAllocator.md        # RACI, Role Tasks, Handoffs
├── 8-agentTaskGenerator.md       # AI Prompts, Verification
└── COMPLETE-DOCUMENTATION.md     # All stages combined
```

## Design Patterns

### 1. Pipeline Pattern
Each step's output feeds into subsequent steps, creating a processing pipeline with cumulative context.

### 2. Strategy Pattern
Each agent uses a different strategy (prompt) for the same interface.

### 3. State Machine
The wizard implements a state machine with transitions:
- `pending` → `in_progress` → `completed`
- Special path for auto-feedback steps

### 4. Template Method
The base agent execution flow is fixed, but specific prompts vary per agent.

## Error Handling Strategy

### API Errors
- Network failures: Display error, allow retry
- Authentication errors: Clear message about API key
- Rate limiting: Automatic retry with exponential backoff
- Invalid responses: Log and display user-friendly message

### User Input Errors
- Empty system description: Require input before proceeding
- Invalid menu choices: Re-prompt with valid options
- Interrupt (Ctrl+C): Graceful shutdown, save progress

## Configuration & Extensibility

### Adding New Agents

1. **Create prompt file** (`src/prompts/09-new-agent.js`):
```javascript
export const newAgentPrompt = {
  name: 'New Agent Name',
  systemPrompt: '...',
  getUserPrompt: (input, feedback) => '...'
};
```

2. **Export from index** (`src/prompts/index.js`):
```javascript
import { newAgentPrompt } from './09-new-agent.js';
export const AGENT_PROMPTS = {
  // ... existing
  newAgent: newAgentPrompt
};
```

3. **Add step** (`src/orchestration/wizard-steps.js`):
```javascript
{
  id: 'newAgent',
  name: 'New Agent Stage',
  prompt: AGENT_PROMPTS.newAgent,
  getInput: () => state.getOutput('previousStage'),
  saveKey: 'newAgentOutput'
}
```

### Adding Auto-Feedback to a Step

```javascript
{
  id: 'reviewStep',
  name: 'Review Stage',
  prompt: AGENT_PROMPTS.reviewer,
  getInput: () => state.getOutput('target'),
  saveKey: 'review',
  autoFeedback: {
    targetStepIndex: 0,      // Which step to feed back to
    targetSaveKey: 'target'  // Which output to regenerate
  }
}
```

## Performance Considerations

### Response Time by Stage
| Stage | Typical Duration | Tokens |
|-------|------------------|--------|
| 1 (BA) | 60-90s | 4000-6000 |
| 2 (Review) | 45-60s | 3000-4000 |
| 3 (Architect) | 90-120s | 5000-7000 |
| 4 (Designer) | 90-120s | 5000-8000 |
| 5 (Testing) | 60-90s | 4000-6000 |
| 6 (Planner) | 90-120s | 5000-8000 |
| 7 (Allocator) | 60-90s | 4000-6000 |
| 8 (Generator) | 90-120s | 5000-8000 |

### Total Token Usage
- System prompts: ~1000-2000 tokens each
- User input: Variable (500-10000 tokens)
- Responses: 3000-8000 tokens each
- Total per run: ~80,000-150,000 tokens

## Security Considerations

### API Key Management
- Never log or display API keys
- Use environment variables
- `.env` in `.gitignore` by default

### Input Safety
- System description: User responsibility for content
- User review choices: Validated against allowed options
- File paths: Safe path joining

### Output Safety
- No user input in file names
- Output directory created with safe permissions
- No execution of generated content

## Testing Strategy

### Unit Tests (`test/`)
- `wizard-steps.test.js`: Step configuration and data flow
- `wizard-state.test.js`: State management
- `sdlc-task-allocator.test.js`: SDLC prompt exports
- `file-manager.test.js`: File operations
- `environment.test.js`: Configuration
- `constants.test.js`: Error handling

### Running Tests
```bash
npm test              # Run all tests
npm run test:coverage # With coverage report
```

## Dependencies

### Production
- `@anthropic-ai/sdk` (^0.30.0): Official Anthropic API client
- `chalk` (^5.3.0): Terminal styling
- `ora` (^8.0.1): Terminal spinners
- `dotenv` (^16.4.5): Environment variables

### Development
- `c8`: Code coverage
- `concurrently`: Parallel process running

## Future Enhancements

### Planned
- Web-based auto-feedback visualization
- Progress persistence and resume
- Custom agent creation UI
- Export to PDF/HTML

### Potential
- Team collaboration features
- Integration with project management tools
- AI-driven code generation from tasks
- Multi-language support
