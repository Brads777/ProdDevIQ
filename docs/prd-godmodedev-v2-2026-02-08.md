# PRD: GODMODEDEV v2 — AI Development Environment Platform

**Author:** Brad Scheller
**Date:** 2026-02-08
**Status:** Draft
**Level:** L3 (Complex, 12-40 stories)
**Phase Gate:** Phase 1 — Specification

---

## 1. Executive Summary

GODMODEDEV v2 evolves from a CLI setup framework into a **full-stack AI development environment platform**. It combines a curated skill/agent library (Skillpository), Docker-based MCP server orchestration, Manus-inspired context engineering, and an educational deployment model for university classrooms.

The platform serves two audiences: **professional developers** who need a fully-configured Claude Code environment with 500+ skills, 10+ specialist agents, and centralized MCP server management — and **university students** learning to prototype apps with AI-augmented development tools.

### Key Outcomes

- Process and catalog **1,125 pending skills/agents** into the Skillpository (current: 489 indexed, target: 1,600+)
- Integrate **Docker MCP Gateway** as the centralized tool orchestration layer
- Implement **Manus-style context engineering** (file-based memory, attention anchors, error preservation)
- Ship **custom slash commands** leveraging the open-source plugin ecosystem
- Create an **educational deployment** package for Northeastern University's MKT2700 course
- Advance the GODMODEDEV orchestrator through all 5 phases to v2.0 release

---

## 2. Problem Statement

### For Professional Developers

AI-augmented development with Claude Code is powerful but requires significant manual setup:
- Configuring MCP servers individually per project (N x N integration problem)
- Discovering and installing relevant skills from a fragmented ecosystem
- Managing context degradation across long coding sessions (100:1 input-to-output token ratio in production agents)
- No standardized way to bootstrap a new project with the right tools pre-configured

### For Educators

- Uncertainty about Claude Code access under university Education Enterprise plans
- No structured curriculum for teaching AI-augmented prototyping
- Students need guided workflows, not raw tool access
- No "classroom-ready" development environment package

### Current State Gaps

| Area | Current | Target |
|------|---------|--------|
| Skillpository indexed | 489 (376 skills + 139 agents) | 1,600+ |
| PENDING items unprocessed | 1,125 (90 agents + 1,035 skills) | 0 |
| MCP servers configured | 1 (GitHub only) | 10+ via Docker Gateway |
| Context management | Basic rules in CLAUDE.md | Full Manus-pattern implementation |
| Docker environments | 2 (dev + shadcn) | 4+ (dev, shadcn, classroom, MCP gateway) |
| Orchestrator phase | Phase 1 (no completions) | Phase 5 (release-ready) |
| Educational package | None | Complete classroom kit |

---

## 3. Target Users

### Primary: Professional AI Developers

- Solo developers and small teams using Claude Code daily
- Need fast project bootstrapping with pre-configured tooling
- Want a curated, searchable skill library instead of hunting through GitHub
- Manage 3-16+ concurrent projects across different stacks

### Secondary: University Students (Northeastern MKT2700)

- Business/product design students learning to prototype with AI
- Little to no terminal experience; need guided workflows
- Access to Claude Opus through Northeastern's Education Enterprise plan
- Need guardrails, templates, and structured commands

### Tertiary: Claude Code Community

- Skill authors who want distribution through the Skillpository
- Teams adopting multi-agent orchestration patterns
- Educators at other institutions who want to replicate the model

---

## 4. Product Vision

> **One command to go from zero to a fully-configured AI development environment, with 1,600+ installable skills, centralized MCP server management, intelligent context engineering, and classroom-ready deployment.**

GODMODEDEV becomes the "package manager for AI development workflows" — what Homebrew is for CLI tools, GODMODEDEV is for Claude Code skills, agents, MCP servers, and project scaffolding.

---

## 5. Feature Requirements

### 5.1 Skillpository Processing Pipeline (P0 — Must Have)

**Goal:** Process all 1,125 pending items from `skillpository/PENDING/` into the indexed registry.

#### 5.1.1 Batch Processing Engine

- Automated pipeline to validate, categorize, and index PENDING YAML files
- Validation rules:
  - Required fields: `name`, `type`, `description`, `source_repo`
  - Copyright stamp verification: `# ©2026 Brad Scheller`
  - Category assignment from 28 skill categories + 11 agent categories
  - Deduplication against existing 489 indexed entries
