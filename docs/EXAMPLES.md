# Example Usage Scenarios

This document provides example system descriptions you can use with the AI Factory wizard, along with what to expect from each stage.

## Example 1: Recipe Sharing Platform

### System Description
```
A social recipe sharing platform where users can post their favorite recipes,
follow other cooks, rate and review recipes, create meal plans, and generate
shopping lists. The platform should support recipe categories, dietary
restrictions (vegan, gluten-free, etc.), cooking difficulty levels, and
ingredient substitutions. Users can upload photos and videos of their cooking
process. The system should have a recommendation engine to suggest recipes
based on user preferences and available ingredients.
```

### Expected Outputs

**Stage 1 - Requirements**:
- User registration and profile management
- Recipe creation with rich media
- Social features (follow, like, comment)
- Search and filtering by dietary needs
- Meal planning calendar
- Shopping list generation
- Recipe recommendations
- 15-20 detailed user stories

**Stage 2 - Requirements Review**:
- Validation of social features completeness
- Additional stories for moderation
- Privacy and content sharing controls
- Ingredient database management
- Nutrition information tracking

**Stage 3 - Architecture**:
- React frontend with Next.js
- Node.js/Express backend
- PostgreSQL for structured data
- MongoDB for recipe content
- Redis for caching
- S3 for media storage
- Recommendation service architecture

**Stage 4 - Technical Design**:
- 20+ API endpoints
- Data models for Users, Recipes, Ingredients, MealPlans
- Component hierarchy for recipe cards, search, meal planner
- Error handling for uploads, API rate limits

**Stage 5 - Testing Strategy**:
- Unit tests for recommendation algorithm
- Integration tests for recipe creation flow
- E2E tests for user journeys
- Visual regression tests for recipe cards
- Performance tests for search with large datasets

---

## Example 2: Fitness Tracking App

### System Description
```
A comprehensive fitness tracking mobile application that helps users track
workouts, monitor nutrition, set fitness goals, and connect with personal
trainers. Features include exercise library with video demonstrations,
workout plan builder, progress tracking with charts and analytics, calorie
and macro tracking, integration with wearable devices (Fitbit, Apple Watch),
social challenges and leaderboards, and in-app messaging with trainers.
The app needs both mobile (iOS/Android) and web versions.
```

### Expected Outputs

**Stage 1 - Requirements**:
- User onboarding with fitness assessment
- Exercise library browsing
- Custom workout creation
- Workout logging and tracking
- Nutrition diary
- Goal setting and progress tracking
- Wearable device integration
- Trainer marketplace and communication
- Social features and challenges

**Stage 2 - Requirements Review**:
- Offline functionality requirements
- Data synchronization across devices
- Payment processing for trainer services
- Notifications and reminders
- Data export capabilities
- Accessibility features

**Stage 3 - Architecture**:
- React Native for mobile apps
- React web application
- Node.js API gateway
- Microservices for workout, nutrition, social
- PostgreSQL for transactional data
- Time-series database for metrics
- Real-time messaging service
- Third-party API integrations

**Stage 4 - Technical Design**:
- Mobile component architecture
- RESTful API specifications
- WebSocket endpoints for real-time features
- Data models for Workouts, Exercises, Meals, Goals
- Integration patterns for wearables
- Offline-first data strategy

**Stage 5 - Testing Strategy**:
- Mobile device testing matrix
- Integration tests for wearable APIs
- E2E tests for critical user flows
- Performance testing for data sync
- Load testing for social features
- Battery and performance profiling

---

## Example 3: Project Management Tool

### System Description
```
An enterprise project management tool for software development teams. Core
features include project and sprint planning, task boards with customizable
workflows, time tracking, resource allocation, burndown charts, Gantt charts,
risk management, document sharing, and extensive reporting. Integration with
GitHub, Jira, Slack, and Google Workspace is required. The system should
support multiple teams, complex permission structures, and custom fields.
Real-time collaboration and audit logging are essential for compliance.
```

### Expected Outputs

**Stage 1 - Requirements**:
- Organization and team hierarchy
- Project creation and templates
- Sprint planning and management
- Task lifecycle management
- Time tracking and reporting
- Resource capacity planning
- Custom workflows and fields
- Integration management
- Permissions and roles
- Audit trail
- Advanced analytics and reporting

**Stage 2 - Requirements Review**:
- API for third-party integrations
- Webhook system for real-time updates
- Data import/export capabilities
- Mobile app requirements
- Backup and disaster recovery
- Compliance requirements (SOC 2, GDPR)

**Stage 3 - Architecture**:
- Angular or React frontend
- Java Spring Boot or Node.js backend
- Microservices architecture
- PostgreSQL for primary data
- Elasticsearch for search and analytics
- Redis for caching and real-time features
- Message queue for async processing
- OAuth 2.0 authentication
- API gateway pattern

**Stage 4 - Technical Design**:
- Component-based UI architecture
- 50+ API endpoints
- Complex permission calculation logic
- Data models for Projects, Tasks, Sprints, Resources
- Integration adapter pattern
- Event sourcing for audit trail
- CQRS for reporting

**Stage 5 - Testing Strategy**:
- Comprehensive unit test coverage (80%+)
- Integration tests for all integrations
- E2E tests for critical workflows
- Permission testing matrix
- Performance tests for large projects
- Security penetration testing
- Compliance validation tests

---

## Example 4: Online Learning Platform

