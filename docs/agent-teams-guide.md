# Agent Teams Guide — GODMODEDEV

## When to Use Agent Teams vs Subagents

| Scenario | Use Subagents | Use Agent Teams |
|----------|:---:|:---:|
| Single focused task (code review, bug fix) | x | |
| Parallel research with competing hypotheses | | x |
| Multi-module feature (frontend + backend + tests) | | x |
| Quick delegation from orchestrator | x | |
| L3-L4 projects with cross-layer coordination | | x |
| Read-only investigation | x | |
| Long-running parallel implementation | | x |

**Rule of thumb:** If you need more than 3 specialists working simultaneously, or teammates need to communicate with each other (not just report back), use Agent Teams.

## Enabling Agent Teams

Already enabled in `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## Lead/Specialist Topology for GODMODEDEV

```
orchestrator (lead, delegate mode)
├── architect       → system design, ADRs
├── coder x 2-3     → parallel feature implementation
├── tdd             → test coverage
├── reviewer        → quality gates (via TeammateIdle hook)
├── documenter      → docs generation
└── security-auditor → final security sweep
```

### Lead (Orchestrator)

- Uses `permissionMode: delegate` — restricted to coordination tools only
- Creates task list, assigns to specialists
- Synthesizes results and reports to user
- Never implements code directly

### Specialists

Each teammate works independently with:
- Own context window (no context pollution between teammates)
- Own git worktree (optional, for parallel file edits)
- Direct messaging to other teammates
- Persistent memory (`memory: project`) for cross-session knowledge

## Task Sizing Guidelines

### For Subagents (Task tool)

| Complexity | Tasks per Agent | Parallel Agents |
|-----------|:---:|:---:|
| Complex (research, multi-file changes) | 3-5 | 2-3 |
| Standard (single-file edits, audits) | 5-8 | 3-4 |
| Simple (formatting, version checks) | 8-12 | 4 |

### For Agent Teams (Teammates)

| Project Level | Recommended Teammates | Duration |
|:---:|:---:|---|
| L0-L1 | Don't use teams | Use subagents instead |
| L2 | 2-3 specialists | Single session |
| L3 | 3-5 specialists | Multi-session |
| L4 | 5-7 specialists | Multi-day |

## Quality Gates via Hooks

### TeammateIdle Hook

Runs when a teammate is about to go idle. Exit code 2 sends feedback and keeps them working.

Use case: Reviewer checks each teammate's output before they go idle.

```json
{
  "hooks": {
    "TeammateIdle": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Review checklist: tests pass, no secrets, follows conventions'",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### TaskCompleted Hook

Runs when a task is being marked complete. Exit code 2 blocks completion with feedback.

Use case: Ensure all tasks meet minimum quality bar before being marked done.

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "hooks": [
          {
            "type": "agent",
            "command": "Verify the completed task meets quality standards: tests written, no hardcoded values, follows project conventions.",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

## Display Modes

### In-Process (Default)

All teammates in one terminal. Navigate with:
- `Shift+Up/Down` — select teammates
- View all teammate status at once

### Split Panes (tmux/iTerm2)

Each teammate in its own pane. Better for:
- Monitoring individual teammate progress
- Seeing full output from each specialist
- Debugging teammate issues

## Best Practices

1. **Start small** — Begin with 2-3 teammates, add more as needed
2. **Clear task boundaries** — Each teammate should own a distinct domain
3. **Use delegate mode** — Prevent the lead from implementing directly
4. **Monitor context** — Use `/cost` to track token usage across teammates
5. **Checkpoint regularly** — Use `/compact` on teammates approaching context limits
6. **Let specialists communicate** — Teammates can message each other for coordination
7. **Quality gates** — Use hooks to enforce standards before task completion