- Batch sizing: 8-12 simple items per agent pass (per context-hygiene rules)
- Output: Updated `skillpository/index.yaml` with all items indexed

#### 5.1.2 Quality Audit Resolution

Address findings from existing `skillpository/audit-report.md`:
- **HIGH:** 32 files with outdated model references (GPT refs → Claude)
- **MEDIUM:** 145 files missing descriptions
- **MEDIUM:** 101 empty files (remove or populate)
- **LOW:** 1,821 files missing copyright stamps
- **LOW:** 66 files with stale year references (2020-2024 → 2026)

#### 5.1.3 IDETOOLS Source Sync

- For each PENDING item with a valid `source_url`, fetch and create the full SKILL.md or agent .md in `IDETOOLS/`
- Ensure `IDETOOLS/catalog.md` stays in sync with `skillpository/index.yaml`
- Target: 1,600+ total entries (skills + agents) in both catalog and index

#### 5.1.4 Acceptance Criteria

- [ ] All 1,125 PENDING items processed (indexed, rejected with reason, or merged as duplicate)
- [ ] `index.yaml` total count exceeds 1,500
- [ ] Zero HIGH-severity audit issues remaining
- [ ] `IDETOOLS/catalog.md` matches `index.yaml` totals

---

### 5.2 Docker MCP Gateway Integration (P0 — Must Have)

**Goal:** Replace individual MCP server configuration with Docker MCP Gateway as the centralized orchestration layer.

#### 5.2.1 Gateway Infrastructure

- Prerequisite: Docker Desktop 4.48+ with MCP Toolkit enabled
- Single gateway connection for Claude Code: `docker mcp client connect claude-code --global`
- All MCP servers run as isolated containers with supply-chain checks, secret isolation, and OAuth support
- Configuration stored in `.mcp.json` (project-level) and `~/.claude/.mcp.json` (global)

#### 5.2.2 Core MCP Server Stack

| Server | Priority | Purpose |
|--------|----------|---------|
| Filesystem MCP | P0 | Secure file operations with access controls |
| Git MCP | P0 | Repository manipulation and search |
| Memory MCP | P0 | Knowledge-graph persistent memory across sessions |
| GitHub MCP | P0 | Issue/PR/CI workflows (already configured) |
| Playwright MCP | P1 | Browser automation and web testing |
| Context7 MCP | P1 | Version-specific documentation retrieval |
| Sequential Thinking MCP | P1 | Structured multi-step reasoning |
| PostgreSQL MCP | P2 | Database operations for app projects |
| Notion MCP | P2 | Workspace integration for task management |

#### 5.2.3 Gateway Configuration Template

Update `templates/new-project/.mcp.json.template` to include Docker Gateway as default:
```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"]
    }
  }
}
```

#### 5.2.4 Docker Compose Updates

Extend `docker/compose.yaml` with:
- MCP Gateway service profile
- Health checks for gateway connectivity
- Volume mounts for persistent MCP server state

#### 5.2.5 Acceptance Criteria

- [ ] Docker MCP Gateway running and accessible from Claude Code
- [ ] Minimum 7 MCP servers configured and functional
- [ ] Template updated for new projects to use Gateway by default
- [ ] Health check script validates MCP connectivity
- [ ] `.mcp.json` documentation in README

---

### 5.3 Manus-Style Context Engineering (P0 — Must Have)

**Goal:** Implement the five Manus context engineering patterns as a first-class skill and integrate them into the orchestrator workflow.

#### 5.3.1 Context Manager Skill

Create `IDETOOLS/skills/context-manager/SKILL.md` implementing:

1. **todo.md Attention Anchor** — Auto-create and update `todo.md` at project root during complex tasks. Rewrites the plan to the end of context to stay in the model's recent attention window. Mitigates "lost-in-the-middle" over ~50+ tool calls.

2. **File-Based Context Offloading** — Save large outputs (web scrapes, API responses, log analysis) to `context/` directory. Keep only summary + file path in conversation context. Achieve 100:1 compression while maintaining full information recovery.