### System Description
```
A modern online learning platform similar to Udemy or Coursera. Instructors can
create and publish courses with video lectures, quizzes, assignments, and
certificates. Students can enroll in courses, track progress, participate in
discussions, submit assignments, and earn certificates. The platform should
support live classes via video conferencing, course recommendations, student
reviews and ratings, payment processing for paid courses, and instructor
analytics. Admin features include course approval, user management, and
revenue sharing calculations.
```

### Expected Outputs

**Stage 1 - Requirements**:
- Instructor onboarding and verification
- Course creation and management
- Video upload and streaming
- Quiz and assignment builder
- Student enrollment and learning
- Progress tracking
- Discussion forums
- Live class scheduling and delivery
- Payment and subscription management
- Certificate generation
- Review and rating system
- Recommendation engine
- Admin moderation tools

**Stage 2 - Requirements Review**:
- Content moderation and quality control
- Plagiarism detection for assignments
- Accessibility (closed captions, transcripts)
- Mobile app requirements
- Offline video download
- Multi-language support
- Email notification system

**Stage 3 - Architecture**:
- Next.js for frontend
- Node.js microservices
- Video streaming (AWS MediaConvert, CloudFront)
- PostgreSQL for structured data
- MongoDB for course content
- Redis for caching
- Elasticsearch for course search
- WebRTC for live classes
- Stripe for payments
- AWS S3 for video storage

**Stage 4 - Technical Design**:
- Video player component with controls
- Course builder UI components
- API endpoints for CRUD operations
- Video processing pipeline
- Data models for Courses, Lessons, Enrollments
- Payment processing flow
- Certificate generation service
- Recommendation algorithm

**Stage 5 - Testing Strategy**:
- Unit tests for business logic
- Integration tests for payment flow
- E2E tests for student learning journey
- Video streaming performance tests
- Load testing for live classes
- Browser compatibility testing
- Mobile responsive testing

---

## Tips for Writing System Descriptions

### Be Specific About:
1. **User Types**: Who will use the system (students, teachers, admins, etc.)
2. **Core Features**: The main functionality users need
3. **Integrations**: Third-party services or APIs needed
4. **Scale**: Expected user base and data volume
5. **Platforms**: Web, mobile, desktop requirements
6. **Compliance**: Any regulatory or security requirements

### Good System Description Template:
```
A [type of application] for [target users] that allows them to [primary goal].

Core features include:
- [Feature 1]
- [Feature 2]
- [Feature 3]

The system should integrate with [external services] and support [specific
requirements like mobile, real-time, offline, etc.].

[Any compliance, security, or performance requirements]
```

### Examples of Different Complexity Levels:

**Simple** (10-15 user stories):
- Todo list app with categories and reminders

**Medium** (20-30 user stories):
- Recipe sharing platform
- Fitness tracking app
- Blog platform with CMS

**Complex** (40+ user stories):
- E-commerce marketplace
- Project management tool
- Online learning platform
- Healthcare management system

---

## What to Expect at Each Stage

### Stage 1: Business Analyst (2-4 minutes)
- Detailed user stories in standard format
- Acceptance criteria for each story
- Priority and complexity estimates
- Consideration of edge cases

### Stage 2: Requirements Reviewer (1-2 minutes)
- Gap analysis
- Missing requirements identified
- Additional user stories if needed
- Quality validation

### Stage 3: Technical Architect (2-3 minutes)
- High-level architecture
- C4 diagrams described in text
- Technology stack recommendations
- Architectural decision rationale

### Stage 4: Technical Designer (3-5 minutes)
- Component specifications
- Complete API documentation
- Data models and ERD
- Error handling strategy

### Stage 5: Testing Strategist (2-3 minutes)
- Comprehensive test strategy
- Test case examples
- Tool recommendations
- Performance benchmarks

**Total Time**: 10-20 minutes depending on system complexity and iterations

---

## Sample Interaction Flow

```
$ npm start

╔════════════════════════════════════════════════════════════════════════════╗
║             AI Agent Wizard - Software Development Lifecycle               ║
╚════════════════════════════════════════════════════════════════════════════╝

This wizard will guide you through:
  1. Requirements & User Stories (Business Analyst)
  2. Requirements Review (Requirements Reviewer)
  3. Technical Architecture & Stack (Technical Architect)
  4. Technical Design & API Specs (Technical Designer)
  5. Testing Strategy (Testing Strategist)

Please provide a high-level description of the system you want to build:

System Description: A recipe sharing platform where users can post recipes...

────────────────────────────────────────────────────────────────────────────
  Step 1/5: Requirements & User Stories
────────────────────────────────────────────────────────────────────────────

✔ Business Analyst & Requirements Manager completed

════════════════════════════════════════════════════════════════════════════
  Requirements & User Stories
════════════════════════════════════════════════════════════════════════════

[Generated requirements display here]

════════════════════════════════════════════════════════════════════════════

Saved to: /path/to/output/1-businessAnalyst.md

Please review the output above.

Options:
  1. Accept and continue to next step
  2. Request changes (provide feedback)
  3. Quit wizard

Your choice (1/2/3): 1

[Continues through all 5 stages...]

╔════════════════════════════════════════════════════════════════════════════╗
║                     Wizard Completed Successfully!                         ║
╚════════════════════════════════════════════════════════════════════════════╝

All outputs have been saved to the "output" directory.
```