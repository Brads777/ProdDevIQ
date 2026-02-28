# Boris Cherny Claude Code Techniques — Master Analysis
# ©2026 Brad Scheller
# Extracted from 14 GitHub repos for GODMODEDEV integration

> **Date:** 2026-02-19
> **Purpose:** Extract actionable patterns from the Boris Cherny ecosystem for integration into the GODMODEDEV skillpository and agent framework.

---

## Table of Contents

1. [Source Repos Reviewed](#source-repos-reviewed)
2. [Boris Cherny's Core Philosophy](#core-philosophy)
3. [The 7 Universal Patterns](#universal-patterns)
4. [Technique Catalog](#technique-catalog)
5. [Agent Archetypes](#agent-archetypes)
6. [Hook Lifecycle Patterns](#hook-lifecycle-patterns)
7. [Slash Command Patterns](#slash-command-patterns)
8. [Configuration Stack](#configuration-stack)
9. [GODMODEDEV Integration Recommendations](#godmodedev-integration)
10. [Skills to Build](#skills-to-build)
11. [Agents to Build](#agents-to-build)

---

## Source Repos Reviewed

| # | Repo | Focus | Sophistication |
|---|------|-------|----------------|
| 1 | `leiMizzou/BorisWorkflow` | One-click setup, 13-tip framework, Ralph Loop | Medium |
| 2 | `0xquinto/bcherny-claude` | Direct extraction of Boris's actual config | High |
| 3 | `elb-pr/claudikins-kernel` | SRE-grade gated pipeline with integrity checks | Very High |
| 4 | `jhacksman/boris-method` | Pure philosophy — Plan/Execute/Verify/Document | Conceptual |
| 5 | `Theopsguide/WWBD` | Practical template with browser tools | Medium |
| 6 | `7dieuuoc/ChernyCode` | Dual Claude Code + Cursor support | Medium |
| 7 | `stepan-talaria/bcherny-claude` | Faithful Boris config reconstruction | High |
| 8 | `ThanosAndProfessorX/claude-code-tips` | Multi-agent squad + nightly learning loop | Very High |
| 9 | `ifitsmanu/claude-template` | Synthesizes 5 approaches, 13 agents, tiered commands | Very High |
| 10 | `moarbetsy/Boris-s-Claude-Code-Setup-Guide` | Pure documentation of Feb 2026 practices | Reference |
| 11 | `invertednz/claude-code-setup` | Ralph Loop + TDD + prd.json spec-driven dev | High |
| 12 | `bigdegenenergy/ai-dev-toolkit` | 21 agents, 27 skills, 8 hooks, enterprise-grade | Very High |
| 13 | `jonathan1440/iterative_llm_workflow` | Single-task focus, Cursor-based, stuck detection | Medium |
| 14 | `NatnaeAssefa/mcp-server-setup` | Minimal rules as behavioral contracts | Low |

---

## Core Philosophy

Boris Cherny's method boils down to **5 pillars**, confirmed across all 14 repos:

### 1. Compounding Engineering
CLAUDE.md is a living document that accumulates knowledge. Every mistake becomes a rule. Every correction compounds. Let Claude write its own rules — "Claude is eerily good at writing rules for itself." Share CLAUDE.md with the team; tag `@.claude` on PR comments to trigger updates.

### 2. Plan Before Execute
Start in Plan Mode (Shift+Tab). Iterate until the plan is solid. Switch to auto-accept. "A plan in your head is not a plan." If things go sideways, re-plan instead of pushing through.

### 3. Verification is Everything
**The single most important technique** — 2-3x quality improvement. Give Claude a way to verify its own work: run tests, check types, lint, build, take screenshots, curl endpoints, test UIs. Close the feedback loop.

### 4. Don't Thrash
If you hit a wall, STOP. Document what you learned. Thrashing (trying variations without understanding why they fail) wastes time and teaches nothing. A 10-20% session abandon rate is normal and healthy.

### 5. Parallelize Ruthlessly
Run 3-5 terminal sessions via git worktrees. Use subagents for compute-heavy tasks. Route work that can happen simultaneously into separate sessions. One agent per file — never have two agents editing the same file.

---

## Universal Patterns

These 7 patterns appear in **all or nearly all** of the 14 repos:

### Pattern 1: CLAUDE.md as Flywheel
- Update after every mistake
- Sections: Project Overview, Tech Stack, Commands, Conventions, Known Pitfalls, Learnings
- "Things Claude Should NOT Do" section is critical
- Self-improvement instruction: "After every correction, update this CLAUDE.md"

### Pattern 2: PostToolUse Auto-Format Hook
```json
{
  "PostToolUse": [{
    "matcher": "Write|Edit",
    "hooks": [{
      "type": "command",
      "command": "npm run format 2>/dev/null || npx prettier --write \"$CLAUDE_FILE_PATH\" 2>/dev/null || true"
    }]
  }]
}
```
Claude writes well-formatted code ~90% of the time. The hook handles the last 10%.

### Pattern 3: Three Essential Slash Commands
Every repo includes some version of:
1. **`/commit-push-pr`** — Full git flow with conventional commits
2. **`/verify`** — Tests + lint + typecheck + build
3. **`/simplify`** or `/techdebt` — Post-implementation cleanup

### Pattern 4: Git Worktree Parallelism
```bash
git worktree add .claude/worktrees/<name> origin/main
```
3-5 parallel sessions recommended. Color-code terminal tabs. One task per session.

### Pattern 5: Adversarial Review (`/grill`)
Make Claude be your harshest critic. Rate as SHIP IT / NEEDS WORK / BLOCK. Re-review after fixes until all issues resolved. The `staff-reviewer` agent variant pushes back on unnecessary complexity.

### Pattern 6: Permission Pre-Setting
Pre-allow safe commands (test, lint, build, git read ops) in `.claude/settings.json`. Deny destructive ops (`rm -rf /`, `git push --force`, `sudo`, `curl | bash`). Reduces approval friction dramatically.

### Pattern 7: Subagents for Specialization
Offload to subagents to keep main context clean. The essential three:
- **verify-app** — Run the full verification pipeline
- **code-simplifier** — Clean up after implementation
- **code-reviewer** — Quality check before shipping

---

## Technique Catalog

### A. Autonomous Iteration (Ralph Loop)
**Source:** leiMizzou, invertednz, bigdegenenergy, ifitsmanu
**What:** Feed the same prompt to Claude repeatedly. Each iteration sees previous file changes and git history. State persists in JSON.
**Key Components:**
- `prd.json` with structured user stories and `passes: boolean` fields
- Completion promises: `<promise>TASK_COMPLETE</promise>`
- Max iteration limits (10 default)
- Time budgets (30 min per story)
- Circuit breakers: 3 consecutive failures = STOP
- `progress.txt` accumulates learnings across iterations
- Fresh context per iteration (no carried state)

### B. Spec-Driven Development
**Source:** invertednz, ifitsmanu, jonathan1440
**What:** Start with structured specification, then implement against it.
- `/create-spec` generates `docs/specs/prd.json`
- User stories with acceptance criteria in machine-readable format
- Consistency analysis validates spec ↔ design ↔ tasks before coding

### C. Gated Pipeline (Outline → Execute → Verify → Ship)
**Source:** elb-pr/claudikins-kernel
**What:** 4-stage pipeline with hard enforcement via hooks and state files.
- Each stage writes state to `.claude/<stage>-state.json`
- SHA256 integrity hashes after verification — detects code changes post-verify
- Exit code 2 blocks `/ship` if verify failed
- Human checkpoints at every phase transition
- flock-based file locking prevents race conditions

### D. Single-Task Context Isolation
**Source:** jonathan1440/iterative_llm_workflow
**What:** Load ONLY one task into AI context at a time. Cannot see other tasks.
- Prevents scope creep and jumping ahead
- 8-step implementation cycle per task
- Stuck detection: same error 3+ times → first-principles revisit
- Contextual agent-docs loading (only load database.md for DB tasks)

### E. Dual-Condition Exit Gate
**Source:** bigdegenenergy/ai-dev-toolkit
**What:** Autonomous loops require BOTH completion indicators AND explicit exit signal.
- 2+ completion indicators (tests passing, plan complete, no errors)
- Explicit `EXIT_SIGNAL: true` declaration
- Prevents false exits when completion language appears during productive work

### F. Circuit Breaker Pattern
**Source:** bigdegenenergy, elb-pr
**What:** Three states: CLOSED → HALF_OPEN → OPEN
- 3 consecutive no-progress loops → OPEN
- 5 identical errors → OPEN
- 3 test-only loops → OPEN
- 70% output decline → OPEN

### G. Nightly Compound Learning Loop
**Source:** ThanosAndProfessorX (from @ryancarson)
**What:** Overnight autonomous learning + implementation.
- 10:30 PM: Agent reviews all threads from last 24 hours, extracts learnings, updates AGENTS.md
- 11:00 PM: Agent picks top priority from backlog, implements it, creates draft PR
- Review runs BEFORE implementation so fresh learnings inform work
- macOS launchd with `caffeinate` keeps machine awake 5 PM – 2 AM

### H. Session State Persistence
**Source:** ifitsmanu, elb-pr
**What:** Save/restore session state across context compactions and restarts.
```json
{
  "timestamp": "2026-02-19T...",
  "branch": "feature/auth",
  "commit": "abc1234",
  "modified_files": 3,
  "working_dir": "/home/user/project"
}
```
- PreCompact hook saves state before context window compression
- SessionStart hook reloads state
- Only keeps last 10 state files

### I. Documentation-as-Context (Token Reduction)
**Source:** invertednz/claude-code-setup
**What:** ~50% token reduction by loading docs instead of source files.
- `docs/INDEX.md` — file registry (1-3k tokens)
- `docs/AGENTS.md` — patterns, gotchas, conventions
- `docs/ARCHITECTURE.md` — technical deep-dive
- `docs/progress.txt` — append-only learnings
- Load INDEX.md + AGENTS.md first, add specific files on demand

### J. Pre-Computed Context in Commands
**Source:** 0xquinto, stepan-talaria, 7dieuuoc
**What:** Run bash commands before the AI sees the prompt.
```markdown
Pre-computed Context:
- Current branch: `!git branch --show-current`
- Status: `!git status --short`
- Recent commits: `!git log --oneline -5`
```
Eliminates round-trips for gathering state.

### K. Browser Verification
**Source:** Theopsguide/WWBD, elb-pr/claudikins-kernel
**What:** Playwright/Chrome-based UI verification.
- `tools/browser-check.js` and `tools/screenshot.js`
- Catastrophiser agent runs code and SEES it working
- Boris himself uses a Chrome extension for claude.ai/code testing

### L. Agent Personality System (SOUL)
**Source:** ThanosAndProfessorX/claude-code-tips
**What:** Each agent has a SOUL.md defining personality, strengths, communication style.
- "An agent who's good at everything is mediocre at everything"
- 4-layer memory: session history, working memory, daily notes, long-term memory
- 15-minute heartbeat cron, staggered across agents
- Thread subscriptions for task updates
- Daily standups at 11:30 PM

---

## Agent Archetypes

Consolidated from all 14 repos, these are the recurring agent patterns:

### Tier 1: Essential (every project needs these)

| Agent | Model | Role | Tools |
|-------|-------|------|-------|
| **verify-app** | sonnet | Run tests, lint, typecheck, build, report results | Bash, Read, Grep |
| **code-simplifier** | haiku | Post-implementation cleanup, dead code removal | Read, Edit, Grep, Glob |
| **code-reviewer** | opus | Quality review: correctness, security, conventions | Read, Grep, Glob (READ-ONLY) |

### Tier 2: Quality Gates

| Agent | Model | Role | Tools |
|-------|-------|------|-------|
| **staff-reviewer** | opus | Skeptical architecture review. APPROVE / REQUEST CHANGES / NEEDS RETHINK | Read, Grep, Glob (READ-ONLY) |
| **security-auditor** | sonnet | OWASP top 10, credential scanning, npm audit | Read, Grep, Bash |
| **test-writer** | sonnet | Generate unit/integration/e2e tests, TDD enforcement | Read, Write, Bash |

### Tier 3: Specialist

| Agent | Model | Role | Tools |
|-------|-------|------|-------|
| **code-architect** | sonnet | Design reviews, dependency analysis, composition over inheritance | Read, Grep, Glob |
| **build-validator** | haiku | Clean build pipeline, bundle analysis | Bash, Read |
| **oncall-guide** | sonnet | Production incident response, P0-P3 severity | All tools |
| **catastrophiser** | sonnet | QA: assumes everything will break, runs code, takes screenshots | Read, Bash (NO Edit/Write) |
| **taxonomy-extremist** | sonnet | READ-ONLY research across codebase, docs, web | Read, Grep, Glob, WebFetch (NO Bash) |
| **cynic** | sonnet | Senior engineer who hates complexity, one change at a time | Read, Edit (NO Write new files) |
| **babyclaude** | haiku | Eager implementer with strict scope. Logs out-of-scope to SCOPE_NOTES.md | Read, Write, Edit (NO git, NO Task) |

### Agent Design Principles
1. **Read-only agents for review** — code-reviewer, staff-reviewer, taxonomy-extremist cannot modify files
2. **Model matches task** — Haiku for fast iteration, Sonnet for judgment, Opus for complex reasoning
3. **Tool restrictions enforce behavior** — babyclaude can't run git. catastrophiser can't edit files.
4. **Concise prompts win** — staff-reviewer is only ~15 lines and outperforms verbose definitions
5. **Structured output** — Agents report: SHIP IT / NEEDS WORK / BLOCK or SUCCESS / BLOCKED / FAILED

---

## Hook Lifecycle Patterns

The most powerful hooks discovered across all repos:

### SessionStart
```
- Inject git status, recent commits, active TODOs, project type detection
- Load saved session state (branch, commit, modified files)
- Detect failing tests and inject results
- Eliminates the "cold start" problem
```

### UserPromptSubmit
```
- Skill auto-activation: Node.js script analyzes prompt keywords → activates relevant skills
- Permission routing: Route approval requests to Opus 4.5 for auto-approve decisions
```

### PreToolUse
```
- Safety net: 40+ regex patterns blocking dangerous commands
- Sensitive file access prevention (.env, credentials, SSH keys)
- Secret detection in write operations
- Git branch guards (prevent ops on wrong branch)
- Bash command sanitization
```

### PostToolUse
```
- Auto-format on Write|Edit (Prettier/Black/Ruff based on extension)
- Multi-language: prettier for JS/TS, ruff for Python, gofmt for Go, rustfmt for Rust
```

### PreCompact
```
- Save critical state before context compression
- Mark sessions as "interrupted" (not abandoned)
- Offer resume on next session
```

### Stop (End of Turn)
```
- Quality gate: run tests, typecheck, lint, security scan
- CLAUDE_STRICT_MODE: block completion on test failures
- Log metrics to .claude/metrics/quality_checks.csv
- Save session state for next turn
```

### SubagentStart / SubagentStop
```
- Block babyclaude from running git commands
- Capture agent outputs to .claude/agent-outputs/
```

---

## Slash Command Patterns

### Must-Have Commands

| Command | Purpose | Pre-computed Context |
|---------|---------|---------------------|
| `/commit-push-pr` | Full git flow, conventional commits, Co-Authored-By | `!git status --short`, `!git log --oneline -5` |
| `/verify` | Tests + lint + typecheck + build + report | None (runs live) |
| `/simplify` | Post-edit cleanup, dead code, over-engineering check | `!git diff HEAD~1 --stat` |
| `/grill` | Adversarial review: SHIP IT / NEEDS WORK / BLOCK | `!git diff --cached` |
| `/techdebt` | End-of-session scan: duplication, dead exports, smells | `!git diff --stat HEAD~5` |
| `/plan` | Structured planning template (Goal, Approach, Files, Verification) | None |

### Advanced Commands

| Command | Purpose | Source |
|---------|---------|-------|
| `/worktree` | Create git worktree for parallel session | 0xquinto, stepan-talaria |
| `/ralph-loop` | Autonomous iteration with TDD | leiMizzou, invertednz |
| `/tdd-loop` | Red-Green-Refactor enforcement | invertednz |
| `/create-spec` | Generate prd.json from requirements | invertednz |
| `/test-and-fix` | Run tests, fix failures one at a time | stepan-talaria |
| `/review-changes` | Pre-commit self-review | stepan-talaria |
| `/debug` | Systematic: reproduce → isolate → hypothesize → fix | WWBD |
| `/load-context` | Load INDEX.md + AGENTS.md only (token reduction) | invertednz |
| `/outline` | 5-phase iterative planning with human checkpoints | claudikins-kernel |

---

## Configuration Stack

The canonical Boris Cherny setup, synthesized across all repos:

```
Project Root/
├── CLAUDE.md                      # Living knowledge base (THE most important file)
├── .claude/
│   ├── settings.json              # Permissions, hooks, model config
│   ├── commands/                  # Slash commands as .md files
│   │   ├── commit-push-pr.md
│   │   ├── verify.md
│   │   ├── simplify.md
│   │   ├── grill.md
│   │   ├── techdebt.md
│   │   ├── plan.md
│   │   └── ...
│   ├── agents/                    # Subagent definitions
│   │   ├── verify-app.md
│   │   ├── code-simplifier.md
│   │   ├── code-reviewer.md
│   │   ├── staff-reviewer.md
│   │   └── ...
│   └── skills/                    # Auto-activated skill files
│       ├── tdd/SKILL.md
│       ├── autonomous-loop/SKILL.md
│       ├── security-review/SKILL.md
│       └── ...
├── .mcp.json                      # MCP server configuration
└── docs/
    ├── INDEX.md                   # File registry (token-efficient context)
    ├── AGENTS.md                  # Patterns, gotchas, conventions
    ├── ARCHITECTURE.md            # Technical deep-dive
    └── progress.txt               # Append-only learnings log
```

### settings.json Template
```json
{
  "model": "opus",
  "thinking": true,
  "permissions": {
    "allow": [
      "Bash(npm test*)", "Bash(npm run *)", "Bash(npx *)",
      "Bash(git status*)", "Bash(git diff*)", "Bash(git log*)",
      "Bash(git add*)", "Bash(git commit*)", "Bash(git branch*)",
      "Bash(gh pr *)", "Bash(gh issue *)",
      "Bash(node *)", "Bash(ls *)", "Bash(mkdir *)"
    ],
    "deny": [
      "Bash(rm -rf /)", "Bash(sudo *)", "Bash(curl * | bash)",
      "Bash(git push --force*)", "Bash(git reset --hard*)",
      "Bash(*production*)", "Bash(*prod*)",
      "Bash(DROP TABLE*)", "Bash(DELETE FROM*)"
    ]
  }
}
```

### MCP Essential Servers
| Server | Purpose | Priority |
|--------|---------|----------|
| context7 | Library documentation lookup | Essential |
| playwright | Browser testing / E2E | Essential |
| sequential-thinking | Deep reasoning on complex problems | Essential |
| memory | Knowledge graph persistence | Recommended |
| exa | Semantic web search | Optional |

---

## GODMODEDEV Integration Recommendations

Based on the analysis, here are the **highest-value additions** to the GODMODEDEV skillpository:

### Priority 1: New Skills to Build

| Skill Name | Category | What It Does | Source Inspiration |
|------------|----------|-------------|-------------------|
| `boris-ralph-loop` | autonomous-workflows | Autonomous iteration with prd.json, completion promises, circuit breakers | invertednz, bigdegenenergy |
| `boris-verification-pipeline` | quality-gates | 4-phase verify: static analysis → automated tests → manual check → edge cases | 0xquinto, WWBD, claudikins |
| `boris-grill-review` | code-review | Adversarial review loop: SHIP IT / NEEDS WORK / BLOCK with re-review cycles | 0xquinto, stepan-talaria |
| `boris-spec-driven-dev` | planning | Generate prd.json from requirements, machine-readable user stories | invertednz |
| `boris-session-state` | context-management | Save/restore session state across compactions via PreCompact/SessionStart hooks | ifitsmanu, claudikins |
| `boris-token-reducer` | context-management | Documentation-as-context pattern: INDEX.md + AGENTS.md instead of source files | invertednz |
| `boris-hook-safety-net` | security | 40+ regex patterns blocking dangerous commands, sensitive file access | bigdegenenergy |
| `boris-nightly-learning` | autonomous-workflows | Overnight compound review + auto-implementation loop | ThanosAndProfessorX |

### Priority 2: New Agents to Build

| Agent Name | Model | Role | Key Innovation |
|------------|-------|------|----------------|
| `boris-catastrophiser` | sonnet | QA agent that assumes everything breaks, takes screenshots | claudikins-kernel |
| `boris-staff-reviewer` | opus | Skeptical 15-line prompt, pushes back on complexity | 0xquinto |
| `boris-babyclaude` | haiku | Eager implementer with strict scope, no git access | claudikins-kernel |
| `boris-cynic` | sonnet | Senior engineer who hates complexity, one change at a time | claudikins-kernel |
| `boris-taxonomy-researcher` | sonnet | READ-ONLY research across codebase + docs + web | claudikins-kernel |

### Priority 3: Enhance Existing GODMODEDEV Infrastructure

1. **Add hook templates** to the skillpository — PostToolUse formatter, PreToolUse safety net, SessionStart context injection, Stop quality gate
2. **Add a `/boris-init` command** that scaffolds the full Boris configuration stack into any project
3. **Integrate stuck detection** into existing autonomous workflows — same error 3+ times → first-principles revisit
4. **Add dual-condition exit gates** to all autonomous loop skills
5. **Add circuit breaker pattern** to all long-running agent skills
6. **MCP context budget warning** — document the 20-30 MCP / 80 tool limit in skillpository docs

---

## Key Insights for Your Workflow

### What Boris Actually Uses Daily
From the Feb 2026 documentation (moarbetsy repo):
1. **Opus 4.5 with thinking** for everything — slower per-request but faster overall
2. **5 terminal sessions + 5-10 claude.ai/code sessions** in parallel
3. **`--teleport`** to move sessions between terminal and web
4. **Starts sessions from iPhone** via Claude iOS app
5. **`/commit-push-pr`** is the most-used command
6. **`code-simplifier`** and **`verify-app`** are the daily-driver subagents
7. **Voice dictation** (fn x2 on macOS) — "you speak 3x faster than you type"
8. **Ghostty terminal** for synchronized rendering
9. **Slack MCP** — paste bug threads and say "fix"
10. **`@.claude` PR tagging** for team-wide CLAUDE.md updates

### The Boris Maturity Model
Where you can level up:

| Level | Description | You're Here If... |
|-------|-------------|-------------------|
| 1 | CLAUDE.md + basic commands | Have a CLAUDE.md, use plan mode |
| 2 | + Hooks + subagents | Auto-format hook, verify-app agent |
| 3 | + Adversarial review + worktrees | /grill, parallel sessions |
| 4 | + Autonomous loops + circuit breakers | Ralph Loop with exit gates |
| 5 | + Full SRE pipeline + nightly learning | Gated stages, SHA256 integrity, auto-compound |

### Anti-Patterns to Avoid
From ifitsmanu's explicit rejections:
- **27+ agents** — creates overlap; 12-13 is the sweet spot
- **Auto-capture memory** — creates noise; use selective manual capture
- **Always-on planning** — kills velocity for simple tasks
- **External databases for state** — failure points; use file-based state
- **Silent failures** — mask problems; always surface errors
- **46KB+ CLAUDE.md** — context bloat; keep core under 400 lines, use separate docs

---

## Raw Data Sources

All findings extracted from:
- Boris Cherny's original Threads post (7.4M+ views, thread ID 2007179832300581177)
- Boris Cherny's Jan 2026 team tips thread (ID 2017742741636321619)
- Boris Cherny's Feb 2026 practices documentation
- 14 GitHub repositories listed in the source table above
