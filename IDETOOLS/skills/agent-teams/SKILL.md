---
name: agent-teams
description: >-
  Team coordination framework for multi-agent Claude Code sessions. Provides
  file ownership, task sizing, quality gates, and recovery playbooks. Use
  when orchestrating 2+ agents working in parallel on a shared codebase.
allowed-tools: Read, Glob, Grep, Bash
---
# ©2026 Brad Scheller

# Agent Teams

Team coordination framework for multi-agent Claude Code sessions. Covers when to use teams, role definitions, file ownership, task protocol, communication, quality gates, and recovery playbooks.

## When to Use Teams

- Need 2+ agents talking to each other → **team**
- Need isolated one-shot work reported back → **sub-agent**
- 30+ minutes of single-agent work with parallelizable parts → **team**

Use agent teams when work parallelizes across independent files/modules AND agents need to communicate. Use sub-agents for focused independent tasks. Use a single session for sequential same-file work.

## Roles

- **Lead**: Creates team, writes tasks, spawns teammates, monitors, synthesizes. NEVER writes source code. May edit shared config files and non-code artifacts. Use delegate mode (Shift+Tab).
- **Teammates**: Claim tasks, implement, communicate findings, mark complete. NEVER spawn other teammates or expand scope.
- Always refer to teammates by **name**, never agentId.

## Spawning Teammates

Choose `subagent_type` based on the work:

- **`general-purpose`**: Full tool access (editing, writing, bash). Use for all implementation work.
- **`Explore`** or **`Plan`**: Read-only. Use for research or planning tasks only.
- Custom agents in `.claude/agents/` may have restricted tools — check their descriptions.

Always set `team_name` so the teammate joins the team, and `name` for their identity.

## File Ownership

**One file = one agent. No exceptions.** Two agents editing the same file causes silent data loss.

- Every task description MUST include `Files you own: [list]`
- Need a file another agent owns → message them, never edit directly
- Shared config files → lead only or one designated agent
- Ownership ambiguous → stop and ask the lead

See `references/file-ownership.md` for the complete file ownership rules.

## Task Protocol

1. Claim: `TaskUpdate` → `status: "in_progress"`, `owner: your-name`
2. Prefer lowest-ID unblocked task
3. Complete: `TaskUpdate` → `status: "completed"`, then `TaskList` for next work
4. Extra work discovered → `TaskCreate` a new task, don't expand current scope
5. NEVER mark completed if tests fail, implementation is partial, or errors unresolved

## Task Sizing

- One task = one agent, one deliverable, one file set
- Aim for 5-6 tasks per teammate
- Too large = context fills, quality degrades. Too small = coordination overhead exceeds benefit.

See `references/task-sizing.md` for detailed sizing guidance.

## Team Sizing

One teammate per independent module or workstream. Add more as the work demands — there is no hard limit.

## Task Description Format

```
[Action verb] [specific deliverable].

Files you own: [explicit list]
Files you may read but not edit: [list]

Acceptance criteria:
- [Criterion 1]
- [Criterion 2]

Context: [Background not in CLAUDE.md]
```

## Communication

- Direct message by name for all normal communication
- Broadcast ONLY for blocking issues affecting the entire team
- On task completion → message lead with summary of changes
- When blocked → message lead immediately with the specific blocker
- Use `TaskUpdate` for status, not JSON messages

## Quality Gates

- Run tests before marking any task completed
- No new lint errors or warnings
- For risky changes (auth, data models, API contracts) → spawn the teammate with `mode: "plan"` so the lead reviews their plan before implementation

See `references/quality-gates.md` for the full quality gate rules.

## Lead Rules

- Wait at least 60 seconds between status checks
- Idle is normal, not an error — sending a message wakes idle teammates
- Check `TaskList` for status, not idle notifications
- If a teammate goes idle with an in_progress task, message them to complete or explain the blocker
- Shut down teammates gracefully (`shutdown_request`) before `TeamDelete`

## Recovery Playbooks

- **Teammate stuck**: Message with guidance → if unresponsive after 2 messages, shut down and replace
- **File conflict**: Stop both agents, check git diff, reassign ownership
- **Deadlocked dependency**: Check if blocking task was actually marked completed, manually complete if needed
- **After disconnect**: Spawn new teammates, check `TaskList` for remaining work (completed tasks persist)

## Workflow Recipes

Reusable patterns available in `references/`:

| Pattern | File |
|---------|------|
| Reviewer + fixer | `references/parallel-code-review.md` |
| Competing debug hypotheses | `references/multi-hypothesis-debug.md` |
| Independent module builds | `references/parallel-feature-build.md` |
| Advocate / critic / analyst | `references/research-perspectives.md` |
| Module-by-module refactor | `references/large-refactor.md` |
| Parallel test writing | `references/test-coverage-blitz.md` |

See `references/team-coordination.md` for additional coordination patterns.
