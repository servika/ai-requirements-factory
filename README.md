# AI Factory - AI Agent Wizard for Software Development

A sophisticated multi-agent system that guides you through the complete Software Development Lifecycle (SDLC) using specialized AI agents powered by Claude. Transform a high-level system description into comprehensive implementation plans with AI-generated requirements, architecture, design, testing strategy, and executable development tasks.

## Overview

AI Factory is available in two modes:

1. **Web Application** (React + Express) - Modern web interface with real-time updates
2. **CLI Tool** (Terminal) - Command-line interface for terminal users

Both modes use the same powerful AI agents to transform a high-level system description into comprehensive documentation covering requirements, architecture, design, testing strategy, task planning, and AI-ready work packages.

## Features

- **8-Stage AI Pipeline**: Comprehensive SDLC coverage from idea to implementation plan
- **Specialized AI Agents**: Each agent is an expert applying industry best practices
- **Auto-Review**: Automatic requirements review and improvement (no manual intervention)
- **Interactive Review**: Review and iterate on each stage before proceeding
- **Industry Standards**: Prompts based on BABOK, Wiegers, SEI practices
- **Full Traceability**: Business objectives → User stories → Tasks → AI prompts
- **Loading Indicators**: Real-time visual feedback with spinners for all requests
- **Comprehensive Documentation**: Generates detailed documentation at each stage
- **Automatic Saving**: All outputs saved to individual files and complete document

## The Eight Stages

### Stage 1: Business Analyst & Requirements Manager
*Based on BABOK v3, Karl Wiegers' Software Requirements*
- Structured 3-phase methodology (Analysis, Elicitation, Documentation)
- Stakeholder analysis with personas and power/interest grid
- User stories with INVEST criteria and Given-When-Then acceptance criteria
- NFRs: Performance, Scalability, Security, Reliability, Usability, Compliance
- Requirements traceability matrix
- Wiegers' 8 Quality Attributes validation

### Stage 2: Requirements Reviewer (Automatic)
*Auto-review with one iteration - no user interaction needed*
- Reviews requirements against Wiegers quality attributes
- Validates INVEST criteria for user stories
- Gap analysis (functional, NFR, security, stakeholder)
- Ambiguity detection with specific corrections
- **Automatically feeds review back to Stage 1 for improvement**

### Stage 3: Technical Architect
*Based on SEI practices: ATAM, ADD, Views & Beyond*
- Quality Attribute Utility Tree (ATAM method)
- Architectural patterns and tactics with explicit tradeoffs
- C4 diagrams (Context, Container, Component, Deployment)
- Technology selection matrix with quality attribute analysis
- Architecture Decision Records (ADRs)
- Sensitivity points, tradeoff points, and risks

### Stage 4: Technical Designer
*Design-level tradeoff analysis*
- Frontend component architecture with state management
- REST/GraphQL API specifications with full contracts
- Data model with ERD, schema, migrations
- Error handling strategy and taxonomy
- Design patterns with rationale
- Security design (auth flow, authorization model)

### Stage 5: Testing Strategist
*Strategic vision for quality assurance*
- Quality vision aligned with business objectives
- Risk-based testing approach with effort allocation
- Test pyramid strategy (70/20/10) with rationale
- Testing by level: Unit, Integration, E2E, Visual, Performance, Security
- Automation ROI analysis and decision matrix
- CI/CD quality gates and maturity roadmap

### Stage 6: Task Planner & Implementation Roadmap
*Project management best practices*
- Requirements traceability (BO → US → Task)
- Work Breakdown Structure (WBS) with 100% rule
- MVP scope definition with must-have vs nice-to-have
- Critical path analysis with dependency graph
- Story point estimation framework
- GenAI implementation prompts per task

### Stage 7: SDLC Task Allocator
*Role-based work distribution*
- Team structure with 9 SDLC roles
- RACI matrix (Responsible, Accountable, Consulted, Informed)
- Tasks per role with skills, context, deliverables
- Handoff protocols with validation gates
- Workload distribution and bottleneck analysis
- Parallel workstreams with coordination points

### Stage 8: Agent Task Generator
*AI-ready work packages*
- AI agent personas with tool recommendations
- Execution phases with human review gates
- Optimized prompts with context management
- Verification checklists per task
- Prompt engineering guidelines
- Quality assurance checkpoints

## Installation

### Quick Start (Web Application)

```bash
# 1. Clone repository
git clone https://github.com/servika/ai-requirements-factory.git
cd ai-requirements-factory

# 2. Install all dependencies
npm run install:all

# 3. Set up environment (create .env file)
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 4. Start development servers
npm run dev
```

The web application will open at http://localhost:3001

### CLI Installation

If you only want the command-line interface:

```bash
# 1. Clone and navigate
git clone https://github.com/servika/ai-requirements-factory.git
cd ai-requirements-factory

# 2. Install dependencies
npm install

# 3. Set up API key
export ANTHROPIC_API_KEY=your_api_key_here
# or create .env file

# 4. Run CLI
npm run cli
```