3. **Error Preservation** — Never delete failed attempts from context. Failed actions and stack traces shift the model's prior away from similar failures. Errors stay visible for implicit belief updating.

4. **KV-Cache Optimization** — Append-only context management. Stable prompt prefixes. Deterministic serialization (no random JSON key ordering). No timestamps in system prompts. Aligns with existing `.claude/rules/kv-cache-optimization.md`.

5. **Action Space Management** — Consistent tool/action naming conventions (e.g., `browser_`, `shell_` prefixes). Stateless constraint enforcement without modifying tool definitions per turn.

#### 5.3.2 Context Directory Convention

Standardize project-level context storage:
```
{project}/
├── todo.md              # Attention anchor (auto-managed)
├── context/
│   ├── research/        # Full web scrapes, API docs
│   ├── decisions/       # Decision log with rationale
│   ├── errors/          # Preserved failure traces
│   └── offloaded/       # Large outputs moved from context
```

#### 5.3.3 Orchestrator Integration

- Update `.orchestrator/config.yaml` to reference context-manager as a default skill
- Specialist agents (coder, researcher, architect) auto-invoke context offloading for outputs >100 lines
- Saga log entries reference `context/decisions/` for decision rationale

#### 5.3.4 Acceptance Criteria

- [ ] `context-manager` skill created with YAML frontmatter and copyright stamp
- [ ] All 5 Manus patterns documented and implemented
- [ ] `todo.md` auto-created on `/init` for new projects
- [ ] Orchestrator agents offload verbose outputs to `context/` directory
- [ ] KV-cache rules in `.claude/rules/` align with Manus best practices

---

### 5.4 Custom Slash Commands & Plugin Integration (P1 — Should Have)

**Goal:** Curate and integrate high-value open-source slash commands and plugins into GODMODEDEV's command library.

#### 5.4.1 Command Suite Integration

Evaluate and selectively import from:
- **qdhenry/Claude-Command-Suite** (148 commands, 54 agents) — Focus on: code review workflows, test generation, deployment sequences, GitHub-Linear sync
- **wshobson/agents** (112 agents, 73 plugins, 16 orchestrators) — Focus on: Python development, full-stack orchestration, TDD workflows, security scanning
- **alirezarezvani/claude-code-skill-factory** — Use as the generator for GODMODEDEV-specific custom skills

#### 5.4.2 GODMODEDEV-Native Commands

Create custom slash commands for GODMODEDEV workflows:

| Command | Purpose |
|---------|---------|
| `/gm-init` | Bootstrap new project with GODMODEDEV template + MCP Gateway |
| `/gm-skills` | Browse and install from Skillpository |
| `/gm-context` | Activate context-manager, create todo.md and context/ |
| `/gm-audit` | Run full quality audit (copyright, descriptions, freshness) |
| `/gm-classroom` | Set up educational environment with guardrails |
| `/gm-status` | Dashboard of orchestrator phase, skill counts, MCP health |

#### 5.4.3 Plugin Architecture

- Commands stored in `.claude/commands/` (project) and `~/.claude/commands/` (global)
- Skills in `.claude/skills/` with YAML frontmatter
- Agents in `.claude/agents/` with frontmatter per `agent-design.md` rules
- Follow progressive disclosure: skills activate only when contextually relevant

#### 5.4.4 Acceptance Criteria

- [ ] 20+ curated slash commands available (mix of imported and custom)
- [ ] `/gm-init` scaffolds a complete project with Gateway, context dirs, and agent templates
- [ ] Plugin import process documented in `docs/`
- [ ] Commands follow GODMODEDEV naming convention (`/gm-*` prefix)

---

### 5.5 Docker Environment Completion (P1 — Should Have)

**Goal:** Finalize the Dockerfile.shadcn and expand the Docker environment suite.

#### 5.5.1 Dockerfile.shadcn Fixes

Complete the in-progress modifications (11 insertions, 8 deletions unstaged):
- Verify `create-next-app` and `shadcn` CLI compatibility with Node 25
- Ensure all 30+ shadcn components install cleanly in one layer
- Optimize layer caching (separate dependency install from project scaffold)

#### 5.5.2 Classroom Dockerfile

