---
name: ai-coding-practices
description: >-
  10 production-tested AI coding practices covering context-first workflow,
  strict TypeScript, test integrity, git worktrees, adversarial verification,
  and context window management. Use when setting up a new project for
  AI-assisted development or onboarding agents to coding standards.
---
# ©2026 Brad Scheller

# AI Coding Practices

10 production-tested practices for AI-assisted development. Apply these when setting up a new project, onboarding agents to coding standards, or improving an existing AI-assisted workflow.

## Practice 1: Context-First Workflow

Before writing any code, ensure these documents exist in `docs/`:

- **`PRD.md`** — Project requirements and scope
- **`architecture.md`** — Data models, file structure, APIs, architecture details
- **`decision.md`** — Decisions made during project creation (reference for future sessions)
- **`features.json`** — All features in token-efficient JSON with completion criteria and pass/fail tracking

If any are missing, generate them before proceeding with implementation. Use the template in `references/context-generation-prompt.md` to create them. Example docs templates are in `references/` (architecture.md, decision.md, features.json, PRD.md).

## Practice 2: Strict TypeScript

- TypeScript projects MUST have `strict: true` in `tsconfig.json`
- Rely on compiler errors, not runtime failures
- Never suppress type errors with `any` unless explicitly approved by the user
- A reference `tsconfig.strict.json` with all strict flags enabled is in `assets/`

## Practice 3: Test Integrity

- NEVER modify files in `tests/`, `__tests__/`, `*.test.*`, or `*.spec.*` directories
- If tests fail, fix the implementation — not the tests
- Enforce with a Claude Code hook (see `scripts/claude-protect-env.sh` for the pattern)

## Practice 4: Git Discipline with Worktrees

- All work must be tracked in version control
- For multi-feature work, use **git worktrees** — not branches in the same working directory
- Each parallel agent gets its own worktree to avoid file conflicts
- Merge worktree outputs only after all features pass their criteria

Setup and cleanup scripts are in `scripts/worktree-setup.sh` and `scripts/worktree-cleanup.sh`. See `references/worktree-parallel-prompt.md` for the full parallel implementation pattern.

## Practice 5: Adversarial Verification

For research or complex implementation tasks, use two agents:

1. **Executor agent** — Performs the task (research, implementation, etc.)
2. **Verifier agent** — Fact-checks, reviews, or tests the executor's output

The verifier is blocked until the executor produces a first draft. They iterate until accuracy is confirmed.

See `references/adversarial-agents-prompt.md` for reusable executor + verifier prompts for both research and development tasks.

## Practice 6: Context Window Management

- Enable MCP Tool Search via `ENABLE_TOOL_SEARCH=true` in `.claude/settings.json` under the `env` key
- This prevents all MCP tool schemas from loading upfront — tools are discovered on-demand
- Accepted values: `"true"` (always on), `"auto"` (activates when MCPs exceed 10% of context), `"auto:N"` (custom threshold)
- Prefer Agent Browser over Chrome extension for UI verification (200-400 tokens vs full DOM)

## Practice 7: Verification Protocol

Before marking any feature complete, verify using available tools in priority order:

1. **Agent Browser CLI** (preferred) — Uses accessibility tree, context-efficient (~200-400 tokens)
2. **Puppeteer MCP** — Isolated browser, no session interference
3. **Claude Chrome Extension** — Fallback only, heavy on context
4. If none available, use terminal-based verification (curl, test scripts, etc.)

## Practice 8: Reverse Prompting (Pre-Deployment)

After implementation and testing pass, run a reverse-prompting audit:

- Review the implementation and identify areas where the app could fail
- Pattern-match against common failure modes from similar applications
- Look at the code from a different angle than the one used during implementation
- Document findings and fix critical issues before marking done

See `references/reverse-prompt.md` for the full audit prompt template.

## Practice 9: Scenario-Based Testing

- User stories live in `user-stories/` and must be written BEFORE implementation
- Each story covers: feature aspect, priority, acceptance criteria, optimal path, and edge cases
- Implementation follows stories one by one, starting with the optimal path
- All edge cases in the story must be covered before a feature is marked complete

See `references/user-story-template.md` for the story template and implementation workflow.

## Practice 10: Documentation via Context7 MCP

- When implementing features that depend on external libraries/frameworks, use Context7 MCP to fetch the latest documentation
- Do NOT rely solely on training data for library APIs — always verify with Context7
- This prevents errors from dependency mismatches and outdated API usage

## Multi-Agent Rules

- Do NOT poll the task list indefinitely. If no progress after 3 checks, take action or report the blocker.
- When using parallel agents, assign each agent a clear isolated scope (separate files/directories/worktrees).
- Always prefer worktrees over branches for parallel agent work.

## Hooks Configuration

Two protective hooks are recommended:

- **Test protection** — Blocks modifications to test files (enforces Practice 3)
- **Env protection** (`scripts/claude-protect-env.sh`) — Blocks modifications to `.env`, secrets, and key files

Exit code reference: 0 = success (proceed), 2 = blocking error (stop and correct).

## Insights Feedback Loop

Use Claude Code's `/insights` command to analyze past sessions, then:

1. **Diagnose** friction points and failure patterns
2. **Create rules** to prevent recurrence
3. **Add to CLAUDE.md** so rules apply to all future sessions
4. **Verify** in the next session

See `references/insights-workflow.md` for the full workflow.

## Quick Setup

1. Run `scripts/verify-setup.sh` to check your environment
2. Generate context docs using `references/context-generation-prompt.md`
3. Copy `assets/tsconfig.strict.json` to your project
4. Configure hooks in `.claude/settings.json`
5. Start implementing features using the practices above