## Usage

### Web Application Mode (Recommended)

Start both frontend and backend:
```bash
npm run dev
```

Then open http://localhost:3001 in your browser.

**Features:**
- Modern React interface with Material UI
- Real-time progress updates via WebSocket
- Visual step indicator
- Markdown rendering
- Download individual or complete documentation
- Session history tracking

See [docs/WEB-APP-SETUP.md](docs/WEB-APP-SETUP.md) for detailed web app documentation.

### Deployment

Ready to deploy? See [docs/HEROKU-DEPLOYMENT.md](docs/HEROKU-DEPLOYMENT.md) for step-by-step Heroku deployment instructions.

### CLI Mode

For terminal interface:
```bash
npm run cli
```

### Workflow

1. **Provide System Description**: Enter a high-level description of the system you want to build.

2. **Stage 1 - Requirements**: Business Analyst generates comprehensive requirements
   - Review output and Accept/Revise/Quit

3. **Stage 2 - Auto-Review**: Requirements Reviewer automatically reviews and improves requirements
   - **No user interaction needed** - runs automatically
   - Reviews are fed back to regenerate improved requirements

4. **Stages 3-8**: For each subsequent stage, you can:
   - **Accept (1)**: Continue to the next stage
   - **Request Changes (2)**: Provide feedback for regeneration
   - **Quit (3)**: Exit (progress is saved)

5. **Complete**: When finished, you'll have:
   - Individual files for each stage in `output/`
   - Complete documentation: `COMPLETE-DOCUMENTATION.md`

## Example System Descriptions

### E-commerce Platform
```
A modern e-commerce platform for selling handmade crafts. Users should be able to
browse products, add items to cart, checkout securely, and track orders. Sellers
should have a dashboard to manage inventory, process orders, and view analytics.
The system needs to support multiple payment methods and integrate with shipping
providers.
```

### Task Management App
```
A collaborative task management application for remote teams. Features include
project workspaces, task assignment, real-time updates, file attachments,
comments, and deadline tracking. Users should be able to view tasks in multiple
formats (list, board, calendar). The app needs mobile and web versions with
offline support.
```

### Healthcare Appointment System
```
An appointment booking system for a medical clinic. Patients can view available
time slots, book appointments, receive reminders, and access their medical
history. Doctors can manage their schedules, view patient information, and add
consultation notes. The system must comply with HIPAA regulations and integrate
with existing EHR systems.
```

## Output Structure

After running the wizard, you'll find the following files in the `output/` directory:

```
output/
├── 1-businessAnalyst.md          # User stories and requirements
├── 2-requirementsReviewer.md     # Requirements review (auto-generated)
├── 3-technicalArchitect.md       # Architecture, C4 diagrams, ADRs
├── 4-technicalDesigner.md        # Component design, API specs, data models
├── 5-testingStrategist.md        # Testing strategy and quality gates
├── 6-taskPlanner.md              # WBS, critical path, task breakdown
├── 7-sdlcTaskAllocator.md        # Role-based task allocation, RACI
├── 8-agentTaskGenerator.md       # AI agent work packages
└── COMPLETE-DOCUMENTATION.md     # All stages combined
```

## Data Flow

```
User Input: "Build a task management app..."
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 1: Business Analyst                                   │
│  → Requirements, User Stories, NFRs                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 2: Auto-Review (No user interaction)                  │
│  → Review → Feedback → Improved Requirements                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 3: Technical Architect                                │
│  Input: Requirements + Review                               │
│  → Architecture, C4 Diagrams, Tech Stack, ADRs              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 4: Technical Designer                                 │
│  Input: Requirements + Review + Architecture                │
│  → Components, APIs, Data Models, Error Handling            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 5: Testing Strategist                                 │
│  Input: Requirements + Architecture + Design                │
│  → Test Strategy, Quality Gates, Automation Plan            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 6: Task Planner                                       │
│  Input: ALL previous outputs                                │
│  → WBS, Critical Path, MVP Scope, Task Breakdown            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 7: SDLC Task Allocator                                │
│  Input: ALL previous outputs                                │
│  → Role Tasks, RACI Matrix, Handoffs, Workload              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Stage 8: Agent Task Generator                               │
│  Input: Architecture + Design + Allocation                  │
│  → AI Prompts, Verification Checklists, Review Gates        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                 Implementation-Ready Plan
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `CLAUDE_MODEL`: Claude model to use (default: `claude-sonnet-4-5-20250929`)
- `PORT`: Backend server port (default: `3000`)
- `NODE_ENV`: Environment mode (default: `development`)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:3001`)

### Customizing Prompts

Agent prompts are in `src/prompts/`. Each prompt has:
- `systemPrompt`: Agent's role, methodology, and output format
- `getUserPrompt()`: Constructs the user message based on context

