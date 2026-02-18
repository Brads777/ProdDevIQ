# Large Refactor

## Pattern Name

Module-by-Module — agents apply the same refactoring pattern to different parts of the codebase in parallel.

## When to Use

- Applying a consistent change across many modules/directories (e.g., callback → async/await, class → functional, add error handling everywhere)
- The codebase is large enough that a single agent would fill its context window
- Modules are independent enough to be refactored without cross-module coordination
- Migration work: updating API versions, swapping libraries, changing patterns

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Defines the refactoring pattern, updates shared interfaces first, coordinates, validates | Delegate mode | Shared interfaces and config |
| **refactorer-1** | Applies pattern to module/directory 1 | Full access | Owns: module 1 files |
| **refactorer-2** | Applies pattern to module/directory 2 | Full access | Owns: module 2 files |
| **refactorer-N** | Applies pattern to module/directory N | Full access | Owns: module N files |
| **validator** (optional) | Runs full test suite, checks consistency across modules | Read-only | Owns: validation report |

## Task Dependency Graph

```
Task 0: Update shared interfaces/types    (lead or designated agent)
    ↓
Task 1: Refactor module A       (refactorer-1, blocked by 0)
Task 2: Refactor module B       (refactorer-2, blocked by 0)     ← parallel
Task 3: Refactor module C       (refactorer-3, blocked by 0)
    ↓
Task 4: Full test suite + consistency check    (validator, blocked by 1+2+3)
```

## Example Prompt

```
Create a team called "refactor-[PATTERN]" to apply [REFACTORING DESCRIPTION] across the codebase.

The refactoring pattern:
[DETAILED DESCRIPTION — e.g., "Convert all callback-based async functions to async/await. Replace .then() chains with await. Replace .catch() with try/catch. Update function signatures to return Promise<T>."]

Before/after example:

    // Before
    function getUser(id, callback) {
      db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      });
    }

    // After
    async function getUser(id): Promise<User> {
      const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    }

Shared interface changes (do this first, blocks everything):
- [LIST SHARED TYPE/INTERFACE CHANGES]

Modules to refactor in parallel:
1. [src/module-a/] — [N files, brief description]
2. [src/module-b/] — [N files, brief description]
3. [src/module-c/] — [N files, brief description]

Team:
- "refactorer-1": Refactor all files in [src/module-a/]. Apply the pattern consistently. Run module tests after each file. Files you own: [list].
- "refactorer-2": Refactor all files in [src/module-b/]. Same pattern. Files you own: [list].
- "refactorer-3": Refactor all files in [src/module-c/]. Same pattern. Files you own: [list].

After all refactoring: run the full test suite and verify consistency.
```

## File Ownership Plan

```
lead:          shared types, interfaces, config files
refactorer-1:  src/module-a/** (source + tests)
refactorer-2:  src/module-b/** (source + tests)
refactorer-3:  src/module-c/** (source + tests)
validator:     validation-report.md (read-only access to everything else)
```

- Each refactorer owns their entire module directory including tests
- Shared interfaces are updated FIRST by the lead (blocking task)
- No refactorer edits files outside their module

## What to Watch For

- **Inconsistent application**: Provide a clear before/after example in every task description. Different agents will interpret vague patterns differently.
- **Shared interface breakage**: Only the lead edits shared interfaces. Refactorers message the lead if they need changes.
- **Cross-module imports**: Identify import dependencies between modules in setup. If Module A imports from Module B, both refactorers need to coordinate.

## Customization

- **Scale**: 2 refactorers minimum, one per module directory
- **Without shared interfaces**: If purely internal changes, skip Task 0 and start all refactorers immediately
