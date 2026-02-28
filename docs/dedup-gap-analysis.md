# ©2026 Brad Scheller

# Deduplication & Gap Analysis: Skillpository vs. Imports

**Date:** 2026-02-21
**Scope:** Existing skillpository (1,144 items) vs. GitHub Skills imports (292 items) vs. Boris Cherny repos (220 items)
**Total items analyzed:** 1,656

---

## Table of Contents

1. [Duplicates](#1-duplicates)
2. [Gaps](#2-gaps)
3. [Quality Comparison](#3-quality-comparison)
4. [Recommended Import List](#4-recommended-import-list)

---

## 1. DUPLICATES

Items in the imports that already exist in the skillpository, grouped by match type.

### 1.1 Exact Name Matches

These items have identical or near-identical names across the skillpository and one or more import sources.

| Skillpository Name | Import Source | Import Location |
|---|---|---|
| `code-reviewer` (agent) | claudikins-kernel | `boris-cherny-repos/claudikins-kernel/agents/code-reviewer.md` |
| `code-reviewer` (agent) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/code-reviewer/` |
| `code-reviewer` (agent) | jeffallan-66 | `github-skills/jeffallan-66-skills/skills/code-reviewer/` |
| `code-reviewer` (agent) | BorisWorkflow | `boris-cherny-repos/BorisWorkflow/templates/agents/code-reviewer.md` |
| `code-simplifier` (agent) | BorisWorkflow | `boris-cherny-repos/BorisWorkflow/templates/agents/code-simplifier.md` |
| `code-simplifier` (agent) | WWBD | `boris-cherny-repos/WWBD/subagents/code-simplifier.md` |
| `mcp-builder` (skill) | anthropics-official | `github-skills/anthropics-official/skills/mcp-builder/` |
| `mcp-developer` (agent) | jeffallan-66 | `github-skills/jeffallan-66-skills/skills/mcp-developer/` |
| `ceo-advisor` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/c-level-advisor/ceo-advisor/` |
| `cto-advisor` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/c-level-advisor/cto-advisor/` |
| `scrum-master` (agent) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering-team/scrum-master/` |
| `product-strategist` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/product-team/product-strategist/` |
| `quality-documentation-manager` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/quality-documentation-manager/` |
| `quality-manager-qms-iso13485` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/quality-manager-qms-iso13485/` |
| `quality-manager-qmr` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/quality-manager-qmr/` |
| `isms-audit-expert` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/isms-audit-expert/` (as `information-security-manager-iso27001`) |
| `gdpr-dsgvo-expert` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/gdpr-dsgvo-expert/` |
| `capa-officer` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/capa-officer/` |
| `fda-consultant-specialist` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/fda-consultant-specialist/` |
| `mdr-745-specialist` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/mdr-745-specialist/` |
| `regulatory-affairs-head` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/regulatory-affairs-head/` |
| `risk-management-specialist` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/ra-qm-team/risk-management-specialist/` |
| `marketing-strategy-pmm` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/marketing-skill/marketing-strategy-pmm/` |
| `marketing-demand-acquisition` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/marketing-skill/marketing-demand-acquisition/` |
| `product-manager-toolkit` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/product-team/product-manager-toolkit/` |
| `ux-researcher-designer` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/product-team/ux-researcher-designer/` |
| `senior-data-engineer` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/senior-data-engineer/` |
| `senior-ml-engineer` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/senior-ml-engineer/` |
| `senior-computer-vision` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/senior-computer-vision/` |
| `senior-data-scientist` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/senior-data-scientist/` |
| `senior-prompt-engineer` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/engineering/senior-prompt-engineer/` |
| `ui-design-system` (skill) | alirezarezvani | `github-skills/alirezarezvani-skills/product-team/ui-design-system/` |
| `pdf` (skill) | anthropics-official | `github-skills/anthropics-official/skills/pdf/` |
| `pptx` (skill) | anthropics-official | `github-skills/anthropics-official/skills/pptx/` |
| `docx` (skill) | anthropics-official | `github-skills/anthropics-official/skills/docx/` |
| `xlsx` (skill) | anthropics-official | `github-skills/anthropics-official/skills/xlsx/` |
| `frontend-design` (skill) | anthropics-official | `github-skills/anthropics-official/skills/frontend-design/` |
| `brand-guidelines` (skill) | anthropics-official | `github-skills/anthropics-official/skills/brand-guidelines/` |
| `canvas-design` (skill) | anthropics-official | `github-skills/anthropics-official/skills/canvas-design/` (listed as `canvas-design`) |
| `doc-coauthoring` (skill) | anthropics-official | `github-skills/anthropics-official/skills/doc-coauthoring/` |
| `internal-comms` (skill) | anthropics-official | `github-skills/anthropics-official/skills/internal-comms/` |
| `slack-gif-creator` (skill) | anthropics-official | `github-skills/anthropics-official/skills/slack-gif-creator/` |
| `theme-factory` (skill) | anthropics-official | `github-skills/anthropics-official/skills/theme-factory/` |
| `web-artifacts-builder` (skill) | anthropics-official | `github-skills/anthropics-official/skills/web-artifacts-builder/` |
| `webapp-testing` (skill) | anthropics-official | `github-skills/anthropics-official/skills/webapp-testing/` |
| `algorithmic-art` (skill) | anthropics-official | `github-skills/anthropics-official/skills/algorithmic-art/` |
| `skill-creator` (skill) | anthropics-official, daymade | Both have `skill-creator` |
| `qa-expert` (agent) | daymade | `github-skills/daymade-marketplace/qa-expert/` |
| `ui-designer` (agent) | daymade | `github-skills/daymade-marketplace/ui-designer/` |
| `deep-research` (skill) | daymade | `github-skills/daymade-marketplace/deep-research/` |
| `skill-reviewer` (agent) | daymade | `github-skills/daymade-marketplace/skill-reviewer/` |

### 1.2 Functional Equivalents (Different Name, Same Purpose)

| Skillpository Item | Import Item | Source | Relationship |
|---|---|---|---|
| `deslop` (skill) | `cynic` (agent) | claudikins-kernel | Both aggressively simplify code and remove complexity. Cynic is agent-based, deslop is skill-based. |
| `verify-app` / `verification-before-completion` (skills) | `verify-app` (agent) | BorisWorkflow, WWBD | Skillpository has verification skills; imports have verification agents with gated pipeline enforcement. |
| `test-driven-development` / `tdd-workflow` (skills) | `tdd` (skill), `/test-driven` (cmd) | ai-dev-toolkit | Same TDD concept; ai-dev-toolkit version includes Ralph Loop integration. |
| `security-auditor` (agent) | `@security-auditor` (agent) | ai-dev-toolkit | Both do OWASP Top 10 scanning; ai-dev-toolkit version integrates with CI/CD workflows. |
| `systematic-debugging` (skill) | `systematic-debugging` (skill) | ai-dev-toolkit | Name match; ai-dev-toolkit has hypothesis-driven evidence-based approach. |
| `browser-automation` (skill) | `browser-automation` (skill) | ai-dev-toolkit | Skillpository has Playwright skill; ai-dev-toolkit adds visual diff and screenshot commands. |
| `commit` / `Git Commit Helper` (skills) | `commit-push-pr` (cmd) | BorisWorkflow | Similar git workflow; BorisWorkflow includes PR creation in atomic command. |
| `prompt-engineering-patterns` / `prompt-improver` / `prompting` / `prompt-master` (skills) | `prompt-optimizer` (skill) | daymade | Multiple prompt skills in skillpository; daymade has focused prompt optimization. |
| `rag-implementation` / `rag-master` / `rag-engineer` (skills) | `rag-architect` (skill) | jeffallan-66, alirezarezvani | Skillpository has 3 RAG skills; imports have RAG architect variants. |
| `database-design` / `database-master` / `databases` (skills) | `database-designer` (skill) | alirezarezvani | Multiple database skills overlap; alirezarezvani has structured designer with templates. |
| `debugging-strategies` / `debug-mode` (skills) | `debugging-wizard` (skill) | jeffallan-66 | Functional overlap in debugging approach. |
| `playwright-skill` / `Playwright Browser Automation` (skills) | `playwright-expert` (skill) | jeffallan-66 | Both cover Playwright; jeffallan version likely has deeper reference material. |
| `security-best-practices` / `security-master` (skills) | `secure-code-guardian` / `security-reviewer` | jeffallan-66 | Functional overlap in security review. |
| `docker-expert` (skill) | `docker-essentials` (skill) | ai-dev-toolkit | Both cover Docker; ai-dev-toolkit integrates with hooks. |
| `git-workflow-patterns` / `git-advanced-workflows` (skills) | `git-workflows` (skill) | ai-dev-toolkit | Functional overlap; ai-dev-toolkit adds worktree patterns. |
| `code-review` / `code-review-excellence` / `code-review-master` (skills) | `code-reviewer` (agent) | multiple | Skillpository has 3 code review skills + agent; every import also has one. |
| `python-pro` (agent) | `python-pro` (skill) | jeffallan-66 | Exact match; ai-dev-toolkit also has `@python-pro` agent. |
| `typescript-pro` (agent) | `typescript-pro` (skill) | jeffallan-66 | Exact match; ai-dev-toolkit also has `@typescript-pro` agent. |
| `golang-pro` (agent) | `golang-pro` (skill) | jeffallan-66 | Exact name match. |
| `cpp-pro` (agent) | `cpp-pro` (skill) | jeffallan-66 | Exact name match. |
| `rust-engineer` (agent) | `rust-engineer` (skill) | jeffallan-66 | Exact name match. |
| `java-architect` (agent) | `java-architect` (skill) | jeffallan-66 | Exact name match. |
| `swift-expert` (agent) | `swift-expert` (skill) | jeffallan-66 | Exact name match. |
| `vue-expert` (agent) | `vue-expert` (skill) | jeffallan-66 | Exact name match. |
| `laravel-specialist` (agent) | `laravel-specialist` (skill) | jeffallan-66 | Exact name match. |
| `spring-boot-engineer` (agent) | `spring-boot-engineer` (skill) | jeffallan-66 | Exact name match. |
| `sql-pro` (agent) | `sql-pro` (skill) | jeffallan-66 | Exact name match. |
| `kubernetes-specialist` (agent) | `kubernetes-specialist` (skill) | jeffallan-66 | Exact name match. |
| `sre-engineer` (agent) | `sre-engineer` (skill) | jeffallan-66 | Exact name match. |
| `terraform-engineer` (agent) | `terraform-engineer` (skill) | jeffallan-66 | Exact name match. |
| `devops-engineer` (agent) | `devops-engineer` (skill) | jeffallan-66 | Exact name match. |
| `legacy-modernizer` (agent) | `legacy-modernizer` (skill) | jeffallan-66 | Exact name match. |
| `websocket-engineer` (agent) | `websocket-engineer` (skill) | jeffallan-66 | Exact name match. |
| `cloud-architect` (agent) | `cloud-architect` (skill) | jeffallan-66 | Exact name match. |
| `graphql-architect` (agent) | `graphql-architect` (skill) | jeffallan-66 | Exact name match. |
| `microservices-architect` (agent) | `microservices-architect` (skill) | jeffallan-66 | Exact name match. |
| `flutter-expert` (agent) | `flutter-expert` (skill) | jeffallan-66 | Exact name match. |
| `chaos-engineer` (agent) | `chaos-engineer` (skill) | jeffallan-66 | Exact name match. |
| `prompt-engineer` (agent) | `prompt-engineer` (skill) | jeffallan-66 | Exact name match. |
| `postgres-pro` (agent) | `postgres-pro` (skill) | jeffallan-66 | Exact name match. |
| `cli-developer` (agent) | `cli-developer` (skill) | jeffallan-66 | Exact name match. |

### 1.3 Duplicate Summary

| Category | Count | Notes |
|---|---|---|
| **Exact name matches** | ~50 | Mainly jeffallan-66 language/role skills + alirezarezvani enterprise skills |
| **Functional equivalents** | ~25 | Different names but same domain coverage |
| **Total duplicates** | ~75 | Roughly 15% of all import items |

**Key takeaway:** The jeffallan-66 collection has the highest overlap (~40 of 66 skills match existing skillpository agents/skills). The alirezarezvani enterprise/QM skills are also heavily represented already. The Boris Cherny repos and daymade-marketplace have the LEAST overlap and thus the most novel content.

---

## 2. GAPS

Items in imports that DO NOT exist in the skillpository, organized by priority.

### 2.1 Priority 1 -- High Value, Directly Useful

These represent genuinely new capabilities not found anywhere in the current 1,144-item skillpository.

#### Boris Workflow Patterns (Unique to Boris Cherny Repos)

| Item | Type | Source | Description |
|---|---|---|---|
| **Ralph Loop** (`/ralph` + `ralph-coder` skill) | Command + Skill | ai-dev-toolkit | Autonomous development loop with dual-condition exit gate and circuit breakers. Prevents infinite loops with 3 consecutive no-progress detection. Structured `STATUS/EXIT_SIGNAL/TASKS_COMPLETED` reporting. |
| **Grill / Gated Pipeline** (`/outline -> /execute -> /verify -> /ship`) | Workflow | claudikins-kernel | 4-stage pipeline with mandatory gates between each stage. Cannot skip steps. SHA256 integrity hashes ensure shipped code matches verified code. |
| **Worktree-based Parallel Development** | Pattern | bcherny-claude, ai-dev-toolkit | `git worktree add .claude/worktrees/<name> origin/main` for fully parallel agent workstreams. Each agent gets its own branch without conflicts. |
| **Session State Persistence** | Hooks | claudikins-kernel | State files in `.claude/` with `flock` file locking, cross-session resume, stale session detection (4+ hours), `verify-state.json` with unlock gates. |
| **Catastrophiser Agent** | Agent | claudikins-kernel | Output verification agent that SEES code working -- starts servers, takes Playwright screenshots, curls endpoints, runs CLI commands. Goes beyond test-passing to visual evidence. |
| **Cynic Agent** (distinct from `deslop`) | Agent | claudikins-kernel | More disciplined than deslop -- makes changes ONE at a time, verifies tests still pass after EACH change, reverts if they break. Test-validated simplification. |
| **Taxonomy-Extremist Agent** | Agent | claudikins-kernel | Research agent that categorizes everything -- reads codebase, external docs, the web -- returns structured findings for the outline phase. |
| **BabyClaude Agent** | Agent | claudikins-kernel | Fresh-context implementer. Each task gets a clean agent with zero context pollution from previous tasks. Key for multi-task execution. |
| **Spec-Reviewer Agent** | Agent | claudikins-kernel | Mechanical compliance checker -- did the implementation match the acceptance criteria? Not about quality, about contract fulfillment. |
| **Git-Perfectionist Agent** | Agent | claudikins-kernel | Documentation gate agent. README not updated? Changelog wrong? Blocks shipping until documentation is complete. |
| **Conflict-Resolver Agent** | Agent | claudikins-kernel | Branch collision handler. When multiple agent branches need merging, proposes merge resolutions. |
| **Brain-Jam Planning Skill** | Skill | claudikins-kernel | Interactive planning with iteration limits, approach conflict resolution, plan abandonment cleanup, session collapse recovery. Rich reference material (9 reference docs). |
| **Shipping Methodology Skill** | Skill | claudikins-kernel | Breaking change detection, changelog merge strategy, CI failure handling, commit message patterns, force-push protection, PR creation strategy. (10 reference docs). |
| **Strict Enforcement Skill** | Skill | claudikins-kernel | Cross-command gate enforcement. Evidence-based verification -- "never claim code works without seeing it work." Exit code 2 gates block shipping. (10 reference docs). |
| **Git Workflow Skill** (claudikins version) | Skill | claudikins-kernel | Batch patterns, branch collision detection, circuit breakers, dependency failure chains, execution tracing, review conflict matrix, task decomposition. (11 reference docs). |
| **Safety-Net Hooks** | Hooks | ai-dev-toolkit | PreToolUse hook that blocks dangerous commands. Auto-approve hook for safe commands. Context injection at session start. Skill auto-activation based on prompt keywords. |
| **Quality Gate Stop Hook** | Hook | ai-dev-toolkit | Runs tests at end of every turn. Combined with strict mode (`CLAUDE_STRICT_MODE=1`), blocks task completion until tests pass. |
| **Commit Context Generator** | Hook | ai-dev-toolkit | Pre-commit hook that auto-documents changes for PR review context. Generates category analysis, pattern detection, change type inference. |
| **Nightly Learning Loop** | Pattern/Doc | claude-code-tips | Cron-based compound learning: reviews all threads from last 24 hours, extracts learnings, updates instructions, picks next priority task and ships it overnight. |
| **Agent Squad / Mission Control** | Pattern/Doc | claude-code-tips | 10-agent team architecture with SOUL personality system, heartbeat monitoring, shared brain, daily standups, persistent memory. |
| **Zeno Analyzer** | Agent | ai-dev-toolkit | Surgical code analysis with exact file:line citations. Separate `/zeno-verify` validates citations still hold. |
| **Lobster Workflow Engine** | System | ai-dev-toolkit | Typed workflow pipelines with approval gates, state persistence, and ChatOps integration via Slack/Discord/Telegram. |
| **Pulse Intake** | Command | ai-dev-toolkit | Processes structured idea payloads (JSON), creates branch + spec automatically. Supports `intake`, `start`, `review` actions. |
| **Cross-Workflow PR Session Memory** | System | ai-dev-toolkit | Persistent session memory across Gemini/Codex/Claude review cycles using `<!-- pr-session:TYPE:BASE64 -->` markers. Prevents "Groundhog Day" re-flagging of resolved issues. |

#### Levnikolaevich Software Delivery Pipeline (103 Skills)

This is an entire delivery pipeline system with no equivalent in the skillpository. Each skill is a numbered stage in a comprehensive SDLC pipeline.

| Category | Skills | Key Unique Items |
|---|---|---|
| **Research & Standards** (ln-001 to ln-004) | 4 | `standards-researcher`, `best-practices-researcher`, `push-all`, `agent-sync` |
| **Documentation Pipeline** (ln-100 to ln-150) | 10 | `documents-pipeline`, coordinated doc creation for root/backend/frontend/devops/test/reference/tasks/presentations |
| **Scope Decomposition** (ln-200 to ln-230) | 7 | `scope-decomposer`, `opportunity-discoverer`, `epic-coordinator`, `story-coordinator/creator/replanner`, `story-prioritizer` |
| **Task Execution** (ln-300 to ln-404) | 8 | `task-coordinator/creator/replanner`, `story-validator`, `story-executor`, `task-executor/reviewer/rework`, `test-executor` |
| **Quality Gates** (ln-500 to ln-523) | 9 | `story-quality-gate`, `quality-coordinator`, `code-quality-checker`, `tech-debt-cleaner`, `regression-checker`, `test-planner/researcher`, `manual-tester`, `auto-test-planner` |
| **Audit System** (ln-600 to ln-653) | 27 | Comprehensive audit: `docs/semantic-content/code-comments/codebase/security/build/code-principles/code-quality/dependencies/dead-code/observability/concurrency/lifecycle/test/pattern-evolution/layer-boundary/api-contract/dependency-graph/persistence-performance/query-efficiency/transaction-correctness/runtime-performance` |
| **Project Bootstrap** (ln-700 to ln-783) | 28 | `project-bootstrap`, dep upgraders (npm/nuget/pip), structure migrators, devops setup (docker/cicd/env), quality setup (linter/precommit/test-infra), commands generator, security setup, crosscutting (logging/error-handler/cors/healthcheck/api-docs), bootstrap verifier |
| **Pipeline Orchestrator** (ln-1000) | 1 | Master orchestrator coordinating all pipeline stages |

**This is the single largest gap.** The skillpository has individual skills for code review, testing, etc., but nothing approaching a coordinated 103-skill delivery pipeline.

#### Daymade Claude Code Meta-Tooling

| Item | Source | Description |
|---|---|---|
| `claude-code-history-files-finder` | daymade | Find and manage Claude Code session history files |
| `claude-md-progressive-disclosurer` | daymade | Progressive disclosure pattern for CLAUDE.md files -- reveals context gradually |
| `claude-skills-troubleshooting` | daymade | Debug and fix Claude Code skills that aren't activating properly |
| `cli-demo-generator` | daymade | Generate CLI demonstration videos/GIFs |
| `promptfoo-evaluation` | daymade | Evaluate prompts systematically using promptfoo framework |
| `prompt-optimizer` | daymade | Optimize prompts for cost, speed, and quality |
| `repomix-safe-mixer` | daymade | Safely mix multiple repos into a single context |
| `repomix-unmixer` | daymade | Reverse a repomix operation |
| `skills-search` | daymade | Search and discover available skills |
| `statusline-generator` | daymade | Generate status line displays for CLI tools |
| `transcript-fixer` | daymade | Fix and clean up transcripts |
| `tunnel-doctor` | daymade | Debug and fix network tunnel issues |

### 2.2 Priority 2 -- Good to Have

#### Enterprise Skills from Alirezarezvani (Not in Skillpository)

| Item | Category | Description |
|---|---|---|
| `atlassian-admin` | Enterprise | Atlassian suite administration |
| `confluence-expert` | Enterprise | Confluence documentation and spaces management |
| `jira-expert` | Enterprise | Jira project tracking, workflows, JQL |
| `atlassian-templates` | Enterprise | Templates for Atlassian tools |
| `ms365-tenant-manager` | Enterprise | Microsoft 365 tenant administration |
| `incident-commander` | Enterprise | Incident management and coordination |
| `information-security-manager-iso27001` | Compliance | ISO 27001 ISMS management (skillpository has audit but not management) |
| `financial-analyst` | Finance | Financial analysis and reporting |
| `revenue-operations` | Business | Revenue operations and forecasting |
| `customer-success-manager` (enterprise version) | Business | Enterprise-grade CSM with health scoring, churn prediction, expansion opportunity scoring |
| `sales-engineer` (enterprise version) | Business | Enterprise SE with demo scripts, POC frameworks |
| `tech-stack-evaluator` | Engineering | Evaluate and compare technology stacks |
| `tech-debt-tracker` | Engineering | Track and prioritize technical debt |
| `interview-system-designer` | Engineering | Design interview systems and questions |
| `migration-architect` | Engineering | Plan and execute system migrations |
| `dependency-auditor` | Engineering | Audit dependency health, vulnerabilities, licensing |
| `release-manager` | Engineering | Release planning and execution |
| `observability-designer` | Engineering | Design observability systems (logs, metrics, traces) |
| `api-design-reviewer` | Engineering | Review API designs for best practices |
| `agent-designer` | Engineering | Design AI agent architectures |
| `social-media-analyzer` | Marketing | Analyze social media performance |
| `campaign-analytics` | Marketing | Marketing campaign analytics |
| `app-store-optimization` | Marketing | ASO for mobile apps |
| `agile-product-owner` (enterprise version) | Product | Enterprise-grade PO skill with sprint ceremonies |
| `tdd-guide` | Engineering | TDD guidance (may be richer than existing) |
| `senior-architect` | Engineering | Senior architecture patterns |
| `senior-backend` / `senior-frontend` / `senior-fullstack` | Engineering | Senior-level full-stack skills |
| `senior-pm` | Product | Senior product management |
| `senior-qa` | QA | Senior QA engineering |
| `senior-secops` / `senior-security` | Security | Senior security operations |
| `senior-devops` | DevOps | Senior DevOps engineering |

#### Jeffallan-66 Unique Items

| Item | Description |
|---|---|
| `atlassian-mcp` | MCP server integration for Atlassian tools (Jira/Confluence) |
| `architecture-designer` | System architecture design |
| `code-documenter` | Generate code documentation |
| `debugging-wizard` | Advanced debugging techniques |
| `feature-forge` | Feature development patterns |
| `fine-tuning-expert` | LLM fine-tuning |
| `fullstack-guardian` | Full-stack quality guardian |
| `ml-pipeline` | ML pipeline design |
| `monitoring-expert` | Monitoring setup and management |
| `nestjs-expert` | NestJS framework |
| `pandas-pro` | Pandas data manipulation |
| `salesforce-developer` | Salesforce development |
| `secure-code-guardian` | Security-focused code guardian |
| `shopify-expert` | Shopify development |
| `spark-engineer` | Apache Spark |
| `spec-miner` | Extract specs from existing code |
| `the-fool` | Adversarial agent that asks "stupid" questions to find assumptions |
| `wordpress-pro` | WordPress development |
| `vue-expert-js` | Vue.js (JavaScript variant) |
| `react-native-expert` | React Native specialist |
| `dotnet-core-expert` | .NET Core specialist |
| `embedded-systems` | Embedded systems development |

#### Daymade Unique Practical Skills

| Item | Description |
|---|---|
| `cloudflare-troubleshooting` | Debug Cloudflare issues |
| `competitors-analysis` | Competitive analysis |
| `docs-cleaner` | Clean up documentation |
| `fact-checker` | Verify claims and facts |
| `github-contributor` | Contribute to open source projects |
| `github-ops` | GitHub operations and management |
| `i18n-expert` | Internationalization |
| `iOS-APP-developer` | iOS app development |
| `llm-icon-finder` | Find icons using LLM |
| `macos-cleaner` | macOS system cleanup |
| `markdown-tools` | Markdown manipulation tools |
| `meeting-minutes-taker` | Generate meeting minutes |
| `mermaid-tools` | Mermaid diagram tools |
| `pdf-creator` | Create PDFs |
| `ppt-creator` | Create PowerPoint presentations |
| `teams-channel-post-writer` | Write Microsoft Teams posts |
| `twitter-reader` | Read and analyze Twitter/X content |
| `video-comparer` | Compare video files |
| `windows-remote-desktop-connection-doctor` | Debug RDP issues |
| `youtube-downloader` | Download YouTube content |

### 2.3 Priority 3 -- Nice to Have

| Item | Source | Notes |
|---|---|---|
| `csharp-developer` (jeffallan) | jeffallan-66 | Skillpository already has `csharp-pro`; may have different depth |
| `django-expert` (jeffallan) | jeffallan-66 | Skillpository has `django-pro` and `django-developer`; possible quality diff |
| `react-expert` (jeffallan) | jeffallan-66 | Skillpository has `react-specialist`, `react-dev`, `react-master` |
| `fastapi-expert` (jeffallan) | jeffallan-66 | Skillpository has `fastapi-pro`, `fastapi-templates`, `fastapi-patterns` |
| `nextjs-developer` (jeffallan) | jeffallan-66 | Already exists in skillpository |
| `php-pro` (jeffallan) | jeffallan-66 | Already exists in skillpository |
| `kotlin-specialist` (jeffallan) | jeffallan-66 | Already exists in skillpository |
| `database-optimizer` (jeffallan) | jeffallan-66 | Already exists in skillpository |
| `elixir-pro` (jeffallan) | jeffallan-66 | Skillpository has `elixir-expert` and `elixir-pro` |
| `aws-solution-architect` (alirezarezvani) | alirezarezvani | Multi-cloud covered by existing skills |
| `sample-skill` / `skill-tester` (alirezarezvani) | alirezarezvani | Meta/utility, low priority |

---

## 3. QUALITY COMPARISON

For items that exist in BOTH the skillpository and imports, here is which version appears more comprehensive.

| Item | Skillpository Quality | Import Quality | Recommendation |
|---|---|---|---|
| **code-reviewer** | Good. Agent + 3 review skills (`code-review`, `code-review-excellence`, `code-review-master`). | claudikins-kernel: SRE-grade with gates, can't bypass. jeffallan/alirezarezvani: Standard. | **Import claudikins** version as `staff-code-reviewer` -- adds gate enforcement. Keep existing for general use. |
| **code-simplifier / deslop** | `deslop` skill exists. Aggressive simplification. | claudikins `cynic`: Changes one-at-a-time, tests after each, reverts if broken. WWBD/BorisWorkflow: Simpler template. | **Import claudikins** `cynic` as upgrade -- test-validated simplification is safer than aggressive deslop. |
| **verify-app / verification** | `verification-before-completion` skill exists. Basic checklist. | claudikins `catastrophiser` + `strict-enforcement`: SHA256 hashing, visual evidence, exit-code-2 gates. | **Import claudikins** version -- quantum leap in verification rigor. |
| **mcp-builder** | Exists. Based on OpenClaw integration. | anthropics-official: Official Anthropic reference. | **Import anthropics** version -- canonical source. Keep both. |
| **tdd / test-driven-development** | `tdd-workflow`, `test-driven-development` skills exist. | ai-dev-toolkit: Integrates with Ralph Loop, circuit breakers, structured status reporting. | **Import ai-dev-toolkit** TDD as `ralph-tdd` -- adds autonomous loop capabilities. |
| **security-auditor / security-review** | `security-auditor` agent + `security-best-practices` + `security-master` skills. | ai-dev-toolkit: Integrates with CI/CD, auto-triggers on sensitive paths, GitHub Actions workflow. | **Comparable.** ai-dev-toolkit version adds CI/CD integration but skillpository has broader coverage. |
| **systematic-debugging** | `systematic-debugging` skill exists. | ai-dev-toolkit: Hypothesis-driven with evidence collection, structured debug protocol. | **Import ai-dev-toolkit** version if more structured; otherwise keep existing. |
| **customer-success-manager** | Agent exists. Basic. | alirezarezvani: Full enterprise CSM with health scoring scripts, churn risk analyzer, expansion opportunity scorer, QBR templates. | **Import alirezarezvani** version -- significantly richer with Python scripts and templates. |
| **ceo-advisor / cto-advisor** | Skills exist. General guidance. | alirezarezvani: Enterprise-grade with references, scripts, decision frameworks. | **Import alirezarezvani** versions as upgrades if more detailed. Compare before replacing. |
| **scrum-master** | Agent exists. Basic. | alirezarezvani: Full sprint ceremonies, velocity tracking, retrospective patterns. | **Import alirezarezvani** version if substantially richer. |
| **product-manager-toolkit** | Skill exists. | alirezarezvani: Full PM toolkit with PRD templates, prioritization frameworks, roadmap planning. | **Compare depth.** Import if alirezarezvani is more comprehensive. |
| **pdf / docx / xlsx / pptx** | Skills exist. | anthropics-official: These ARE the Anthropic reference implementations. Skillpository likely already sourced from these. | **Skip import.** Likely identical source. |

---

## 4. RECOMMENDED IMPORT LIST

Prioritized list of items to move from `imports/` to `E:\GODMODEDEV\skillpository\PENDING\`, organized by import batch.

### Batch 1: Boris Cherny Exclusive Patterns (Highest Value, Most Novel)

These items represent workflow innovations not found anywhere in the skillpository.

| # | Item | Type | Source Path | Target Name |
|---|---|---|---|---|
| 1 | Ralph Loop (autonomous dev loop) | Skill | `boris-cherny-repos/ai-dev-toolkit/.claude/skills/autonomous-loop/` + `ralph-coder/` | `ralph-autonomous-loop` |
| 2 | Gated Pipeline (outline/execute/verify/ship) | Workflow | `boris-cherny-repos/claudikins-kernel/` (full system) | `gated-pipeline-workflow` |
| 3 | Catastrophiser Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/catastrophiser.md` | `catastrophiser` |
| 4 | Cynic Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/cynic.md` | `cynic-simplifier` |
| 5 | Taxonomy-Extremist Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/taxonomy-extremist.md` | `taxonomy-extremist` |
| 6 | BabyClaude (fresh-context implementer) | Agent | `boris-cherny-repos/claudikins-kernel/agents/babyclaude.md` | `fresh-context-implementer` |
| 7 | Spec-Reviewer Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/spec-reviewer.md` | `spec-compliance-reviewer` |
| 8 | Git-Perfectionist Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/git-perfectionist.md` | `git-perfectionist` |
| 9 | Conflict-Resolver Agent | Agent | `boris-cherny-repos/claudikins-kernel/agents/conflict-resolver.md` | `branch-conflict-resolver` |
| 10 | Brain-Jam Planning Skill | Skill | `boris-cherny-repos/claudikins-kernel/skills/brain-jam-plan/` | `brain-jam-planning` |
| 11 | Shipping Methodology Skill | Skill | `boris-cherny-repos/claudikins-kernel/skills/shipping-methodology/` | `shipping-methodology` |
| 12 | Strict Enforcement Skill | Skill | `boris-cherny-repos/claudikins-kernel/skills/strict-enforcement/` | `strict-enforcement` |
| 13 | Git Workflow Skill (claudikins) | Skill | `boris-cherny-repos/claudikins-kernel/skills/git-workflow/` | `sre-git-workflow` |
| 14 | Safety-Net Hooks | Hooks | `boris-cherny-repos/ai-dev-toolkit/.claude/hooks/safety-net.sh` | `safety-net-hooks` |
| 15 | Zeno Analyzer (surgical analysis) | Agent | `boris-cherny-repos/ai-dev-toolkit/.claude/agents/zeno-analyzer.md` | `zeno-analyzer` |
| 16 | Nightly Learning Loop | Doc/Pattern | `boris-cherny-repos/claude-code-tips/NIGHTLY-LEARNING-LOOP.md` | `nightly-learning-loop` |
| 17 | Agent Squad Guide | Doc/Pattern | `boris-cherny-repos/claude-code-tips/AGENT-SQUAD.md` | `agent-squad-guide` |
| 18 | Team Practices Guide | Doc/Pattern | `boris-cherny-repos/claude-code-tips/TEAM-PRACTICES.md` | `team-practices-guide` |
| 19 | Cross-Workflow PR Session Memory | System | `boris-cherny-repos/ai-dev-toolkit/.github/scripts/extract-pr-sessions.py` | `pr-session-memory` |
| 20 | Lobster Workflow Engine | System | `boris-cherny-repos/ai-dev-toolkit/.claude/skills/workflow-orchestration/` | `lobster-workflow-engine` |
| 21 | Setup-Ralph-Loop command | Command | `boris-cherny-repos/BorisWorkflow/commands/setup-ralph-loop.md` | `setup-ralph-loop` |
| 22 | Create-Subagent skill | Skill | `boris-cherny-repos/BorisWorkflow/skills/create-subagent/` | `create-subagent` |

### Batch 2: Levnikolaevich Delivery Pipeline (Largest Single Gap)

Import as a coordinated system, not individual skills. Recommend importing the full pipeline into a `delivery-pipeline/` subdirectory.

| # | Item | Type | Source Path | Target Name |
|---|---|---|---|---|
| 23 | Pipeline Orchestrator | Skill | `github-skills/levnikolaevich-delivery/ln-1000-pipeline-orchestrator/` | `delivery-pipeline-orchestrator` |
| 24 | Scope Decomposition System (7 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-200-*` through `ln-230-*` | `delivery-scope-decomposition` |
| 25 | Task Execution System (8 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-300-*` through `ln-404-*` | `delivery-task-execution` |
| 26 | Quality Gate System (9 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-500-*` through `ln-523-*` | `delivery-quality-gates` |
| 27 | Audit System (27 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-600-*` through `ln-653-*` | `delivery-audit-system` |
| 28 | Project Bootstrap System (28 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-700-*` through `ln-783-*` | `delivery-project-bootstrap` |
| 29 | Documentation Pipeline (10 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-100-*` through `ln-150-*` | `delivery-docs-pipeline` |
| 30 | Research & Standards (4 skills) | Skill Group | `github-skills/levnikolaevich-delivery/ln-001-*` through `ln-004-*` | `delivery-research-standards` |

### Batch 3: Daymade Claude Code Meta-Tooling

| # | Item | Source Path | Target Name |
|---|---|---|---|
| 31 | Claude Code History Files Finder | `github-skills/daymade-marketplace/claude-code-history-files-finder/` | `claude-code-history-finder` |
| 32 | Claude MD Progressive Disclosurer | `github-skills/daymade-marketplace/claude-md-progressive-disclosurer/` | `claude-md-progressive-disclosure` |
| 33 | Claude Skills Troubleshooting | `github-skills/daymade-marketplace/claude-skills-troubleshooting/` | `claude-skills-troubleshooting` |
| 34 | Promptfoo Evaluation | `github-skills/daymade-marketplace/promptfoo-evaluation/` | `promptfoo-evaluation` |
| 35 | Prompt Optimizer | `github-skills/daymade-marketplace/prompt-optimizer/` | `prompt-optimizer` |
| 36 | Repomix Safe Mixer | `github-skills/daymade-marketplace/repomix-safe-mixer/` | `repomix-safe-mixer` |
| 37 | Repomix Unmixer | `github-skills/daymade-marketplace/repomix-unmixer/` | `repomix-unmixer` |
| 38 | CLI Demo Generator | `github-skills/daymade-marketplace/cli-demo-generator/` | `cli-demo-generator` |
| 39 | Fact Checker | `github-skills/daymade-marketplace/fact-checker/` | `fact-checker` |
| 40 | Statusline Generator | `github-skills/daymade-marketplace/statusline-generator/` | `statusline-generator` |
| 41 | Tunnel Doctor | `github-skills/daymade-marketplace/tunnel-doctor/` | `tunnel-doctor` |
| 42 | GitHub Contributor | `github-skills/daymade-marketplace/github-contributor/` | `github-contributor` |
| 43 | GitHub Ops | `github-skills/daymade-marketplace/github-ops/` | `github-ops` |
| 44 | Competitors Analysis | `github-skills/daymade-marketplace/competitors-analysis/` | `competitors-analysis-tool` |

### Batch 4: Enterprise Skills (Alirezarezvani -- Items NOT Already in Skillpository)

| # | Item | Source Path | Target Name |
|---|---|---|---|
| 45 | Atlassian Admin | `github-skills/alirezarezvani-skills/project-management/atlassian-admin/` | `atlassian-admin` |
| 46 | Confluence Expert | `github-skills/alirezarezvani-skills/project-management/confluence-expert/` | `confluence-expert` |
| 47 | Jira Expert | `github-skills/alirezarezvani-skills/project-management/jira-expert/` | `jira-expert` |
| 48 | MS365 Tenant Manager | `github-skills/alirezarezvani-skills/project-management/ms365-tenant-manager/` | `ms365-tenant-manager` |
| 49 | Incident Commander | `github-skills/alirezarezvani-skills/engineering/incident-commander/` | `incident-commander` |
| 50 | Financial Analyst | `github-skills/alirezarezvani-skills/c-level-advisor/financial-analyst/` | `financial-analyst` |
| 51 | Revenue Operations (enterprise) | `github-skills/alirezarezvani-skills/business-growth/revenue-operations/` | `enterprise-revenue-ops` |
| 52 | Tech Stack Evaluator | `github-skills/alirezarezvani-skills/engineering/tech-stack-evaluator/` | `tech-stack-evaluator` |
| 53 | Tech Debt Tracker | `github-skills/alirezarezvani-skills/engineering/tech-debt-tracker/` | `tech-debt-tracker` |
| 54 | Migration Architect | `github-skills/alirezarezvani-skills/engineering/migration-architect/` | `migration-architect` |
| 55 | Dependency Auditor | `github-skills/alirezarezvani-skills/engineering/dependency-auditor/` | `dependency-auditor` |
| 56 | Release Manager | `github-skills/alirezarezvani-skills/engineering/release-manager/` | `release-manager` |
| 57 | Observability Designer | `github-skills/alirezarezvani-skills/engineering/observability-designer/` | `observability-designer` |
| 58 | Social Media Analyzer | `github-skills/alirezarezvani-skills/marketing-skill/social-media-analyzer/` | `social-media-analyzer` |
| 59 | Campaign Analytics | `github-skills/alirezarezvani-skills/marketing-skill/campaign-analytics/` | `campaign-analytics` |
| 60 | App Store Optimization | `github-skills/alirezarezvani-skills/marketing-skill/app-store-optimization/` | `app-store-optimization` |
| 61 | Agent Designer | `github-skills/alirezarezvani-skills/engineering/agent-designer/` | `enterprise-agent-designer` |
| 62 | Interview System Designer | `github-skills/alirezarezvani-skills/engineering/interview-system-designer/` | `interview-system-designer` |
| 63 | API Design Reviewer | `github-skills/alirezarezvani-skills/engineering/api-design-reviewer/` | `api-design-reviewer` |
| 64 | Customer Success Manager (enterprise) | `github-skills/alirezarezvani-skills/business-growth/customer-success-manager/` | `enterprise-csm` |
| 65 | Sales Engineer (enterprise) | `github-skills/alirezarezvani-skills/business-growth/sales-engineer/` | `enterprise-sales-engineer` |

### Batch 5: Jeffallan-66 Unique Items

| # | Item | Source Path | Target Name |
|---|---|---|---|
| 66 | Atlassian MCP | `github-skills/jeffallan-66-skills/skills/atlassian-mcp/` | `atlassian-mcp` |
| 67 | The Fool (adversarial questioner) | `github-skills/jeffallan-66-skills/skills/the-fool/` | `the-fool-adversarial` |
| 68 | Spec Miner | `github-skills/jeffallan-66-skills/skills/spec-miner/` | `spec-miner` |
| 69 | Feature Forge | `github-skills/jeffallan-66-skills/skills/feature-forge/` | `feature-forge` |
| 70 | Fullstack Guardian | `github-skills/jeffallan-66-skills/skills/fullstack-guardian/` | `fullstack-guardian` |
| 71 | Fine-Tuning Expert | `github-skills/jeffallan-66-skills/skills/fine-tuning-expert/` | `fine-tuning-expert` |
| 72 | ML Pipeline | `github-skills/jeffallan-66-skills/skills/ml-pipeline/` | `ml-pipeline-design` |
| 73 | Monitoring Expert | `github-skills/jeffallan-66-skills/skills/monitoring-expert/` | `monitoring-expert` |
| 74 | NestJS Expert | `github-skills/jeffallan-66-skills/skills/nestjs-expert/` | `nestjs-expert` |
| 75 | Pandas Pro | `github-skills/jeffallan-66-skills/skills/pandas-pro/` | `pandas-pro` |
| 76 | React Native Expert | `github-skills/jeffallan-66-skills/skills/react-native-expert/` | `react-native-expert` |
| 77 | Salesforce Developer | `github-skills/jeffallan-66-skills/skills/salesforce-developer/` | `salesforce-developer` |
| 78 | Shopify Expert | `github-skills/jeffallan-66-skills/skills/shopify-expert/` | `shopify-expert` |
| 79 | WordPress Pro | `github-skills/jeffallan-66-skills/skills/wordpress-pro/` | `wordpress-pro-enhanced` |

### Batch 6: Daymade Remaining Practical Skills

| # | Item | Source Path | Target Name |
|---|---|---|---|
| 80 | Cloudflare Troubleshooting | `github-skills/daymade-marketplace/cloudflare-troubleshooting/` | `cloudflare-troubleshooting` |
| 81 | i18n Expert | `github-skills/daymade-marketplace/i18n-expert/` | `i18n-expert` |
| 82 | iOS APP Developer | `github-skills/daymade-marketplace/iOS-APP-developer/` | `ios-app-developer` |
| 83 | Docs Cleaner | `github-skills/daymade-marketplace/docs-cleaner/` | `docs-cleaner` |
| 84 | Markdown Tools | `github-skills/daymade-marketplace/markdown-tools/` | `markdown-tools` |
| 85 | Mermaid Tools | `github-skills/daymade-marketplace/mermaid-tools/` | `mermaid-tools` |
| 86 | Meeting Minutes Taker | `github-skills/daymade-marketplace/meeting-minutes-taker/` | `meeting-minutes-taker` |
| 87 | PDF Creator | `github-skills/daymade-marketplace/pdf-creator/` | `pdf-creator` |
| 88 | PPT Creator | `github-skills/daymade-marketplace/ppt-creator/` | `ppt-creator` |
| 89 | Teams Channel Post Writer | `github-skills/daymade-marketplace/teams-channel-post-writer/` | `teams-channel-post-writer` |
| 90 | Transcript Fixer | `github-skills/daymade-marketplace/transcript-fixer/` | `transcript-fixer` |
| 91 | Video Comparer | `github-skills/daymade-marketplace/video-comparer/` | `video-comparer` |
| 92 | Twitter Reader | `github-skills/daymade-marketplace/twitter-reader/` | `twitter-reader` |
| 93 | YouTube Downloader | `github-skills/daymade-marketplace/youtube-downloader/` | `youtube-downloader` |
| 94 | Windows RDP Doctor | `github-skills/daymade-marketplace/windows-remote-desktop-connection-doctor/` | `windows-rdp-doctor` |

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Total items across all sources** | 1,656 |
| **Duplicates identified** | ~75 (exact + functional) |
| **Unique items to import** | ~94 (Batch 1-6 above) |
| **Items to skip (true duplicates)** | ~121 (remaining imports after unique extraction) |
| **Net new items for skillpository** | ~94 skills/agents + 103 delivery pipeline skills = ~197 |
| **Projected skillpository size after import** | ~1,341 items (1,144 + 197) |

### Priority Ranking

1. **Batch 1 (Boris Cherny):** 22 items -- Most novel, highest impact. Workflow patterns, SRE-grade agents, and autonomous loops that fundamentally change how Claude Code operates.
2. **Batch 2 (Levnikolaevich):** 103 items (7 groups) -- Largest single gap. Complete delivery pipeline system with no equivalent in skillpository.
3. **Batch 3 (Daymade Meta-Tooling):** 14 items -- Claude Code-specific tooling for debugging skills, managing context, and prompt optimization.
4. **Batch 4 (Enterprise):** 21 items -- Enterprise/business skills filling Atlassian, finance, and growth gaps.
5. **Batch 5 (Jeffallan Unique):** 14 items -- Platform-specific and adversarial testing patterns.
6. **Batch 6 (Daymade Practical):** 15 items -- Practical utilities for day-to-day operations.

---

*Generated by Claude Code analysis of E:\GODMODEDEV\skillpository, E:\GODMODEDEV\imports\github-skills, and E:\GODMODEDEV\imports\boris-cherny-repos*