**Prompt files:**
- `01-business-analyst.js` - Requirements (BABOK, Wiegers methodology)
- `02-requirements-reviewer.js` - Review (Wiegers quality attributes)
- `03-technical-architect.js` - Architecture (SEI ATAM, ADD practices)
- `04-technical-designer.js` - Design (API contracts, data models)
- `05-testing-strategist.js` - Testing (risk-based, test pyramid)
- `06-task-planner.js` - Planning (WBS, critical path)
- `07-sdlc-task-allocator.js` - Allocation (RACI, handoffs)
- `08-agent-task-generator.js` - AI Tasks (prompt engineering)

### Adjusting Model Parameters

In `src/config/constants.js`:
- `MAX_TOKENS`: Response length (SIMPLE: 4096, COMPLEX: 8192, EXTENDED: 16384)
- `DEFAULT_MODEL`: Claude model to use

## Project Structure

```
AI-factory/
├── index.js                              # CLI entry point
├── package.json                          # Root dependencies and scripts
├── .env                                  # Environment variables (create this)
│
├── src/                                  # Shared core library
│   ├── agents/                          # AI Agent implementations
│   │   └── base-agent.js                # Claude API integration
│   │
│   ├── prompts/                         # Agent prompt definitions (8 agents)
│   │   ├── 01-business-analyst.js       # Requirements (BABOK methodology)
│   │   ├── 02-requirements-reviewer.js  # Review (auto-feedback)
│   │   ├── 03-technical-architect.js    # Architecture (SEI practices)
│   │   ├── 04-technical-designer.js     # Design (APIs, data models)
│   │   ├── 05-testing-strategist.js     # Testing (risk-based strategy)
│   │   ├── 06-task-planner.js           # Planning (WBS, MVP)
│   │   ├── 07-sdlc-task-allocator.js    # Allocation (RACI, roles)
│   │   ├── 08-agent-task-generator.js   # AI tasks (prompts)
│   │   └── index.js                     # Exports
│   │
│   ├── orchestration/                   # Wizard orchestration
│   │   ├── wizard.js                    # Main orchestrator + auto-review
│   │   ├── wizard-state.js              # State management
│   │   └── wizard-steps.js              # Step configuration
│   │
│   ├── config/                          # Configuration
│   │   ├── constants.js                 # App constants
│   │   └── environment.js               # Environment config
│   │
│   └── utils/                           # Utilities
│       ├── display.js                   # Console display
│       ├── file-manager.js              # File operations
│       └── input-handler.js             # User input
│
├── frontend/                             # React web application
│   └── src/
│       ├── components/                  # React components
│       ├── pages/                       # Page components
│       └── context/                     # React Context (state)
│
├── backend/                              # Express API server
│   └── src/
│       ├── controllers/                 # Socket controllers
│       ├── routes/                      # REST API routes
│       └── services/                    # Business logic
│
├── test/                                 # Unit tests
│   ├── wizard-steps.test.js             # Step configuration tests
│   ├── wizard-state.test.js             # State management tests
│   └── ...                              # Other tests
│
└── docs/                                 # Documentation
    ├── ARCHITECTURE.md                  # System architecture
    ├── PROJECT-STRUCTURE.md             # Detailed structure
    └── ...                              # Other docs
```

## Technical Details

### Dependencies

- **@anthropic-ai/sdk**: Official Anthropic SDK for Claude API
- **chalk**: Terminal styling and colors
- **ora**: Elegant terminal spinners
- **dotenv**: Environment variable management
- **readline**: Interactive CLI input

### AI Model

The wizard uses Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) by default, providing:
- Excellent reasoning and analysis capabilities
- Strong technical knowledge
- Consistent formatting and structure
- Good balance of speed and quality

## Tips for Best Results

1. **Be Specific**: Include clear goals, user types, integrations, and constraints
2. **Mention Scale**: Expected user base, data volume, performance needs
3. **Include Context**: Compliance requirements, existing systems, team size
4. **Iterate When Needed**: Use the revise option to refine outputs
5. **Review Auto-Review Output**: Check the improved requirements after Stage 2

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Troubleshooting

### "ANTHROPIC_API_KEY is required"
Ensure you've set your API key in `.env` or as environment variable.

### API Rate Limits
If you encounter rate limits, wait a moment and try again.

### Long Response Times
Some stages (especially Technical Design and Task Planner) may take 90-120 seconds due to output complexity.

### Output Not Showing
Check saved files in `output/` directory if terminal output seems truncated.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas for improvement:
- Additional agent types (DevOps, Security specialists)
- Export formats (PDF, HTML, JSON)
- Integration with project management tools
- Template library for common system types

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Anthropic's Claude](https://www.anthropic.com/claude)
- Requirements methodology inspired by Karl Wiegers and IIBA BABOK
- Architecture practices from SEI (Software Engineering Institute)
