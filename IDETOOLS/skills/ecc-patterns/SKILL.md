---
name: ecc-patterns
description: >
  Engineered Compound Cognition (ECC) methodology patterns. Every task compounds
  into future efficiency. Includes context architecture, instinct accumulation,
  and systematic knowledge capture. Trigger on /ecc, /compound.
allowed-tools: Read, Write, Edit, Glob, Grep
context: fork
---
# ©2026 Brad Scheller

# ECC — Engineered Compound Cognition

**Purpose:** A methodology where every unit of work compounds into future efficiency. Unlike one-shot task completion, ECC ensures that completed work leaves behind tools, patterns, and knowledge that accelerate all subsequent tasks.

## Trigger Commands

- `/ecc` — Show ECC status (accumulated instincts, patterns, tools)
- `/ecc audit` — Audit recent work for missed compounding opportunities
- `/compound` — After completing a task, extract compounding value
- `/ecc setup` — Initialize ECC in the current project

## Core Principles

### 1. Compound Engineering
Every task should produce MORE than its immediate deliverable:
- **Code** → also produces reusable patterns and utility functions
- **Debugging** → also produces diagnostic instincts
- **Architecture** → also produces decision records and design principles
- **Configuration** → also produces templates for future projects

### 2. Context Architecture
Structure information flow to maximize KV-cache efficiency:
- **Stable prefixes** — CLAUDE.md and rules files load first, never change mid-session
- **Append-only context** — Never modify previous observations
- **File System as Context** — Store large data as files, reference by path
- **Delegation for isolation** — Verbose operations go to subagents

### 3. Instinct Accumulation
Build a library of "instincts" — learned patterns that become automatic:
- **Architecture instincts** — "This type of project needs X structure"
- **Debugging instincts** — "This error usually means Y"
- **Tool instincts** — "For this task, use Z approach"
- **Convention instincts** — "This team/project does it this way"

### 4. Knowledge Persistence Hierarchy

| Level | Storage | Scope | Lifetime |
|-------|---------|-------|----------|
| Session | Context window | This conversation | Session |
| Project | CLAUDE.local.md | This project | Persistent |
| Auto Memory | ~/.claude/projects/ | This project | Persistent |
| Global | ~/CLAUDE.md | All projects | Persistent |
| Skillpository | IDETOOLS/ | Shareable | Permanent |

## ECC Audit Checklist

After completing any task, run `/ecc audit` to check:

- [ ] **Pattern extracted?** — Was a reusable pattern identified?
- [ ] **Template created?** — Could this be templated for future use?
- [ ] **Rule codified?** — Should a new rule file be added?
- [ ] **Instinct captured?** — Was a debugging/architecture insight learned?
- [ ] **Tool improved?** — Could an existing skill be enhanced?
- [ ] **Knowledge persisted?** — Was project-specific knowledge saved?

## ECC Setup

`/ecc setup` initializes a project for compound cognition:

1. Creates `CLAUDE.local.md` for project instincts (gitignored)
2. Ensures `.claude/rules/` directory exists
3. Verifies Auto Memory is enabled
4. Creates `.ecc/` directory for compound tracking:
   ```
   .ecc/
   ├── instincts.md        # Accumulated instincts
   ├── patterns.md         # Extracted patterns
   ├── audit-log.md        # Completed audits
   └── compound-score.json # Tracking metrics
   ```

## Compound Score

Track how effectively work is compounding:

```json
{
  "tasks_completed": 42,
  "instincts_captured": 18,
  "patterns_extracted": 7,
  "rules_created": 3,
  "templates_generated": 2,
  "compound_ratio": 0.71
}
```

**Target:** compound_ratio > 0.5 (at least half of tasks produce reusable artifacts)

## Integration with Other Skills

- **instinct-learning** — `/learn` is the extraction mechanism for ECC
- **kv-cache-optimization** — Context Architecture principles from ECC
- **unified-orchestrator** — Delegation patterns align with ECC's context isolation
