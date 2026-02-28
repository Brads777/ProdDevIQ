# Context Hygiene & Delegation Patterns

## Delegation Rules

- Maximum **2 levels** of delegation depth (caller -> specialist, never deeper)
- **Never pass full file contents** in agent prompts — let agents read files themselves
- **Omit `tools` field entirely** in Task tool calls to inherit MCP tools
- **Critical instructions go FIRST** in agent prompts

## Batch Sizing

| Complexity | Tasks per Agent |
|-----------|----------------|
| Complex (research, multi-step) | 3-5 |
| Standard (audits, updates) | 5-8 |
| Simple (formatting, checks) | 8-12 |

**Maximum parallel agents:** 4

## Context Budget

- Keep main context under 50 lines per workflow step
- Delegate verbose operations (test output, log analysis, doc generation) to subagents
- Use `/compact` proactively when context exceeds 50% capacity
- Resume subagents instead of starting fresh when possible
