# AI Factory - AI Agent Wizard for Software Development

A sophisticated multi-agent system that guides you through the complete Software Development Lifecycle (SDLC) using specialized AI agents powered by Claude.

## Overview

AI Factory is available in two modes:

1. **Web Application** (React + Express) - Modern web interface with real-time updates
2. **CLI Tool** (Terminal) - Command-line interface for terminal users

Both modes use the same powerful AI agents to transform a high-level system description into comprehensive documentation covering requirements, architecture, design, and testing strategy.

## Features

- **Multi-Stage Wizard**: Guides you through 6 distinct phases of software planning
- **Specialized AI Agents**: Each agent is an expert in their specific role
- **Interactive Review**: Review and iterate on each stage before proceeding
- **Loading Indicators**: Real-time visual feedback with spinners for all requests
- **Smart Feedback Navigation**: Automatically navigates to the correct step when applying feedback
- **Comprehensive Documentation**: Generates detailed documentation at each stage
- **Automatic Saving**: All outputs are saved to individual files and a complete document

## The Six Stages

### 1. Business Analyst & Requirements Manager
- Analyzes your system description
- Creates detailed user stories in standard format
- Includes acceptance criteria, priorities, and complexity estimates
- Considers functional and non-functional requirements

### 2. Requirements Reviewer
- Reviews the initial requirements for completeness
- Identifies gaps and missing requirements
- Suggests additional user stories
- Validates testability of acceptance criteria

### 3. Technical Architect
- Designs system architecture
- Creates C4 diagrams (System Context and Container)
- Recommends technology stack for frontend and backend
- Documents architectural decisions and rationale

### 4. Technical Designer
- Designs frontend component structure
- Defines complete API specifications
- Creates data models and ERD diagrams
- Designs error handling strategy

### 5. Testing Strategist
- Defines comprehensive testing strategy
- Covers unit, integration, E2E, and visual testing
- Identifies performance testing requirements
- Recommends testing tools and frameworks

### 6. Task Planner & Implementation Plan
- Breaks down the project into actionable tasks
- Prepares tasks for GenAI code generation
- Creates implementation roadmap
- Prioritizes development phases

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

1. **Provide System Description**: When prompted, enter a high-level description of the system you want to build.

2. **Review Each Stage**: After each agent completes its work, you'll see:
   - The agent's output displayed in the terminal
   - The output saved to a file in the `output/` directory

3. **Make Your Decision**: For each stage, you have three options:
   - **Accept (1)**: Continue to the next stage
   - **Request Changes (2)**: Provide feedback and have the agent regenerate
   - **Quit (3)**: Exit the wizard (progress is saved)

4. **Iterate as Needed**: If you request changes, provide specific feedback, and the agent will refine its output.

