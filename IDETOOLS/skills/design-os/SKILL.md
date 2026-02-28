---
name: design-os
description: >
  Spec-Driven Development (SDD) workflow based on Design OS by Brian Casel.
  4-phase, 7-step process for going from product idea to implementation-ready specs.
  Uses structured slash commands for each phase. Trigger on /design-os, /sdd.
allowed-tools: Read, Write, Edit, Glob, Grep
context: fork
---
# ©2026 Brad Scheller

# Design OS — Spec-Driven Development

**Source:** [github.com/buildermethods/design-os](https://github.com/buildermethods/design-os) (~1,400 stars)
**Companion:** [github.com/buildermethods/agent-os](https://github.com/buildermethods/agent-os)

**Purpose:** A structured 4-phase workflow that transforms product ideas into implementation-ready specifications. Ensures AI-assisted development starts from clear, complete specs rather than vague requirements.

## Trigger Commands

- `/design-os` — Start a new Design OS workflow or show current progress
- `/sdd` — Alias for `/design-os`
- `/design-os phase <N>` — Jump to a specific phase

## The 4 Phases

### Phase 1: Product Planning
Define the product concept, user stories, and feature requirements.

**Steps:**
1. **Product Brief** — Define the product vision, target users, and core value proposition
2. **Feature Map** — Break down features into user-facing capabilities with priority levels

**Output:** `specs/product-brief.md`, `specs/feature-map.md`

### Phase 2: Design System
Establish the visual and interaction foundations before designing any screens.

**Steps:**
3. **Design Tokens** — Colors, typography, spacing, shadows, breakpoints
4. **Component Library** — Reusable UI components with states and variants

**Output:** `specs/design-tokens.md`, `specs/component-library.md`

### Phase 3: Section Design
Design individual sections/screens using the established design system.

**Steps:**
5. **Page Layouts** — Wireframe-level layouts with component placement
6. **Interaction Specs** — User flows, transitions, error states, loading states

**Output:** `specs/pages/*.md`, `specs/interactions/*.md`

### Phase 4: Export & Handoff
Package specs for implementation by human devs or AI agents.

**Steps:**
7. **Implementation Spec** — Complete handoff document with all decisions resolved

**Output:** `specs/implementation-spec.md`

## Workflow

```
/design-os
  → Choose: "Start new" or "Resume existing"
  → Phase 1: Product Planning
    → /design-os brief — Write product brief
    → /design-os features — Create feature map
  → Phase 2: Design System
    → /design-os tokens — Define design tokens
    → /design-os components — Spec component library
  → Phase 3: Section Design
    → /design-os pages — Layout page designs
    → /design-os interactions — Spec interactions
  → Phase 4: Export
    → /design-os export — Generate implementation spec
```

## Integration with Agent OS

After Phase 4, hand off to **Agent OS** for implementation:
- Agent OS reads `specs/implementation-spec.md`
- Generates project scaffolding from specs
- Creates components matching the design system
- Implements features per the feature map

## File Structure

```
project/
├── specs/
│   ├── product-brief.md
│   ├── feature-map.md
│   ├── design-tokens.md
│   ├── component-library.md
│   ├── pages/
│   │   └── *.md
│   ├── interactions/
│   │   └── *.md
│   └── implementation-spec.md
└── .design-os/
    └── progress.json         # Phase tracking
```

## Key Principles

1. **Specs before code** — Never start coding without a complete spec
2. **Design system first** — Establish foundations before screens
3. **Progressive refinement** — Each phase builds on the previous
4. **Implementation-agnostic** — Specs work for any tech stack
5. **AI-native** — Designed for AI agents to consume and produce

## When to Use

- Starting a new product or feature
- Redesigning an existing product
- Creating a design system from scratch
- Preparing specs for AI-assisted development
- Bridging design and engineering teams
