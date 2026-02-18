# Team Coordination Rules

> Drop this file into `.claude/rules/` to auto-load for all teammates.
> Skip this if your project's CLAUDE.md already includes agent teams rules.

## Task Claiming Protocol

1. Check `TaskList` for available work (status: `pending`, no owner, empty `blockedBy`)
2. Prefer the **lowest-ID** available task — earlier tasks set up context for later ones
3. Claim with `TaskUpdate`: set `status: "in_progress"` and `owner: your-name`
4. Read the full task description with `TaskGet` before starting work

## Status Reporting

- **Starting work**: Set task to `in_progress` BEFORE writing any code
- **Completed**: Set task to `completed` AFTER verifying all acceptance criteria
- **After completion**: Message the lead with a summary of changes and any issues found
- **After completion**: Call `TaskList` to find your next available task
- **Discovered extra work**: Create a new task with `TaskCreate` — do not expand current scope

## Message Discipline

- **Direct message by name**: All normal communication (findings, questions, completion reports, blockers)
- **Broadcast**: ONLY for critical issues affecting the entire team (e.g., "shared API is down, everyone stop")
- **When blocked**: Message the lead immediately with the specific blocker — do not wait silently

## Idle Behavior

- Going idle between turns is **normal and expected** — it is not an error
- Idle teammates **can receive messages** — sending a message wakes them
- The system sends idle notifications automatically; no action needed from teammates
- Leads: do not treat idle notifications as "agent is done." Check `TaskList` instead.
- Leads: wait at least 60 seconds between status checks
