# Task Sizing Rules

> Drop this file into `.claude/rules/` to auto-load for all teammates.
> Skip this if your project's CLAUDE.md already includes agent teams rules.

## The Golden Rule

**One task = one agent, one deliverable, one file set.**

A well-sized task can be completed in a single focused session without the agent's context window filling up.

## Sizing Guide

### Too Small (coordination overhead > benefit)

- "Add an import statement to file X"
- "Rename variable `foo` to `bar` in one file"
- "Add a comment to function Y"

These should be folded into a larger task or handled as part of another task's scope.

### Right Size (one clear deliverable)

- "Implement the login form component with validation"
- "Write unit tests for the UserService module"
- "Refactor the payment module from callbacks to async/await"
- "Add error handling to all API route handlers in src/routes/"

Each of these takes meaningful effort, produces a testable result, and owns a clear set of files.

### Too Large (agent works forever, context fills)

- "Build the entire authentication system"
- "Refactor the whole codebase to TypeScript"
- "Write tests for everything"

Break these into 5–6 tasks per teammate, each with a specific deliverable.

## Aim for 5–6 Tasks Per Teammate

This gives enough granularity for progress tracking without drowning in coordination overhead. If you have 3 teammates, plan for roughly 15–18 total tasks.

## Dependency Patterns

### Pipeline (sequential)

```
Task A → Task B → Task C
```
Each task blocks the next. Use when output of one task is input to the next.

### Fan-Out (parallel from one root)

```
Setup Task → Task A
           → Task B
           → Task C
```
One blocking task (e.g., install deps, create shared types) then N independent tasks.

### Fan-In (parallel converging)

```
Task A →
Task B → Integration Task
Task C →
```
N independent tasks all block a final integration/assembly task.

### Diamond (fan-out + fan-in)

```
Setup → Task A →
      → Task B → Integration
      → Task C →
```
Most common pattern for feature builds: setup → parallel work → integration.

Every task description must include file ownership lists. See the task description format in CLAUDE.md.