5. **Complete**: When all stages are finished, you'll have:
   - Individual files for each stage in `output/`
   - A complete documentation file: `COMPLETE-DOCUMENTATION.md`

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
├── 2-requirementsReviewer.md     # Requirements review and gaps
├── 3-technicalArchitect.md       # Architecture and tech stack
├── 4-technicalDesigner.md        # Component and API design
├── 5-testingStrategist.md        # Testing strategy
├── 6-taskPlanner.md              # Task breakdown and implementation plan
└── COMPLETE-DOCUMENTATION.md     # All stages combined
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `CLAUDE_MODEL`: Claude model to use (default: reads from .env or `claude-sonnet-4-5-20250929`)
- `PORT`: Backend server port (default: `3000`)
- `NODE_ENV`: Environment mode (default: `development`)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:3001`)

### Customizing Prompts

Agent prompts can be customized in individual files under `src/prompts/`. Each agent prompt has:
- `systemPrompt`: Defines the agent's role and behavior
- `getUserPrompt()`: Constructs the user message based on context

Example: Edit `src/prompts/business-analyst.js` to modify requirements gathering behavior.

### Adjusting Model Parameters

In `src/config/constants.js`, you can modify:
- `MAX_TOKENS`: Maximum response length (SIMPLE: 4096, COMPLEX: 8192, EXTENDED: 16384)
- `DEFAULT_MODEL`: The Claude model to use

In `src/agents/base-agent.js`, you can modify API call behavior.

## Project Structure

```
AI-factory/
├── index.js                              # CLI entry point
├── package.json                          # Root dependencies and scripts
├── .env                                  # Environment variables (create this)
├── README.md                             # Main documentation
│
├── docs/                                 # Documentation files
│   ├── QUICK-START.md                   # Quick start guide
│   ├── WEB-APP-SETUP.md                 # Web app setup
│   ├── ARCHITECTURE.md                  # Architecture docs
│   └── ...                              # Other documentation
│
├── src/                                  # Shared core library (used by CLI & backend)
│   ├── agents/                          # AI Agent implementations
│   │   ├── base-agent.js                # Claude API integration
│   │   └── index.js                     # Exports
│   │
│   ├── prompts/                         # Agent prompt definitions
│   │   ├── business-analyst.js          # Business Analyst prompt
│   │   ├── requirements-reviewer.js     # Requirements Reviewer prompt
│   │   ├── technical-architect.js       # Technical Architect prompt
│   │   ├── technical-designer.js        # Technical Designer prompt
│   │   ├── testing-strategist.js        # Testing Strategist prompt
│   │   ├── task-planner.js              # Task Planner prompt
│   │   └── index.js                     # Exports
│   │
│   ├── orchestration/                   # Wizard orchestration
│   │   ├── wizard.js                    # Main orchestrator (CLI)
│   │   ├── wizard-state.js              # State management
│   │   ├── wizard-steps.js              # Step configuration
│   │   └── index.js                     # Exports
│   │
│   ├── config/                          # Configuration
│   │   ├── constants.js                 # App constants
│   │   └── environment.js               # Environment config
│   │
│   └── utils/                           # Utilities
│       ├── display.js                   # Console display
│       ├── file-manager.js              # File operations
│       ├── input-handler.js             # User input
│       └── index.js                     # Exports
│
├── frontend/                             # React web application
│   ├── src/
│   │   ├── components/                  # React components
│   │   ├── pages/                       # Page components
│   │   ├── context/                     # React Context (state)
│   │   └── ...                          # Other frontend code
│   └── package.json                     # Frontend dependencies
│
└── backend/                              # Express API server
    ├── src/
    │   ├── controllers/                 # Socket controllers
    │   ├── routes/                      # REST API routes
    │   ├── services/                    # Business logic
    │   │   ├── wizard-service.js        # Uses shared core (../../../src/)
    │   │   └── session-manager.js       # Session management
    │   └── server.js                    # Server entry point
    └── package.json                     # Backend dependencies
```

For detailed information about the modular architecture, see [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md).

## Technical Details

### Dependencies

- **@anthropic-ai/sdk**: Official Anthropic SDK for Claude API
- **chalk**: Terminal styling and colors
- **ora**: Elegant terminal spinners
- **dotenv**: Environment variable management
- **readline**: Interactive CLI input

### AI Model

The wizard uses Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) by default, which provides:
- Excellent reasoning and analysis capabilities
- Strong technical knowledge
- Consistent formatting and structure
- Good balance of speed and quality

## Tips for Best Results

1. **Be Specific**: Provide detailed system descriptions with clear goals and user types
2. **Iterate**: Don't hesitate to request changes if something isn't quite right
3. **Review Carefully**: Each stage builds on previous ones, so ensure accuracy
4. **Provide Context**: When requesting changes, be specific about what needs improvement
5. **Consider Scale**: Mention expected user base, data volume, and performance needs

## Troubleshooting

### "ANTHROPIC_API_KEY is required"
Ensure you've set your API key using one of the three methods described in Installation.

### API Rate Limits
If you encounter rate limits, the wizard will display an error. Wait a moment and try again.

### Long Response Times
Some stages (especially Technical Design) may take 90-120 seconds due to the complexity of the output.

### Output Not Showing
If terminal output seems truncated, try:
- Maximizing your terminal window
- Checking the saved files in `output/` directory

## Advanced Usage

### Running Specific Stages

To modify the wizard to skip certain stages, edit `src/orchestration/wizard-steps.js` and comment out steps in the array.

### Custom Agents

To add custom agents:

1. Create a new prompt file in `src/prompts/` (e.g., `my-agent.js`)
2. Export it from `src/prompts/index.js`
3. Add a new step in `src/orchestration/wizard-steps.js`
4. Define how it gets input and where it saves output

See [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for detailed instructions.

### Integrating with Other Tools

The generated markdown files can be:
- Converted to PDF using pandoc
- Imported into Notion, Confluence, or other documentation tools
- Version controlled with git
- Used as input for other AI tools or code generators

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas for improvement:
- Additional agent types (DevOps, Security, etc.)
- Export formats (PDF, HTML, JSON)
- Integration with project management tools
- Template library for common system types

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/servika/ai-requirements-factory/issues).

## Acknowledgments

Powered by [Anthropic's Claude](https://www.anthropic.com/claude) - Advanced AI assistant for complex reasoning and analysis.