Create `docker/Dockerfile.classroom` optimized for students:
- Pre-installed Claude Code CLI
- Restricted filesystem access (no system dirs)
- Pre-configured MCP Gateway with Filesystem + Git servers only
- Template project with guided README and example commands
- Locked-down permissions (no `rm -rf`, no `.env` access)

#### 5.5.3 MCP Gateway Dockerfile

Create `docker/Dockerfile.mcp-gateway` or compose profile for:
- Docker MCP Toolkit with catalog access
- Pre-configured core servers (Filesystem, Git, Memory, GitHub)
- OAuth token management for GitHub, Notion
- Health check endpoint

#### 5.5.4 Acceptance Criteria

- [ ] `Dockerfile.shadcn` builds successfully and passes health check
- [ ] `Dockerfile.classroom` builds and runs with student-appropriate guardrails
- [ ] `compose.yaml` updated with classroom and mcp-gateway profiles
- [ ] All Docker images documented in README

---

### 5.6 Educational Deployment Package (P1 — Should Have)

**Goal:** Create a classroom-ready package for Northeastern University MKT2700 (Product Design & Development).

#### 5.6.1 Student Environment

- Docker-based dev environment with pre-configured Claude Code
- Authentication flow: students use `@northeastern.edu` credentials via Education Enterprise plan
- Fallback: Claude for Student Builders API credits if Claude Code access isn't included in the enterprise agreement
- Restricted permissions: no destructive operations, no secret access

#### 5.6.2 Curriculum Support

- **Guided prototyping workflow:** `/gm-classroom` command sets up a project with:
  - Scaffolded Next.js + shadcn app (from Dockerfile.shadcn)
  - Pre-loaded skills: React best practices, UI design, form handling
  - todo.md pre-populated with assignment steps
  - Simplified slash commands (no infrastructure/DevOps commands)

- **AI-Gate Methodology Integration:**
  - Adapts Stage-Gate product development for AI-augmented workflows
  - Phase 1: Discovery (Claude as research assistant)
  - Phase 2: Scoping (Claude as architect/planner)
  - Phase 3: Development (Claude Code as pair programmer)
  - Phase 4: Testing (Claude as QA/reviewer)
  - Phase 5: Launch (Claude as deploy assistant)

#### 5.6.3 Instructor Dashboard

- Usage tracking per student (token consumption, commands used)
- Assignment template generator
- Skill recommendations per assignment type

#### 5.6.4 Acceptance Criteria

- [ ] Student can go from zero to running app in <15 minutes using Docker + Claude Code
- [ ] `/gm-classroom` produces a working scaffolded project
- [ ] AI-Gate methodology documented with 5-phase student workflow
- [ ] Instructor guide with setup instructions and assignment templates
- [ ] Authentication flow verified with Northeastern Education Enterprise plan

---

### 5.7 Orchestrator Phase Advancement (P0 — Must Have)

**Goal:** Progress the GODMODEDEV orchestrator from Phase 1 through Phase 5.

#### Phase 1: Specification (Current)

- [ ] **Product Brief** → This PRD serves as the specification. Mark `product-brief` as completed.
- [ ] **Research** → Completed via the shared conversation analysis (MCP ecosystem, Manus patterns, open-source landscape).

#### Phase 2: Planning

- [ ] **PRD** → This document. File at `docs/prd-godmodedev-v2-2026-02-08.md`.
- [ ] **Tech Spec** → Architecture for Docker MCP Gateway integration, context-manager skill, and Skillpository processing pipeline.

#### Phase 3: Architecture

- [ ] **System Design** → Component diagram showing: Claude Code ↔ Docker MCP Gateway ↔ MCP Servers, Skillpository indexing pipeline, context engineering data flow.
- [ ] **Gate Check** → Validate architecture against requirements in this PRD.

#### Phase 4: Implementation

- [ ] **Sprint Planning** → Break into epics: Skillpository Processing, MCP Gateway, Context Engineering, Slash Commands, Docker, Education.
- [ ] **Implementation** → Delegate to specialist agents per orchestrator config.

#### Phase 5: Review & Completion

- [ ] **Code Review** → Full review of all new skills, agents, Docker configs, and templates.
- [ ] **Security Audit** → OWASP review of MCP server configurations, Docker permissions, student environment isolation.
- [ ] **Documentation** → Updated README, CLAUDE.md, catalog.md, and educational guides.

