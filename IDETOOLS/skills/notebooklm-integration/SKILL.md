---
name: notebooklm-integration
description: >-
  Integration framework for Google NotebookLM with Claude Code via nlm CLI.
  Provides notebook management, research workflows, source handling, and
  cross-tool context sharing. Use when user wants to create, query, or manage
  NotebookLM notebooks from Claude Code sessions.
---
# ©2026 Brad Scheller

# NotebookLM Integration

Integration framework for Google NotebookLM with Claude Code via the `nlm` CLI (v0.2.18) and `repomix`. NotebookLM serves as an external knowledge base for research, debugging, documentation, security auditing, and cross-tool context sharing.

## Prerequisites

- `nlm` CLI: `uv tool install notebooklm-mcp-cli` (or `pip install notebooklm-mcp-cli`)
- `repomix`: `npm install -g repomix`
- Run `scripts/setup.sh` to verify dependencies and authentication

## Notebook Registry

Register aliases for quick access to purpose-specific notebooks:

| Alias | Purpose |
|---|---|
| `second-brain` | Project knowledge base -- features, decisions, context |
| `debug-companion` | Stack-specific debugging patterns and solutions |
| `security-handbook` | OWASP top 10, security best practices for your stack |
| `cross-tool-kb` | Shared context across AI tools (Cursor, Copilot, etc.) |

```bash
nlm alias set <alias> <notebook-id> -t notebook
nlm alias list
```

## NLM CLI Quick Reference

### Notebooks

| Command | Description |
|---|---|
| `nlm notebook create "<name>"` | Create a new notebook |
| `nlm notebook list` | List all notebooks |
| `nlm notebook get <id>` | Get notebook details |
| `nlm notebook describe <id>` | AI-generated summary |
| `nlm notebook query <id> "<question>"` | Ask a question |

### Sources

| Command | Description |
|---|---|
| `nlm source add <id> --url <url> -w` | Add website/YouTube |
| `nlm source add <id> --file <path> -w` | Upload local file (PDF, MD, TXT) |
| `nlm source add <id> --text "<content>" --title "<title>" -w` | Add inline text |
| `nlm source add <id> --drive <doc-id> -w` | Add Google Drive doc |
| `nlm source list <id>` | List sources |
| `nlm source delete <id> <source-id>` | Remove a source |
| `nlm source stale <id>` | Check for stale Drive sources |
| `nlm source sync <id>` | Sync stale sources |

### Notes

| Command | Description |
|---|---|
| `nlm note create <id> -c "<content>" -t "<title>"` | Create a note |
| `nlm note list <id>` | List notes |
| `nlm note update <id> <note-id> -c "<content>"` | Update a note |
| `nlm note delete <id> <note-id>` | Delete a note |

### Query & Research

| Command | Description |
|---|---|
| `nlm query notebook <id> "<question>"` | Query notebook |
| `nlm query notebook <id> "<question>" -s <source-ids>` | Query specific sources |
| `nlm research start "<query>" -n <id> -m fast` | Fast research (~30s, 10 sources) |
| `nlm research start "<query>" -n <id> -m deep` | Deep research (~5min, 40 sources) |
| `nlm research status <id>` | Check research progress |
| `nlm research import -n <id>` | Import discovered sources |

### Artifacts & Downloads

| Command | Description |
|---|---|
| `nlm mindmap create <id> -t "<title>" -y` | Create mind map |
| `nlm infographic create <id> -y` | Create infographic |
| `nlm slides create <id> -y` | Create slide deck |
| `nlm report create <id> -f "Briefing Doc" -y` | Create briefing doc |
| `nlm audio create <id> -y` | Create podcast-style audio |
| `nlm studio status <id>` | Check artifact generation status |
| `nlm download mind-map <id> -o <path>` | Download mind map (JSON) |
| `nlm download report <id> -o <path>` | Download report (MD) |

### Sharing & Aliases

| Command | Description |
|---|---|
| `nlm share public <id>` | Make notebook public |
| `nlm share invite <id> --email <email>` | Invite collaborator |
| `nlm alias set <alias> <id> -t notebook` | Create alias |
| `nlm alias list` | List all aliases |

## Automatic Rules

1. **After feature completion** (build passes): create a note in `second-brain`
   ```
   nlm note create second-brain -c "<summary>" -t "Feature: <name>"
   ```

2. **When debugging**: query `debug-companion` BEFORE web search
   ```
   nlm query notebook debug-companion "<error message>"
   ```

3. **Before marking feature complete**: check `security-handbook`
   ```
   nlm query notebook security-handbook "security risks for <feature>"
   ```

4. **When docs change**: sync to `cross-tool-kb`
   ```
   nlm source add cross-tool-kb --file <changed-file> -w
   ```

## Workflows

### Second Brain (Project Knowledge Base)
Initialize with `/second-brain init`, then auto-capture features, decisions, and context. See `references/second-brain.md`.

### Deep Research
Create dedicated research notebooks with `nlm research start` for deep topic exploration. See `references/research.md`.

### Debug Companion
Stack-aware debugging KB that learns from your project. See `references/debug-companion.md`.

### Security Audit
OWASP-grounded security handbook with codebase audit via repomix. See `references/security-audit.md`.

### Cross-Tool Context
Shared notebook for syncing context across Cursor, Copilot, Claude Code. See `references/cross-tool-context.md`.

### Codebase Visualization
Pack with repomix, generate mind maps, infographics, slides. See `references/explain-codebase.md`.

### Visual Artifacts
Generate mind maps, infographics, slides, reports from any notebook. See `references/visualize-docs.md`.

## Full CLI Reference

See `references/nlm-cli-reference.md` for the complete command reference with all flags and options.
