---
name: nanobot-mcp
description: >
  Turn any MCP server into a full-featured AI agent. Standalone MCP host
  that wraps MCP servers with reasoning, system prompts, and tool orchestration.
  Based on nanobot.ai. Trigger on /nanobot.
allowed-tools: Read, Write, Edit, Bash
---
# ©2026 Brad Scheller

# Nanobot — MCP Server to Agent Framework

**Source:** [nanobot.ai](https://www.nanobot.ai/) | [github.com/nanobot-ai/nanobot](https://github.com/nanobot-ai/nanobot)
**Related:** [HKUDS/nanobot](https://github.com/HKUDS/nanobot) (ultra-lightweight personal AI assistant, ~4K lines Python)

**Purpose:** Convert any MCP server into a full-featured AI agent with reasoning, system prompts, tool orchestration, and rich MCP-UI — without embedding it in another application.

## Trigger Commands

- `/nanobot` — Show available MCP servers and agent status
- `/nanobot wrap "<mcp-server>"` — Create an agent wrapper for an MCP server
- `/nanobot deploy` — Deploy a nanobot agent

## Architecture

```
MCP Server (any)
    │
    ▼
┌──────────────┐
│   Nanobot    │
├──────────────┤
│ Reasoning    │ ← LLM-powered decision making
│ System Prompt│ ← Agent persona and constraints
│ Tool Orch.   │ ← MCP tool selection and chaining
│ MCP-UI       │ ← Rich interaction interface
└──────────────┘
    │
    ▼
User / Other Agents
```

## Use Cases

| Scenario | Description |
|----------|-------------|
| Database agent | Wrap postgres MCP → agent that can query, explain, optimize |
| File system agent | Wrap filesystem MCP → agent that organizes, searches, cleans |
| GitHub agent | Wrap GitHub MCP → agent that manages PRs, issues, releases |
| Custom API agent | Wrap any REST API MCP → intelligent API consumer |

## Creating a Nanobot Agent

```yaml
# nanobot.yaml
name: my-database-agent
description: Intelligent database assistant
mcp_server: postgres
system_prompt: |
  You are a database expert. Help users query, understand,
  and optimize their PostgreSQL databases. Always explain
  query plans before executing.
tools:
  - query
  - explain
  - suggest_index
constraints:
  - Never execute DROP or TRUNCATE without confirmation
  - Always EXPLAIN before executing complex queries
```

## Integration

- Complements `claudekit-mcp-management` for MCP server lifecycle
- Works alongside `unified-orchestrator` for multi-agent coordination
- Agents created with nanobot can be registered in the skillpository
