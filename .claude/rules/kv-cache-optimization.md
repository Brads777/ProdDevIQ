# KV-Cache & Context Optimization

## Append-Only Context Management

- Maintain **stable prompt prefixes** — even a single-token variation invalidates the entire KV-cache
- Never modify previous actions or observations in context
- Avoid non-deterministic serialization (e.g., random JSON key ordering)
- Context management should be strictly **append-only**

## File System as Context

- Do NOT "stuff" large data into the context window
- Store large data objects (web pages, multi-thousand-line files, logs) as files on disk
- Reference them via paths in context — let agents read only what they need
- This mimics how human developers use reference materials

## Compound Engineering

Every unit of work performed should not only achieve the immediate task but also:
- Accumulate context for future tasks
- Refine tools and patterns
- Codify knowledge into reusable skills and CLAUDE.md entries

## Context Preservation

- Delegate verbose operations to subagents (test output stays in subagent context)
- Use `/compact` proactively when context exceeds 50% capacity
- Move repeatedly-referenced facts into CLAUDE.md or Auto Memory
- Resume subagents instead of starting fresh to retain conversation history
