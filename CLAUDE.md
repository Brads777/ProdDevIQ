# CLAUDE.md — GODMODEDEV

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
├── .orchestrator/        # Phase tracking, config, saga log
├── .claude/              # Rules, settings, agents
│   ├── rules/            # Modular rule files
│   ├── agents/           # 10 deployed specialist agents
│   └── settings.json     # Permissions + hooks
├── docker/               # Dev container (Dockerfile + compose.yaml)
├── skillpository/        # Skill registry — index.yaml (489 entries)
├── IDETOOLS/             # Full skill & agent library (source files)
│   ├── agents/           # 139 agent .md files
│   ├── skills/           # 350 skill directories
│   └── catalog.md        # Human-readable catalog
├── templates/            # Scaffolding for new projects
├── scripts/              # PowerShell setup/deploy/health scripts
└── docs/                 # Specs, PRDs, architecture, guides
```

## Orchestrator Commands

```
/init              → Initialize project
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
/skills-audit      → Check for outdated content
/skills-advisor    → Get skill recommendations
/skills-pending    → Review discovered items
```

## Build & Run

```bash
docker compose -f docker/compose.yaml up -d
powershell -NoProfile -File scripts/health-check.ps1
```

## File Naming Conventions

- Architecture docs: `docs/architecture-{system}.md`
- ADRs: `docs/adr/ADR-NNN-title.md`
- Tech specs: `docs/tech-spec-{feature}.md`
- PRDs: `docs/prd-{name}-{date}.md`
- Stories: `docs/stories/story-{epic}-{id}.md`
- Skill entries: `skillpository/skills/{category}/{name}/`
