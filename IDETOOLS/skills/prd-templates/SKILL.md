---
name: prd-templates
description: >-
  Professional document templates for product development including PRD,
  technical spec, user stories, sprint plan, competitive analysis, risk
  assessment, and constraints/tradeoffs. Use when creating product
  documentation, planning sprints, or preparing technical specifications.
---
# ©2026 Brad Scheller

# PRD Templates

A collection of 7 professional product development document templates. Each template is structured with sections, prompts for gathering user input, and best-practice formatting.

## Templates

### 1. Product Requirements Document (`references/prd.md`)
The core product document. Covers executive summary, project overview, vision, target users, value propositions, feature roadmap, and success metrics. Start here when defining a new product.

### 2. Technical Specification (`references/technical-spec.md`)
Architecture and implementation details. Covers system overview, architecture decisions, data models, API design, infrastructure, and deployment strategy. Use after the PRD is established.

### 3. User Stories (`references/user-stories.md`)
Blackbox testing scenarios organized by feature area. Covers authentication flows, dashboard navigation, CRUD operations, and edge cases. Derive from the PRD and technical spec.

### 4. Sprint Plan (`references/sprint-plan.md`)
Sprint timeline and backlog breakdown. Covers sprint overview, task decomposition with story points, definition of done, and risk/blocker tracking. Use when transitioning from planning to execution.

### 5. Competitive Analysis (`references/competitive-analysis.md`)
Market and competitor research framework. Covers market overview, competitor feature matrices, SWOT analysis, and strategic recommendations. Use during early product discovery.

### 6. Risk Assessment (`references/risk-assessment.md`)
Risk identification and mitigation planning. Covers technical, business, operational, and external risks with probability/impact matrices and mitigation strategies. Use before major milestones.

### 7. Constraints and Tradeoffs (`references/constraints-and-tradeoffs.md`)
Technical and business constraint documentation. Covers infrastructure, performance, security/compliance, budget, timeline, and explicit tradeoff decisions. Use to align stakeholders on boundaries.

## Recommended Workflow

1. **Discovery**: Competitive Analysis -> Constraints and Tradeoffs
2. **Definition**: PRD -> Technical Spec -> Risk Assessment
3. **Planning**: User Stories -> Sprint Plan
4. **Execution**: Reference documents during development

## Usage

Each template contains section headers with prompts that guide the conversation. Fill in sections interactively by asking the user relevant questions at each stage. Templates reference each other (e.g., sprint plan derives from PRD features, user stories derive from PRD and tech spec).
