---
name: engram-memory
description: >
  Bitemporal graph memory system for AI coding agents. Captures reasoning
  traces from Claude Code into a knowledge graph with temporal history.
  Based on rawcontext/engram. Trigger on /engram.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---
# ©2026 Brad Scheller

# Engram — Graph Memory for Coding Agents

**Source:** [github.com/rawcontext/engram](https://github.com/rawcontext/engram)
**Related:** [ngrm.ai](https://www.ngrm.ai/) (structured memory platform), [arxiv.org/abs/2511.12960](https://arxiv.org/abs/2511.12960) (academic ENGRAM)

**Purpose:** Capture reasoning traces from Claude Code sessions into a persistent knowledge graph with bitemporal history. Enables agents to recall past decisions, understand why code was written a certain way, and learn from prior debugging sessions.

## Trigger Commands

- `/engram` — Show memory status and recent traces
- `/engram capture` — Capture reasoning from current session
- `/engram recall "<query>"` — Search memory graph for relevant context
- `/engram timeline "<entity>"` — Show temporal history of an entity

## Architecture

```
Claude Code Session
    │
    ▼ reasoning traces
    │
┌───────────────┐
│  Engram Core  │
├───────────────┤
│ FalkorDB      │ ← Graph storage (entities, relationships)
│ Qdrant        │ ← Vector embeddings (semantic search)
│ NATS+JetStream│ ← Event streaming (real-time capture)
│ PostgreSQL    │ ← Metadata, API keys, audit log
└───────────────┘
```

## Bitemporal Model

Every memory record has two time dimensions:
- **Valid Time** (`vt_start`, `vt_end`) — When the fact was true in reality
- **Transaction Time** (`tt_start`, `tt_end`) — When the fact was recorded

This enables time-travel queries: "What did we know about X at time T?"

## Memory Types

| Type | Description | Example |
|------|-------------|---------|
| Episodic | Session events, debugging steps | "Fixed auth bug by checking token expiry" |
| Semantic | Project facts, architecture decisions | "Uses repository pattern for data access" |
| Procedural | How-to knowledge, workflows | "Deploy sequence: build → test → push → deploy" |

## Integration with ECC

Engram serves as the persistent storage backend for ECC's instinct accumulation:
- `/learn` extracts instincts → stored as semantic memory in Engram
- `/engram recall` retrieves relevant instincts → used by `/learn apply`
- Cross-session, cross-project knowledge graph

## Docker Setup

```yaml
services:
  falkordb:
    image: falkordb/falkordb:latest
    ports: ["6379:6379"]
  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]
  nats:
    image: nats:latest
    ports: ["4222:4222"]
  engram:
    image: rawcontext/engram:latest
    depends_on: [falkordb, qdrant, nats]
    ports: ["8080:8080"]
```

## Use Cases

- Recall why an architectural decision was made 3 months ago
- Find all debugging sessions related to a specific module
- Understand the evolution of a codebase's patterns over time
- Share knowledge between team members through the graph
