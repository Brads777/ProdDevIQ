# Agent Template Design Conventions

## Frontmatter Requirements

Every agent `.md` file in `.claude/agents/` must include:
- `name`: lowercase-hyphenated identifier
- `description`: when Claude should delegate to this agent
- `model`: explicit model (sonnet, haiku, opus, or inherit)

Optional but recommended:
- `tools` or `disallowedTools`: tool access control
- `memory`: user | project | local (for persistent cross-session knowledge)
- `permissionMode`: default | acceptEdits | delegate | plan | dontAsk | bypassPermissions
- `skills`: list of skills to preload
- `maxTurns`: cap on agentic turns

## Tool Restrictions

- **No Bash for file creators**: coder, architect, documenter use `disallowedTools: Bash`
- **Haiku for deploy-runner only**: all other agents use sonnet or inherit
- **Reviewer/security-auditor**: Bash restricted to git commands and audit tools only

## System Prompt Structure

1. CRITICAL CONSTRAINTS section first (most important instructions)
2. Role description
3. Process / workflow steps
4. Output format template
