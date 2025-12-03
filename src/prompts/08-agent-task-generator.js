/**
 * Agent Task Generator Prompt
 * Generates detailed, role-specific implementation tasks for AI agents
 */

export const agentTaskGeneratorPrompt = {
  systemPrompt: `You are an expert AI task orchestrator specializing in breaking down SDLC tasks into detailed, executable work packages for AI agents representing different roles.

Your goal is to transform high-level task allocations into comprehensive, actionable tasks that AI agents can execute independently. Each task must include:
- Complete context and requirements
- Specific acceptance criteria
- All necessary technical specifications
- Dependencies and prerequisites
- Expected outputs and deliverables

You must generate tasks that are:
1. **Self-contained**: Each task has all information needed for execution
2. **Unambiguous**: Clear instructions with no room for interpretation
3. **Verifiable**: Concrete acceptance criteria for validation
4. **Sequenced**: Proper ordering with dependency management
5. **Role-appropriate**: Matched to the specific SDLC role's expertise

CRITICAL REQUIREMENTS:
- Include code examples, file paths, and technical specifications
- Specify exact tools, frameworks, and libraries to use
- Define clear input/output contracts
- Include test scenarios and validation steps
- Provide complete context from previous SDLC phases`,

  getUserPrompt: (allocationData, context = {}) => {
    const { feedback } = context;

    // Handle both object and string inputs
    let allocation;
    if (typeof allocationData === 'string') {
      try {
        allocation = JSON.parse(allocationData);
      } catch {
        allocation = { raw: allocationData };
      }
    } else {
      allocation = allocationData;
    }

    let prompt = `# Generate AI Agent Implementation Tasks

Based on the SDLC task allocation below, generate detailed, executable work packages for AI agents representing each role.

## SDLC Task Allocation
${typeof allocation === 'object' && allocation.raw ? allocation.raw : JSON.stringify(allocation, null, 2)}

${feedback ? `\n## Revision Feedback\n${feedback}\n` : ''}

## Task Generation Requirements

For each role in the SDLC allocation, create detailed agent tasks following this structure:

### Required Task Structure

\`\`\`json
{
  "metadata": {
    "generatedAt": "<ISO timestamp>",
    "totalTasks": <number>,
    "estimatedTotalHours": <number>,
    "roles": ["<list of roles>"]
  },
  "agentTasks": [
    {
      "taskId": "T-ROLE-001",
      "role": "<SDLC Role>",
      "agentPersona": "<AI Agent Description>",
      "taskTitle": "<Clear, action-oriented title>",
      "priority": "Critical|High|Medium|Low",
      "estimatedHours": <number>,
      "dependencies": ["T-ROLE-XXX"],
      "phase": "Planning|Design|Implementation|Testing|Deployment",

      "context": {
        "background": "<Why this task is needed>",
        "businessValue": "<Impact on project goals>",
        "technicalContext": "<Relevant architecture/design decisions>",
        "relatedRequirements": ["REQ-XXX"]
      },

      "objective": "<Single, clear objective statement>",

      "detailedInstructions": [
        {
          "step": 1,
          "action": "<Specific action to take>",
          "details": "<Detailed explanation>",
          "technicalSpecs": "<Code examples, file paths, configurations>",
          "expectedOutput": "<What should be produced>"
        }
      ],

      "technicalRequirements": {
        "technologies": ["<frameworks, libraries>"],
        "tools": ["<specific tools needed>"],
        "fileStructure": [
          {
            "path": "src/components/Example.jsx",
            "purpose": "Component purpose",
            "template": "<code template if applicable>"
          }
        ],
        "codeConventions": ["<coding standards to follow>"],
        "designPatterns": ["<patterns to apply>"]
      },

      "acceptanceCriteria": [
        {
          "criterion": "<Specific, testable criterion>",
          "verification": "<How to verify completion>",
          "priority": "Must|Should|Could"
        }
      ],

      "testingRequirements": {
        "unitTests": [
          {
            "scenario": "<Test scenario>",
            "testCase": "<Specific test case>",
            "expectedBehavior": "<Expected result>"
          }
        ],
        "integrationTests": ["<Integration test descriptions>"],
        "validationSteps": ["<Manual validation steps>"]
      },

      "deliverables": [
        {
          "name": "<Deliverable name>",
          "type": "Code|Documentation|Configuration|Test",
          "location": "<File path or location>",
          "format": "<Format specification>",
          "qualityCriteria": "<Quality standards>"
        }
      ],

      "resources": {
        "documentation": ["<URLs or references>"],
        "codeExamples": ["<Example code or repos>"],
        "apiReferences": ["<API docs>"],
        "designAssets": ["<Design files, mockups>"]
      },

      "riskMitigation": [
        {
          "risk": "<Potential risk>",
          "mitigation": "<How to mitigate>",
          "fallbackPlan": "<Backup approach>"
        }
      ],

      "qualityGates": [
        {
          "gate": "<Quality checkpoint>",
          "criteria": "<Pass/fail criteria>",
          "validator": "<Who/what validates>"
        }
      ]
    }
  ],

  "executionStrategy": {
    "sequencing": [
      {
        "phase": "<Phase name>",
        "parallelTasks": [["T-001", "T-002"]],
        "sequentialTasks": ["T-003", "T-004"],
        "criticalPath": ["<Critical tasks>"]
      }
    ],
    "roleCoordination": [
      {
        "handoff": "From <Role A> to <Role B>",
        "trigger": "<What triggers the handoff>",
        "artifacts": ["<What is passed>"],
        "validationRequired": true|false
      }
    ]
  }
}
\`\`\`

## Task Generation Guidelines

### 1. Context Enrichment
- Include relevant BRD requirements
- Reference architecture decisions
- Link to design specifications
- Provide business context

### 2. Technical Specifications
- Exact file paths and naming conventions
- Code templates and boilerplate
- Configuration examples
- API contracts and schemas
- Database schema changes

### 3. Agent Personas
Define each agent's role clearly:
- **Frontend Developer Agent**: React/UI expert, accessibility focused
- **Backend Developer Agent**: API design, database optimization
- **QA Engineer Agent**: Test automation, quality validation
- **DevOps Engineer Agent**: CI/CD, infrastructure, deployment
- **Tech Lead Agent**: Code review, architecture validation
- **Database Administrator Agent**: Schema design, query optimization
- **Security Engineer Agent**: Security scanning, vulnerability assessment
- **Documentation Engineer Agent**: API docs, user guides, technical specs

### 4. Acceptance Criteria
Every task must have:
- Functional criteria (what it does)
- Technical criteria (how it's built)
- Quality criteria (performance, security)
- Documentation criteria (what's documented)
- Test coverage criteria (what's tested)

### 5. Dependencies
Map dependencies:
- Sequential: Task B requires Task A completion
- Parallel: Tasks can run simultaneously
- Data: Task B needs artifacts from Task A
- Blocking: Task B cannot start until Task A validation passes

### 6. Code Examples
Include specific code templates:
\`\`\`javascript
// Example component structure
export default function ComponentName({ props }) {
  // Implementation template
}
\`\`\`

### 7. Testing Requirements
For each task:
- Unit test scenarios (>=80% coverage target)
- Integration test cases
- E2E test scenarios (if applicable)
- Performance benchmarks
- Security test cases

## Output Format
Return ONLY valid JSON following the structure above. No markdown code blocks, no additional text.

Generate comprehensive agent tasks now.`;

    return prompt;
  },

  /**
   * Prepare formatted input for the next step (if needed)
   */
  prepareForNextStep: (agentTasks) => {
    return {
      summary: {
        totalTasks: agentTasks.agentTasks?.length || 0,
        roles: agentTasks.metadata?.roles || [],
        estimatedHours: agentTasks.metadata?.estimatedTotalHours || 0,
        criticalPath: agentTasks.executionStrategy?.sequencing?.[0]?.criticalPath || []
      },
      tasks: agentTasks.agentTasks || [],
      executionPlan: agentTasks.executionStrategy || {}
    };
  }
};

// CommonJS export for backward compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { agentTaskGeneratorPrompt };
}