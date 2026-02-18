# Parallel Feature Build

## Pattern Name

Independent Modules — N agents each build a separate module or feature in parallel.

## When to Use

- Building multiple features or modules that don't share source files
- Greenfield development with clearly separable components
- Adding functionality across multiple independent areas of a codebase
- Sprint work with several independent user stories

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Creates shared foundation, defines interfaces, coordinates, integrates | Delegate mode | Shared config files only |
| **builder-1** | Builds module/feature 1 | Full access | Owns: module 1 files |
| **builder-2** | Builds module/feature 2 | Full access | Owns: module 2 files |
| **builder-N** | Builds module/feature N | Full access | Owns: module N files |
| **integrator** (optional) | Wires modules together, runs full test suite | Full access | Owns: integration files |

## Task Dependency Graph (Diamond Pattern)

```
Task 0: Setup (shared deps, types, interfaces)     (lead or designated agent)
    ↓
Task 1: Build module A          (builder-1, blocked by 0)
Task 2: Build module B          (builder-2, blocked by 0)     ← parallel
Task 3: Build module C          (builder-3, blocked by 0)
    ↓
Task 4: Integration + final tests    (integrator, blocked by 1+2+3)
```

## Example Prompt

```
Create a team called "feature-build" to build [PROJECT/FEATURE DESCRIPTION].

Setup (before parallel work):
- Install dependencies: [LIST]
- Create shared types/interfaces in [SHARED TYPES FILE]
- These shared types are read-only for all builders

Modules to build in parallel:
1. [MODULE A]: [Description]. Files: [src/module-a/...]
2. [MODULE B]: [Description]. Files: [src/module-b/...]
3. [MODULE C]: [Description]. Files: [src/module-c/...]

Team:
- "builder-1": Build module A. Files you own: [list]. Files you may read: [shared types]. Acceptance criteria: [list].
- "builder-2": Build module B. Files you own: [list]. Files you may read: [shared types]. Acceptance criteria: [list].
- "builder-3": Build module C. Files you own: [list]. Files you may read: [shared types]. Acceptance criteria: [list].

After all builders complete:
- Integration task: wire modules together in [ENTRY POINT], run full test suite.

File ownership is strict — no builder edits another builder's files or shared configs.
```

## File Ownership Plan

```
lead:       package.json, tsconfig.json, shared config
builder-1:  src/module-a/**
builder-2:  src/module-b/**
builder-3:  src/module-c/**
integrator: src/index.ts (or entry point), integration tests

Shared types file: created by lead in setup, READ-ONLY for builders
```

- Each builder owns their entire module directory
- No file appears in two builders' ownership lists
- Shared types/interfaces are created during setup and frozen

## What to Watch For

- **Shared dependency changes**: Builders MUST message the lead to add dependencies — only the lead edits `package.json`.
- **Interface drift**: Define shared interfaces precisely in the setup task, with examples. Ambiguity here breaks integration.
- **Hidden coupling**: Identify shared resources (DB tables, API endpoints, state) in setup and designate one owner.

## Customization

- **Scale**: 2 builders minimum, add more as needed. Keep file ownership strict.
- **Without integrator**: Lead handles integration after all builders complete.
