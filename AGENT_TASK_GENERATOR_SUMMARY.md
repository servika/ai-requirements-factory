# Agent Task Generator - Step 8

## Overview

Added a new wizard step that transforms high-level SDLC task allocations into detailed, executable work packages for AI agents representing each role in the Software Development Lifecycle.

## Purpose

This step bridges the gap between task allocation and actual implementation by generating comprehensive, self-contained tasks that AI agents can execute independently. Each task includes:

- Complete context from all previous SDLC phases
- Specific technical specifications and code examples
- Clear acceptance criteria and verification methods
- Dependencies and execution sequencing
- Testing requirements and quality gates

## What Was Added

### 1. New Prompt File: `08-agent-task-generator.js`

**Location**: `src/prompts/08-agent-task-generator.js`

**Key Features**:
- Generates detailed JSON task structures for AI agents
- Includes 8 specialized agent personas:
  - Frontend Developer Agent
  - Backend Developer Agent
  - QA Engineer Agent
  - DevOps Engineer Agent
  - Tech Lead Agent
  - Database Administrator Agent
  - Security Engineer Agent
  - Documentation Engineer Agent

**Task Structure Includes**:
```json
{
  "taskId": "T-ROLE-001",
  "role": "Frontend Developer",
  "agentPersona": "React/UI expert, accessibility focused",
  "taskTitle": "Implement User Dashboard Component",
  "priority": "High",
  "estimatedHours": 8,
  "context": {
    "background": "Why needed",
    "businessValue": "Impact",
    "technicalContext": "Architecture decisions",
    "relatedRequirements": ["REQ-001"]
  },
  "detailedInstructions": [
    {
      "step": 1,
      "action": "Create component structure",
      "technicalSpecs": "File: src/components/Dashboard.jsx",
      "expectedOutput": "Functional React component"
    }
  ],
  "technicalRequirements": {
    "technologies": ["React 18", "Material-UI"],
    "tools": ["Vite", "ESLint"],
    "fileStructure": [...],
    "codeConventions": [...],
    "designPatterns": ["Container/Presenter"]
  },
  "acceptanceCriteria": [
    {
      "criterion": "Component renders without errors",
      "verification": "Run npm test",
      "priority": "Must"
    }
  ],
  "testingRequirements": {
    "unitTests": [...],
    "integrationTests": [...],
    "validationSteps": [...]
  },
  "deliverables": [...],
  "resources": {...},
  "riskMitigation": [...],
  "qualityGates": [...]
}
```

### 2. Updated Files

#### `src/prompts/index.js`
- Added import for `agentTaskGeneratorPrompt`
- Added to `AGENT_PROMPTS` export object
- Fixed import for `sdlcTaskAllocatorPrompt` (was using `* as`)

#### `src/prompts/07-sdlc-task-allocator.js`
- Wrapped exports in a proper object structure
- Added `prepareForAgentTaskGenerator()` helper method
- Made export consistent with other prompt files

#### `src/orchestration/wizard-steps.js`
- Added Step 8: Agent Task Generation
- Configured to receive SDLC allocation output
- Saves results to `agentTasks`

### 3. Prompt Files Renamed

All prompt files now have numbered prefixes for clarity:
- `business-analyst.js` → `01-business-analyst.js`
- `requirements-reviewer.js` → `02-requirements-reviewer.js`
- `technical-architect.js` → `03-technical-architect.js`
- `technical-designer.js` → `04-technical-designer.js`
- `testing-strategist.js` → `05-testing-strategist.js`
- `task-planner.js` → `06-task-planner.js`
- `sdlc-task-allocator.js` → `07-sdlc-task-allocator.js`
- **(NEW)** `08-agent-task-generator.js`

## Execution Flow

```
Step 7: SDLC Task Allocation
   ↓ (Role-based tasks)
Step 8: Agent Task Generator
   ↓ (Detailed work packages)
AI Agent Execution System (Future)
```

