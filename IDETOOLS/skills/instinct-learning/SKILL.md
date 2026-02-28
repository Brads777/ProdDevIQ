---
name: instinct-learning
description: >
  Continuous learning skill that extracts successful patterns, architectural decisions,
  and debugging insights from completed work into reusable "instincts." Based on the
  ECC (Everything Claude Code) /learn pattern. Trigger on /learn.
allowed-tools: Read, Write, Edit, Glob, Grep
disable-model-invocation: true
---
# ©2026 Brad Scheller

# Instinct Learning

**Purpose:** Extract successful patterns from completed work and codify them as persistent knowledge ("instincts") that improve future performance. Based on the "Compound Engineering" philosophy — every task should simplify all subsequent tasks.

## When to Use This Skill

- `/learn` — After completing a task, extract patterns and save as instincts
- `/learn review` — Review accumulated instincts
- `/learn apply "<context>"` — Find relevant instincts for a new task

## How It Works

### /learn (Extract Instincts)

1. **Scan recent work** — Read recently modified files using Glob
2. **Identify patterns** — Look for:
   - Architectural decisions made and why
   - Debugging techniques that worked
   - Code patterns that were effective
   - Mistakes made and corrections applied
   - Tool usage patterns that saved time
3. **Codify as instinct** — Write to `CLAUDE.local.md` or Auto Memory:
   ```markdown
   ## Instinct: [short name]
   **Context:** [when this applies]
   **Pattern:** [what to do]
   **Rationale:** [why this works]
   ```
4. **Deduplicate** — Check existing instincts to avoid redundancy
5. **Confirm** — Show the user what was learned

### /learn review

1. Read all instincts from `CLAUDE.local.md` and Auto Memory files
2. Categorize by type (architecture, debugging, patterns, tools)
3. Show summary with counts and most recent additions
4. Offer to prune outdated instincts

### /learn apply "<context>"

1. Parse the context description
2. Search instincts for relevant matches
3. Present applicable instincts ranked by relevance
4. Suggest how to apply them to the current task

## Instinct Categories

| Category | Examples |
|----------|---------|
| Architecture | "Use barrel exports for this monorepo structure" |
| Debugging | "Check env vars first when Docker containers fail to start" |
| Patterns | "This project uses repository pattern for data access" |
| Tools | "Use Grep with -C3 context for finding usage patterns" |
| Conventions | "This team uses conventional commits with scope" |
| Performance | "Batch database operations in groups of 100" |

## Storage

Instincts are stored in priority order:
1. **Project-level:** `CLAUDE.local.md` (gitignored, per-project)
2. **Auto Memory:** `~/.claude/projects/<project>/memory/` (persistent)
3. **Cross-project:** `~/.claude/CLAUDE.md` (for universal patterns)

## Output Format

```
## Instincts Extracted

### New Instincts (N)
1. **[name]** — [pattern summary]
   Context: [when to apply]

### Updated Instincts (N)
1. **[name]** — [what changed]

### Total Instincts: N (across all categories)
```