---

## 6. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    GODMODEDEV v2 Platform                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Claude Code (Opus 4.6)                                    │  │
│  │  ├─ CLAUDE.md + @import rules                              │  │
│  │  ├─ 10 Specialist Agents (.claude/agents/)                 │  │
│  │  ├─ Custom Skills (.claude/skills/)                        │  │
│  │  ├─ Slash Commands (.claude/commands/gm-*)                 │  │
│  │  └─ Context Manager (todo.md + context/ offloading)        │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │ single connection                    │
│  ┌────────────────────────▼───────────────────────────────────┐  │
│  │  Docker MCP Gateway (MCP_DOCKER)                           │  │
│  │  ├─ Filesystem MCP     ├─ Playwright MCP                   │  │
│  │  ├─ Git MCP            ├─ Context7 MCP                     │  │
│  │  ├─ Memory MCP         ├─ Sequential Thinking MCP          │  │
│  │  ├─ GitHub MCP         ├─ PostgreSQL MCP                   │  │
│  │  └─ Notion MCP         └─ [Dynamic MCP Discovery]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┐  ┌────────────────────────────────┐    │
│  │  Skillpository       │  │  Docker Environments           │    │
│  │  ├─ index.yaml       │  │  ├─ dev (base)                 │    │
│  │  │  (1,600+ entries) │  │  ├─ shadcn (Next.js + UI)      │    │
│  │  ├─ IDETOOLS/        │  │  ├─ classroom (students)       │    │
│  │  │  ├─ skills/ (350+)│  │  └─ mcp-gateway (servers)      │    │
│  │  │  └─ agents/ (139+)│  │                                │    │
│  │  └─ PENDING/ → 0     │  └────────────────────────────────┘    │
│  └─────────────────────┘                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Orchestrator (.orchestrator/)                              │  │
│  │  ├─ config.yaml (phase gates, agent config, batch sizing)  │  │
│  │  ├─ status.yaml (phase tracking, task status)              │  │
│  │  └─ saga-log.yaml (action tracking with rollback)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Educational Package                                       │  │
│  │  ├─ Dockerfile.classroom (restricted, guided env)          │  │
│  │  ├─ AI-Gate Methodology (5-phase student workflow)         │  │
│  │  ├─ Assignment templates                                   │  │
│  │  └─ Instructor dashboard                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Skillpository total indexed | 489 | 1,600+ | `index.yaml` entry count |
| PENDING items remaining | 1,125 | 0 | File count in `PENDING/` |
| MCP servers configured | 1 | 10+ | `docker mcp server ls` output |
| Custom slash commands | 6 (orchestrator) | 26+ | `.claude/commands/` count |
| Docker environments | 2 | 4+ | `compose.yaml` service count |
| Audit HIGH issues | 32 | 0 | `audit-report.md` findings |
| Orchestrator phase | 1 | 5 (complete) | `status.yaml` current_phase |
| Student setup time | N/A | <15 minutes | End-to-end classroom test |
| Context offloading adoption | 0 agents | All 10 agents | Skill preload config |

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Docker MCP Gateway doesn't support Claude Code CLI directly | HIGH | LOW | Gateway works with stdio/http transports; fallback to individual MCP configs |
| Northeastern Education Enterprise doesn't include Claude Code | MEDIUM | MEDIUM | Fallback: Claude for Student Builders API credits program |
| 1,125 PENDING items contain many duplicates or low-quality entries | LOW | HIGH | Batch processing with dedup logic; reject with reason code |
| Context manager skill conflicts with existing orchestrator patterns | MEDIUM | LOW | Additive design; context-manager augments, doesn't replace orchestrator |
| Open-source plugin licenses incompatible with Skillpository distribution | MEDIUM | LOW | Audit licenses before import; attribute sources in index.yaml |

---

## 9. Implementation Epics

### Epic 1: Skillpository Mass Processing
- **Stories:** 8-12
- **Priority:** P0
- **Agents:** researcher (categorization), coder (automation scripts), reviewer (quality)
- Validate all 1,125 PENDING YAML files
- Categorize, deduplicate, and index into `index.yaml`
- Create/update IDETOOLS source files for items with `source_url`
- Resolve all HIGH audit findings
- Update `catalog.md` to match final index

