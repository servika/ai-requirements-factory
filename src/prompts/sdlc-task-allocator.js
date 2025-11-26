export const systemPrompt = `You are an experienced Project Manager and SDLC Coordinator specializing in breaking down software projects into role-specific, actionable tasks that can be assigned to domain experts.

Your role is to:
1. Review all generated project artifacts (requirements, architecture, technical design, testing strategy, and task breakdown)
2. Create specific, detailed tasks for each role in the Software Development Lifecycle
3. Ensure each task has sufficient context and information for an expert to complete it independently
4. Organize tasks with clear dependencies, priorities, and acceptance criteria
5. Bridge the gap between high-level planning and hands-on execution

Key Principles:
- Tasks should be actionable and specific, not vague or overly broad
- Each task must include all necessary context from previous artifacts
- Tasks should be sized appropriately for expert execution (1-5 days of work)
- Dependencies between tasks must be clearly identified
- Each role should receive tasks that match their expertise and responsibilities
- Tasks should enable parallel work where possible`;

export function getUserPrompt(inputs) {
  const {
    systemDescription,
    requirements,
    requirementsReview,
    architecture,
    technicalDesign,
    testingStrategy,
    taskPlanner
  } = inputs;

  return `Based on the comprehensive project documentation provided below, create a detailed task allocation plan organized by SDLC role. Each task should contain enough information for a domain expert to pick it up and execute it successfully.

# PROJECT OVERVIEW

${systemDescription}

# REQUIREMENTS & USER STORIES

${requirements}

# REQUIREMENTS REVIEW & GAP ANALYSIS

${requirementsReview}

# SYSTEM ARCHITECTURE

${architecture}

# TECHNICAL DESIGN SPECIFICATIONS

${technicalDesign}

# TESTING STRATEGY

${testingStrategy}

# TASK BREAKDOWN & IMPLEMENTATION ROADMAP

${taskPlanner}

---

# YOUR TASK

Generate a comprehensive SDLC Task Allocation document that organizes all necessary work by role. For each task, provide:

1. **Task ID**: Unique identifier (e.g., BA-001, FE-001, BE-001, DB-001, QA-001, OPS-001, UX-001, SEC-001, DOC-001)
2. **Role Assignment**: The specific SDLC role responsible
3. **Task Title**: Clear, concise description of the work
4. **Detailed Description**: Complete context and requirements for the task
5. **Required Context**: References to relevant sections from the project artifacts above
6. **Acceptance Criteria**: Specific, measurable criteria for task completion
7. **Dependencies**: Other tasks that must be completed first (by Task ID)
8. **Estimated Effort**: Time estimate (Small: 1-2 days, Medium: 3-5 days, Large: 5+ days)
9. **Priority**: Critical, High, Medium, or Low
10. **Deliverables**: Specific artifacts or outputs expected

# ROLES TO INCLUDE

Organize tasks for these SDLC roles:

## 1. Product Owner / Business Analyst
- Refining requirements based on review feedback
- Creating user acceptance criteria
- Defining business rules and validation logic
- Stakeholder communication and sign-offs

## 2. UI/UX Designer
- Creating wireframes and mockups
- Designing user flows and interaction patterns
- Establishing design system and component library
- Conducting usability reviews

## 3. Frontend Developer
- Implementing UI components
- Integrating with backend APIs
- Implementing state management
- Ensuring responsive design and accessibility

## 4. Backend Developer
- Implementing API endpoints
- Developing business logic
- Creating middleware and validators
- Implementing authentication and authorization

## 5. Database Administrator / Data Engineer
- Designing and implementing database schema
- Creating indexes and optimizing queries
- Setting up data migration scripts
- Implementing backup and recovery procedures

## 6. DevOps Engineer
- Setting up CI/CD pipelines
- Configuring infrastructure and environments
- Implementing monitoring and logging
- Managing deployments and releases

## 7. QA / Test Engineer
- Creating test plans and test cases
- Implementing automated tests
- Conducting integration and E2E testing
- Performance and load testing

## 8. Security Engineer
- Conducting security assessments
- Implementing security controls
- Performing vulnerability testing
- Setting up security monitoring

## 9. Technical Writer
- Creating API documentation
- Writing user guides and manuals
- Documenting deployment procedures
- Creating runbooks and troubleshooting guides

# OUTPUT FORMAT

Use the following markdown structure:

\`\`\`markdown
# SDLC Task Allocation

## Overview
[Brief summary of the task allocation strategy, highlighting critical paths and parallel workstreams]

## Task Distribution Summary
- **Product Owner / Business Analyst**: X tasks
- **UI/UX Designer**: X tasks
- **Frontend Developer**: X tasks
- **Backend Developer**: X tasks
- **Database Administrator**: X tasks
- **DevOps Engineer**: X tasks
- **QA / Test Engineer**: X tasks
- **Security Engineer**: X tasks
- **Technical Writer**: X tasks

**Total Tasks**: X

---

## Product Owner / Business Analyst Tasks

### Task BA-001: [Task Title]

**Description**:
[Detailed description of what needs to be done]

**Required Context**:
- Reference to specific user stories from requirements
- Relevant business rules
- Links to related sections in project artifacts

**Acceptance Criteria**:
- [ ] [Specific, measurable criterion]
- [ ] [Another criterion]

**Dependencies**: None / [Task IDs]

**Estimated Effort**: Small/Medium/Large

**Priority**: Critical/High/Medium/Low

**Deliverables**:
- [Specific artifact 1]
- [Specific artifact 2]

---

[Continue for all roles and tasks...]

## Critical Path Analysis

[Identify the critical path tasks that determine the minimum project timeline]

## Parallel Workstreams

[Identify tasks that can be executed in parallel to optimize delivery time]

## Risk Considerations

[Highlight any tasks with dependencies, complexity, or risks that need special attention]
\`\`\`

Remember:
- Be specific and actionable in task descriptions
- Include all necessary context from the project artifacts
- Ensure task sizing is appropriate for expert execution
- Identify dependencies clearly to prevent blockers
- Prioritize tasks based on business value and technical dependencies
- Enable maximum parallelization where possible`;
}