# Quality Gates

> Drop this file into `.claude/rules/` to auto-load for all teammates.
> Skip this if your project's CLAUDE.md already includes agent teams rules.

## Pre-Completion Checklist

Before marking any task as `completed`, verify ALL of the following:

1. **Tests pass**: Run the project's test suite. If tests fail, the task is not complete.
2. **Linter clean**: No new lint errors or warnings introduced by your changes.
3. **Changes verified**: If no test suite exists, manually verify your changes work as expected.
4. **Acceptance criteria met**: Re-read the task description and confirm every criterion is satisfied.
5. **No partial implementation**: All code paths are complete. No TODO comments left in new code.

If any check fails, keep the task as `in_progress` and fix the issue before completing.

## When to Use Plan Mode

Spawn a teammate with `mode: "plan"` when their task involves:

- **Authentication or authorization** changes
- **Data model or schema** migrations
- **API contract** changes (endpoints, request/response shapes)
- **Infrastructure** modifications (CI/CD, deployment, cloud resources)
- **Deletion** of existing functionality

The teammate will write a plan first. The lead reviews and approves before implementation begins.

## Cross-Agent Review (Optional)

For high-stakes changes, the lead can assign a review task:

1. Implementation agent completes their task and messages the lead
2. Lead creates a review task assigned to a different agent
3. Reviewer reads the implementation agent's files (read-only — they do not own those files)
4. Reviewer messages the lead with findings
5. Lead creates fix tasks if needed, assigned back to the original implementer