## Task Generation Guidelines

### 1. Context Enrichment
Each task includes:
- Relevant BRD requirements
- Architecture decisions
- Design specifications
- Business context

### 2. Technical Specifications
Provides:
- Exact file paths and naming conventions
- Code templates and boilerplate
- Configuration examples
- API contracts and schemas
- Database schema changes

### 3. Agent Personas
Clear role definitions:
- **Frontend Developer Agent**: React/UI expert, accessibility focused
- **Backend Developer Agent**: API design, database optimization
- **QA Engineer Agent**: Test automation, quality validation
- **DevOps Engineer Agent**: CI/CD, infrastructure, deployment
- And 4 more specialized roles

### 4. Acceptance Criteria
Every task has:
- Functional criteria (what it does)
- Technical criteria (how it's built)
- Quality criteria (performance, security)
- Documentation criteria (what's documented)
- Test coverage criteria (>=80% target)

### 5. Dependencies
Maps task relationships:
- **Sequential**: Task B requires Task A completion
- **Parallel**: Tasks can run simultaneously
- **Data**: Task B needs artifacts from Task A
- **Blocking**: Task B cannot start until Task A validation passes

### 6. Testing Requirements
Includes:
- Unit test scenarios
- Integration test cases
- E2E test scenarios
- Performance benchmarks
- Security test cases

## Output Structure

The agent generates:

1. **Metadata**: Summary of tasks, roles, estimates
2. **Agent Tasks Array**: Detailed task objects
3. **Execution Strategy**:
   - Sequencing (parallel/sequential)
   - Role coordination and handoffs
   - Critical path identification

## Next Steps

This step prepares the foundation for:

1. **AI Agent Execution System**: Automated task execution
2. **Progress Tracking**: Real-time task status monitoring
3. **Quality Validation**: Automated acceptance criteria verification
4. **Agent Orchestration**: Coordinated multi-agent workflows

## Benefits

✅ **Complete Context**: Every task has full project context
✅ **Self-Contained**: No ambiguity, ready for execution
✅ **Verifiable**: Clear success criteria
✅ **Traceable**: Links back to requirements
✅ **Optimized**: Identifies parallel execution opportunities
✅ **Quality-Focused**: Built-in testing and validation requirements

## Example Use Case

**Input (from Step 7)**:
```markdown
### Task FE-001: Implement User Login Form
**Description**: Create login form component
**Dependencies**: None
**Priority**: High
```

**Output (from Step 8)**:
```json
{
  "taskId": "T-FE-001",
  "role": "Frontend Developer",
  "taskTitle": "Implement User Login Form Component",
  "detailedInstructions": [
    {
      "step": 1,
      "action": "Create LoginForm component",
      "technicalSpecs": "File: src/components/auth/LoginForm.jsx\nUse Formik for form handling\nImplement Yup validation schema",
      "expectedOutput": "Controlled form component with validation"
    }
  ],
  "technicalRequirements": {
    "technologies": ["React 18", "Formik 2.x", "Yup", "Material-UI"],
    "fileStructure": [
      {
        "path": "src/components/auth/LoginForm.jsx",
        "purpose": "Main login form component",
        "template": "// React component template with Formik"
      }
    ]
  },
  "acceptanceCriteria": [
    {
      "criterion": "Form validates email and password",
      "verification": "Submit with invalid data, check error messages",
      "priority": "Must"
    }
  ],
  "testingRequirements": {
    "unitTests": [
      {
        "scenario": "Invalid email submission",
        "testCase": "Submit form with 'notanemail'",
        "expectedBehavior": "Display 'Invalid email format' error"
      }
    ]
  }
}
```

## Configuration

The step is automatically included in the wizard flow. No additional configuration needed.

## Technical Notes

- Returns pure JSON (no markdown code blocks)
- Handles both string and object inputs
- Supports feedback loops for task refinement
- Integrates with existing wizard context system