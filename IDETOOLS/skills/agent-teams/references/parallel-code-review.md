# Parallel Code Review

## Pattern Name

Reviewer + Fixer — one agent finds issues, another fixes them live.

## When to Use

- You have a body of code to review and fix in one pass
- Review findings are independent enough that fixes don't conflict
- You want separation of concerns: the reviewer stays objective, the fixer stays focused
- Code review before a release, after a large merge, or for a new contributor's work

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Coordinates, creates tasks, synthesizes final report | Delegate mode | None (does not edit) |
| **reviewer** | Reads code, writes findings report, messages fixer | Read-only analysis | Owns: `review-report.md` |
| **fixer** | Implements fixes based on reviewer's findings | Full access | Owns: all source files being fixed |
| **tester** (optional) | Writes tests for the fixes | Full access | Owns: test files only |

## Task Dependency Graph

```
Task 1: Review [module/scope]          (reviewer)
    ↓
Task 2: Fix findings from review       (fixer, blocked by Task 1)
    ↓
Task 3: Write tests for fixes          (tester, optional, blocked by Task 2)
    ↓
Task 4: Final validation               (lead, blocked by Task 2 or 3)
```

## Example Prompt

```
Create a team called "code-review" to review and fix [MODULE OR DIRECTORY].

Team structure:
- "reviewer": Read all files in [DIRECTORY]. Look for: [ISSUE TYPES — e.g., security vulnerabilities, performance problems, error handling gaps, code style violations]. Write findings to review-report.md with file path, line number, severity, and recommended fix for each issue. Message "fixer" with each finding as you go.
- "fixer": Wait for reviewer's findings. Fix each issue in the source files. Run tests after each fix. Message "reviewer" if a recommended fix doesn't work.
- (Optional) "tester": After fixer completes, write regression tests for each fix.

File ownership:
- reviewer owns: review-report.md
- fixer owns: all files in [DIRECTORY] except test files
- tester owns: all test files in [DIRECTORY]

After all tasks complete, synthesize the review into a summary.
```

## File Ownership Plan

- Reviewer: only the report file. Reviewer MUST NOT edit source files.
- Fixer: all source files in scope. Fixer does not write the report.
- Tester: test files only. Tester reads source but does not edit it.
- No overlap between agents.

## What to Watch For

- **Fixer bottleneck**: If reviewer finds many issues, have reviewer batch findings (5 at a time) rather than streaming one by one.
- **Fix cascades**: One fix breaks something else. Fixer should run tests after each fix, not batch them.
- **Reviewer scope creep**: Keep findings to specific issues, not architectural suggestions.

## Customization

- **Scale up**: Add multiple fixers, each owning a different subdirectory
- **Scale down**: Skip the tester; have the fixer run existing tests instead
