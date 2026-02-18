# Test Coverage Blitz

## Pattern Name

Parallel Test Writing — multiple agents write tests for different modules simultaneously.

## When to Use

- Test coverage is low and you need to improve it quickly across many modules
- Preparing for a major refactor and need a safety net of tests first
- Onboarding a legacy codebase that lacks tests
- Sprint goal includes coverage targets per module
- Pre-release hardening

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Identifies modules, sets coverage targets, assigns agents, tracks coverage | Delegate mode | None |
| **tester-1** | Writes tests for module 1 | Full access | Owns: module 1 test files ONLY |
| **tester-2** | Writes tests for module 2 | Full access | Owns: module 2 test files ONLY |
| **tester-N** | Writes tests for module N | Full access | Owns: module N test files ONLY |

## Task Dependency Graph

```
Task 0: Setup test infrastructure       (lead — install deps, configure runner)
    ↓
Task 1: Write tests for module A        (tester-1, blocked by 0)
Task 2: Write tests for module B        (tester-2, blocked by 0)     ← all parallel
Task 3: Write tests for module C        (tester-3, blocked by 0)
```

No integration task needed — test files are independent by nature.

## Example Prompt

```
Create a team called "test-blitz" to improve test coverage across [PROJECT].

Current state: [COVERAGE LEVEL — e.g., "~30% overall, most modules have zero tests"]
Target: [COVERAGE TARGET — e.g., "80% line coverage per module"]
Test framework: [FRAMEWORK — e.g., Jest, pytest, go test]

Modules to cover:
1. [src/module-a/] — [Brief description of what it does]
2. [src/module-b/] — [Brief description of what it does]
3. [src/module-c/] — [Brief description of what it does]

Team:
- "tester-1": Write tests for [module A]. Files you own: [src/module-a/__tests__/*, or src/module-a/*.test.ts]. You may READ source files in [src/module-a/] but MUST NOT edit them. Cover: happy paths, edge cases, error cases. Target: [N]% coverage.
- "tester-2": Write tests for [module B]. Same rules. Files you own: [test file paths].
- "tester-3": Write tests for [module C]. Same rules. Files you own: [test file paths].

CRITICAL: Testers read source code but NEVER edit it. You own only test files.

Each tester: run your tests before marking complete. All tests must pass.
```

## File Ownership Plan

```
lead:      package.json (if test deps needed), test config files
tester-1:  src/module-a/__tests__/**  OR  src/module-a/*.test.ts
tester-2:  src/module-b/__tests__/**  OR  src/module-b/*.test.ts
tester-3:  src/module-c/__tests__/**  OR  src/module-c/*.test.ts
```

**The fundamental rule**: testers READ source code but NEVER edit it. They own ONLY test files.

This is what makes the pattern safe for parallelism — test files for different modules never conflict, and no one touches the source.

## What to Watch For

- **Source edits**: Testers MUST NOT "fix" bugs they find. Report as a new task, keep writing tests against current behavior.
- **Flaky tests**: Require deterministic tests — no random data, no timing dependencies, proper mocking.
- **Coverage gaming**: Require at least one meaningful assertion per test case. Executing lines without asserting is worthless.

## Customization

- **Scale**: One tester per module. Scales well since test files never conflict. 2 testers minimum.
- **With coverage reporting**: Add a final task that runs coverage and reports per-module numbers.
