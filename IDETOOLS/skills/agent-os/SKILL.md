---
name: agent-os
description: >
  Implementation workflow companion to Design OS. Takes spec-driven designs
  and scaffolds implementation with AI agents. Based on Agent OS by buildermethods.
  Trigger on /agent-os, /implement-spec.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
context: fork
---
# ©2026 Brad Scheller

# Agent OS — Spec-to-Implementation

**Source:** [github.com/buildermethods/agent-os](https://github.com/buildermethods/agent-os)
**Companion:** [github.com/buildermethods/design-os](https://github.com/buildermethods/design-os)

**Purpose:** Takes implementation-ready specs from Design OS and orchestrates AI agents to build the project. Bridges the gap between "what to build" and "built."

## Trigger Commands

- `/agent-os` — Start implementation from specs
- `/implement-spec` — Alias
- `/agent-os scaffold` — Generate project structure from specs
- `/agent-os components` — Build components from design system spec
- `/agent-os features` — Implement features from feature map
- `/agent-os review` — Compare implementation against specs

## Workflow

### Step 1: Spec Ingestion
Read and validate the Design OS output:
- `specs/implementation-spec.md` — Primary source
- `specs/design-tokens.md` — Style constants
- `specs/component-library.md` — Component definitions
- `specs/feature-map.md` — Feature requirements

### Step 2: Project Scaffolding
Generate the project structure based on the tech stack:
- Detect or prompt for framework (Next.js, React, etc.)
- Create directory structure
- Initialize config files
- Set up design tokens as code (CSS variables, theme object)

### Step 3: Component Generation
Build reusable components from the component library spec:
- Map spec components to framework components
- Implement all states and variants
- Apply design tokens
- Add basic accessibility attributes

### Step 4: Feature Implementation
Implement features per the feature map:
- Delegate each feature to appropriate specialist agents
- Follow priority ordering from the spec
- Wire components into pages/routes

### Step 5: Spec Compliance Review
Compare built artifacts against the original specs:
- Check all features are implemented
- Verify component coverage
- Validate design token usage
- Report gaps and deviations

## Integration Pattern

```
Design OS (Phase 1-4)
    │
    ▼ specs/implementation-spec.md
    │
Agent OS (Steps 1-5)
    │
    ▼ Working application
    │
Review & Iterate
```

## Agent Delegation

Agent OS delegates to specialist agents:

| Task | Agent | Model |
|------|-------|-------|
| Scaffolding | coder | sonnet |
| Components | coder | sonnet |
| Styling | coder | sonnet |
| API routes | architect → coder | sonnet |
| Testing | tdd | sonnet |
| Accessibility | reviewer | sonnet |

## Key Principles

1. **Spec is the source of truth** — All implementation decisions trace back to specs
2. **Incremental delivery** — Build in layers: tokens → components → pages → features
3. **Automated verification** — Every step validates against the spec
4. **Framework-flexible** — Works with any frontend/backend framework
