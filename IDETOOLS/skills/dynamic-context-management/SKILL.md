---
name: dynamic-context-management
description: >-
  Context window management pattern using .context/ directories for terminal
  output, MCP responses, and session checkpoints. Use when working on projects
  that generate large outputs or need cross-session context preservation.
---
# ©2026 Brad Scheller

# Dynamic Context Management

Write large outputs to disk, retrieve with grep when needed. Prevents context window bloat by offloading verbose output to structured `.context/` directories.

## Directory Structure

```
.context/
├── mcp/                    # MCP responses (> 50 lines)
├── terminal/               # Command outputs (builds, tests, installs)
└── history/                # Session checkpoints
```

## Rules

### 1. Terminal Output -> Files

All builds, tests, and installs must be piped to `.context/terminal/`:

```bash
npm run build 2>&1 | tee .context/terminal/build_$(date +%s).log
npm test 2>&1 | tee .context/terminal/test_$(date +%s).log
npm install 2>&1 | tee .context/terminal/install_$(date +%s).log

# Then grep for what matters
grep -i "error\|failed" .context/terminal/build_*.log | tail -20
```

### 2. MCP Responses -> Files

Any MCP response over 50 lines must be saved to `.context/mcp/`:

```bash
echo '{response}' > .context/mcp/{server}/{tool}_$(date +%s).json

# Report summary only, e.g.:
# "Saved 200 lines to .context/mcp/supabase/execute_sql_1704729600.json. Found 12 tables."
```

### 3. Session Checkpoints -> Files

Update checkpoint after completing features or making decisions:

```markdown
# .context/history/session_YYYY-MM-DD-TIME-HH-MM.md

## Goal
[Current objective]

## Completed
- [x] [HH:MM] Task 1
- [x] [HH:MM] Task 2

## Decisions
- [HH:MM] Decision: reasoning

## Files Modified
- [HH:MM] path/to/file: what changed

## Next
- [ ] Upcoming task

---
Last updated: YYYY-MM-DD HH:MM
```

Use 24-hour time (e.g., `[14:30]`) for entries. Update "Last updated" on each save.

## Verification

Run this to check if rules are being followed:

```bash
echo "=== Terminal logs ===" && ls -la .context/terminal/ 2>/dev/null || echo "Empty"
echo ""
echo "=== MCP responses ===" && find .context/mcp -name "*.json" 2>/dev/null | wc -l | xargs echo "files:"
echo ""
echo "=== Latest checkpoint ===" && cat .context/history/$(ls -t .context/history/ 2>/dev/null | head -1) 2>/dev/null | head -20 || echo "None"
```

## Quick Reference

| Action | Command |
|--------|---------|
| Run build | `npm run build 2>&1 \| tee .context/terminal/build_$(date +%s).log` |
| Run tests | `npm test 2>&1 \| tee .context/terminal/test_$(date +%s).log` |
| Find errors | `grep -i "error" .context/terminal/*.log \| tail -20` |
| Check MCP saves | `find .context/mcp -name "*.json"` |
| Read checkpoint | `cat .context/history/$(ls -t .context/history/ \| head -1)` |
