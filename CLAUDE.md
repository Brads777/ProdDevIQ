# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@.claude/rules/copyright-stamp.md
@.claude/rules/agent-design.md
@.claude/rules/context-hygiene.md

## Project Overview

GODMODEDEV is an IDE setup framework for Claude Code. It bootstraps fully-configured AI development environments with Docker containers, a curated skill library (Skillpository), and multi-agent orchestration via the unified-orchestrator skill.

**Level:** L3 (Complex, 12-40 stories)
**Type:** CLI toolkit
**Phase:** See `.orchestrator/status.yaml` for current progress

## Architecture

```
GODMODEDEV/
├── .orchestrator/        # Phase tracking (config.yaml, status.yaml, saga-log.yaml)
├── .claude/
│   ├── rules/            # 7 modular rule files (path-scoped via frontmatter)
│   ├── agents/           # 10 deployed specialist agents
│   └── settings.json     # Permissions (allow/deny) + PostToolUse hooks
├── docker/               # Dev container (Dockerfile + compose.yaml + shadcn profiles)
├── skillpository/        # Registry — index.yaml (489 entries: 350 skills + 139 agents)
├── IDETOOLS/             # Full skill & agent source library
│   ├── agents/           # 139 agent .md files
│   ├── skills/           # 350 skill directories (each has SKILL.md)
│   └── catalog.md        # Human-readable master catalog
├── templates/            # CLAUDE.md.template, settings.json.template, .mcp.json.template
├── scripts/              # PowerShell: setup-dev, deploy-agents, health-check
└── docs/                 # Specs, PRDs, architecture, stories
```

## Key Concepts

**Orchestrator state machine:** `/init` creates `.orchestrator/` with config, status, and saga log. Projects advance through 5 phases (Specification → Planning → Architecture → Implementation → Review). Phase gates are enforced based on project level (L0-L4). Status entries transition from `"required"` → `"docs/output-file.md"` as deliverables are completed.

**Skill installation path:** Skills live at `~/.agents/skills/` (symlinked to `~/.claude/skills/`). Agent templates deploy from `~/.agents/skills/unified-orchestrator/templates/agents/` to a project's `.claude/agents/` via `/agents-deploy` or `scripts/deploy-agents.ps1`.

**IDETOOLS vs Skillpository:** IDETOOLS contains the raw source files. The skillpository `index.yaml` is the searchable registry pointing into IDETOOLS. Both must stay in sync — run `/skills-audit` after changes.

## Build & Run

```bash
# Dev container (mounts repo to /workspace, requires ANTHROPIC_API_KEY in env)
docker compose -f docker/compose.yaml up -d

# With shadcn UI environment (exposes port 3333)
docker compose -f docker/compose.yaml --profile shadcn up -d

# With existing shadcn project (set SHADCN_PROJECT_PATH first)
docker compose -f docker/compose.yaml --profile shadcn-project up -d

# Validate project configuration
powershell -NoProfile -File scripts/health-check.ps1

# Check prerequisites (Node, npm, Git, Docker, gh, Claude Code)
powershell -NoProfile -File scripts/setup-dev.ps1

# Deploy agent templates to current project
powershell -NoProfile -File scripts/deploy-agents.ps1
```

## Orchestrator Commands

```
/init              → Initialize project (creates .orchestrator/, sets level)
/status            → Phase progress and next step
/delegate <type>   → Delegate to: coder, architect, reviewer, tdd, researcher, debugger, documenter, security, deploy
/phase <N>         → View/advance phase
/agents-deploy     → Copy agents to .claude/agents/
/rollback          → Saga log review
```

## Skillpository Commands

```
/skills-scan       → Scan repos for new skills/agents
/skills-import     → Import from URL, path, or PENDING
/skills-add        → Add a newly created item
/skills-audit      → Check for outdated content (validates index ↔ IDETOOLS sync)
/skills-advisor    → Get skill recommendations
/skills-pending    → Review discovered items in skillpository/PENDING/
```

## File Naming Conventions

- Architecture docs: `docs/architecture-{system}.md`
- ADRs: `docs/adr/ADR-NNN-title.md`
- Tech specs: `docs/tech-spec-{feature}.md`
- PRDs: `docs/prd-{name}-{date}.md`
- Stories: `docs/stories/story-{epic}-{id}.md`
- Skill entries: `skillpository/skills/{category}/{name}/`
- Skill source: `IDETOOLS/skills/{name}/SKILL.md`
- Agent source: `IDETOOLS/agents/{name}.md`

## Docker Environment

The `docker/compose.yaml` defines three services:
- **dev** — Main dev container (node:25-bookworm, Claude Code CLI, gh). Mounts repo at `/workspace`. Requires `ANTHROPIC_API_KEY` env var. Enables `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.
- **shadcn** — Standalone shadcn/ui dev environment (profile: `shadcn`, port 3333)
- **shadcn-project** — Mount existing project into shadcn env (profile: `shadcn-project`, uses `SHADCN_PROJECT_PATH`)
