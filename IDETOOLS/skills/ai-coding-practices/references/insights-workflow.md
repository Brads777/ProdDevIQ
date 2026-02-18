# Insights Workflow

Claude Code's `/insights` command analyzes past sessions and generates a report on your working patterns.

---

## How to Use

Run in Claude Code:
```
/insights
```

Optionally specify a time period:
```
/insights --days 7
```

---

## What the Report Covers

- Working style analysis
- Friction points and failure patterns
- Features and behaviors that worked well
- Suggestions for improving workflows

---

## Actioning the Report

The most valuable part of the insights report is identifying **where things went wrong**.

For each friction point or failure pattern identified:

1. **Diagnose** — understand the root cause (e.g., agent polling indefinitely, context window exhaustion, test modification)
2. **Create a rule** — write a specific instruction to prevent recurrence
3. **Add to CLAUDE.md** — paste the rule into the project's CLAUDE.md so it applies to all future sessions
4. **Verify** — in the next session, confirm the rule is being followed

---

## Example: Converting an Insight into a Rule

**Insight:** "Agent repeatedly polled the task list for 15 minutes without taking action during multi-agent session"

**Rule added to CLAUDE.md:**
```
### Multi-Agent Sessions
- Do NOT poll the task list indefinitely.
- If no progress after 3 checks, take action or report the blocker.
```

This feedback loop — insights -> rules -> CLAUDE.md — is how your Claude Code experience improves over time.