### Epic 2: Docker MCP Gateway
- **Stories:** 5-8
- **Priority:** P0
- **Agents:** architect (design), coder (implementation), deploy-runner (Docker)
- Set up Docker MCP Toolkit and Gateway
- Configure 10+ MCP servers via catalog
- Update `.mcp.json` and templates
- Extend `compose.yaml` with gateway profile
- Write health check scripts

### Epic 3: Context Engineering
- **Stories:** 4-6
- **Priority:** P0
- **Agents:** architect (design), coder (skill creation), documenter (guides)
- Create context-manager skill with all 5 Manus patterns
- Establish `context/` directory convention
- Integrate with orchestrator and specialist agents
- Update KV-cache rules

### Epic 4: Slash Commands & Plugins
- **Stories:** 6-8
- **Priority:** P1
- **Agents:** researcher (evaluation), coder (implementation), reviewer (quality)
- Evaluate qdhenry, wshobson, alirezarezvani ecosystems
- Import high-value commands with attribution
- Create GODMODEDEV-native `/gm-*` commands
- Document command library

### Epic 5: Docker Environment Suite
- **Stories:** 3-5
- **Priority:** P1
- **Agents:** coder (Dockerfiles), deploy-runner (testing)
- Finish Dockerfile.shadcn
- Create Dockerfile.classroom
- Add MCP gateway compose profile
- Update all health checks

### Epic 6: Educational Deployment
- **Stories:** 5-8
- **Priority:** P1
- **Agents:** architect (design), documenter (curriculum), coder (implementation)
- Design AI-Gate methodology workflow
- Create `/gm-classroom` command and templates
- Build student guardrails and restricted permissions
- Write instructor guide
- Verify Northeastern authentication flow

---

## 10. Dependencies

- Docker Desktop 4.48+ (for MCP Toolkit/Gateway)
- Node.js 25.x (already available)
- Northeastern Education Enterprise plan confirmation (for Epic 6)
- Claude Code Opus 4.6 (already active)
- GitHub CLI (already configured)

---

## 11. Open Questions

1. **Northeastern Claude Code access:** Does the Education Enterprise agreement include terminal Claude Code, or only web/desktop? (Email drafted to IT and Anthropic contacts)
2. **Skillpository distribution model:** Should GODMODEDEV publish as an npm package, GitHub template, or Docker image for community distribution?
3. **Plugin licensing:** Which open-source plugin repos have compatible licenses for inclusion in the Skillpository?
4. **MCP Gateway vs. direct config:** For projects that don't use Docker, should we maintain a parallel direct-MCP configuration path?
5. **Context manager auto-activation:** Should the context-manager skill activate automatically on all projects, or opt-in via `/gm-context`?

---

## 12. References

### Research Sources

- [Docker MCP Toolkit Documentation](https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/)
- [Docker MCP Gateway](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/)
- [Manus Context Engineering Blog](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [MCP Reference Servers](https://github.com/modelcontextprotocol/servers)
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (23.2k stars)
- [Claude-Command-Suite](https://github.com/qdhenry/Claude-Command-Suite) (148 commands)
- [wshobson/agents](https://github.com/wshobson/agents) (112 agents, 73 plugins)
- [Claude Code Skill Factory](https://github.com/alirezarezvani/claude-code-skill-factory)
- [Skills CLI](https://skills.sh/) — npm-style skill distribution

### Internal Documents

- `E:\GODMODEDEV\CLAUDE.md` — Project instructions
- `E:\GODMODEDEV\.orchestrator\config.yaml` — Phase gate configuration
- `E:\GODMODEDEV\.orchestrator\status.yaml` — Current phase tracking
- `E:\GODMODEDEV\skillpository\index.yaml` — Current registry (489 entries)
- `E:\GODMODEDEV\skillpository\audit-report.md` — Quality audit findings
- `E:\GODMODEDEV\docs\agent-teams-guide.md` — Multi-agent workflow guide

### Shared Conversation Context

- Claude.ai conversation (Feb 5, 2026): Research into open-source MCP servers, Docker MCP Gateway, Manus context engineering patterns, slash command ecosystems, and Northeastern University educational deployment considerations.
