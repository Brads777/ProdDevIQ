---
name: openclaw-autonomous
description: >
  Autonomous execution framework for long-running, multi-session AI agent tasks.
  Based on OpenClaw patterns (autonomous task decomposition, self-correction,
  progress checkpointing, and headless execution). Trigger on /openclaw, /autonomous.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
context: fork
---
# ©2026 Brad Scheller

# OpenClaw — Autonomous Execution Framework

**Purpose:** Enable AI agents to execute complex, long-running tasks autonomously across multiple sessions. Handles task decomposition, progress checkpointing, self-correction, and resumption after interruptions.

## Trigger Commands

- `/openclaw` — Show autonomous task status
- `/openclaw start "<task>"` — Begin an autonomous task
- `/openclaw resume` — Resume the last interrupted task
- `/openclaw status` — Check progress on running tasks
- `/autonomous` — Alias for `/openclaw`

## Core Concepts

### Task Decomposition
Break complex tasks into atomic, independently verifiable steps:

```
Complex Task: "Migrate auth system from JWT to session-based"
  ├── Step 1: Audit current JWT usage (READ-ONLY)
  ├── Step 2: Design session schema (SPEC)
  ├── Step 3: Create session store (CODE)
  ├── Step 4: Update login endpoint (CODE)
  ├── Step 5: Update middleware (CODE)
  ├── Step 6: Update logout endpoint (CODE)
  ├── Step 7: Migration script for existing sessions (CODE)
  ├── Step 8: Update tests (TEST)
  └── Step 9: Integration test (VERIFY)
```

### Progress Checkpointing
After each step, save state to disk:

```
.openclaw/
├── task.json           # Task definition and decomposition
├── progress.json       # Current step, completed steps, timestamps
├── checkpoints/
│   ├── step-1.json     # State after step 1
│   ├── step-2.json     # State after step 2
│   └── ...
└── corrections.log     # Self-correction history
```

### Self-Correction Loop
When a step fails:
1. **Detect** — Check step output against expected outcome
2. **Diagnose** — Analyze error, check for common patterns
3. **Correct** — Apply fix (max 3 retry attempts per step)
4. **Log** — Record what failed and how it was fixed (feeds into ECC/instinct-learning)
5. **Escalate** — If 3 retries fail, pause and ask user

### Session Resumption
When context runs out or session ends:
1. Save current state to `.openclaw/progress.json`
2. Write a resume prompt to `.openclaw/resume.md`
3. On next session: read resume prompt, restore context, continue

## Autonomous Workflow

```
/openclaw start "Implement user dashboard"
  → Decompose into steps
  → For each step:
    → Execute step
    → Verify output
    → Checkpoint progress
    → Self-correct if needed
  → Report completion
```

## Task Definition Format

```json
{
  "id": "task-001",
  "description": "Implement user dashboard",
  "created": "2026-02-07T12:00:00Z",
  "status": "in_progress",
  "current_step": 3,
  "total_steps": 8,
  "steps": [
    {
      "id": 1,
      "type": "READ_ONLY",
      "description": "Audit existing routes and components",
      "status": "completed",
      "retries": 0
    },
    {
      "id": 2,
      "type": "SPEC",
      "description": "Design dashboard layout and data requirements",
      "status": "completed",
      "retries": 0
    },
    {
      "id": 3,
      "type": "CODE",
      "description": "Create DashboardPage component",
      "status": "in_progress",
      "retries": 0
    }
  ]
}
```

## Integration

- **ECC patterns** — Corrections feed into instinct-learning
- **unified-orchestrator** — Steps can be delegated to specialist agents
- **design-os** — Specs from Design OS become OpenClaw task inputs

## Safety Rules

1. **Never skip checkpointing** — Always save state after each step
2. **Max 3 retries** — Escalate to user after 3 failed attempts
3. **Read-only steps first** — Understand before modifying
4. **Verify before proceeding** — Each step must pass verification
5. **User approval for destructive steps** — Deletions, migrations, deploys
