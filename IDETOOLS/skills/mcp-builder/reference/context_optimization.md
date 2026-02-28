# ©2026 Brad Scheller

# Context Window Optimization for MCP Servers

## Overview

The #1 operational problem with MCP servers in 2026 is context bloat. Every connected MCP server injects its tool definitions into the LLM's context window before any work begins. This guide covers how to design, build, and deploy MCP servers that minimize context consumption.

## The Problem: Context Bloat by the Numbers

Real-world measurements:

| Scenario | Token Overhead | % of 200K Window |
|----------|---------------|-------------------|
| 4 MCP servers (Playwright, GitHub, IDE) | ~67,000 tokens | 33% |
| 5 servers × 30 tools each | 30,000-60,000 tokens | 15-30% |
| 20 tools (moderate setup) | ~14,000 tokens | 7% |

Effects of context bloat:

- **2-3x cost increase** — paying for tool definitions as input tokens every turn
- **Degraded reasoning quality** — less space for actual task context
- **Slower responses** — more tokens to process per turn
- **Tool selection misfires** — similar names like `get_status`/`fetch_status`/`query_status` confuse models
- **Platform limits hit** — Cursor ~80 tools, OpenAI 128, Claude 120

## Strategy 1: Code Mode (Most Impactful)

Instead of injecting tool definitions into context, present MCP tools as importable code libraries. The agent writes a script to call tools dynamically.

### How It Works

Traditional approach (high token cost):

```
System prompt includes:
- Tool: github_search_issues (description: 200 tokens, schema: 300 tokens)
- Tool: github_create_issue (description: 150 tokens, schema: 400 tokens)
- Tool: github_list_repos (description: 180 tokens, schema: 250 tokens)
... × 30 tools = ~15,000 tokens
```

Code Mode approach (low token cost):

```
System prompt includes:
- You have access to MCP tools via code. Use `import { github } from "mcp-tools"` to access GitHub operations.
... = ~100 tokens
```

The agent then writes:

```typescript
import { github } from "mcp-tools";
const issues = await github.search_issues({ query: "bug", state: "open" });
const repos = await github.list_repos({ org: "my-org" });
```

### Impact

- **Token reduction:** 90-98% (e.g., 150,000 tokens → 2,000)
- **Supported by:** Bifrost gateway natively
- **Trade-off:** requires models that are good at code generation (Claude, GPT-4 are fine)

### Designing Your Server for Code Mode

When building your MCP server, ensure:

1. **Tool names follow a consistent, predictable pattern** — agents need to guess names
2. **Input schemas match common programming conventions** — standard param names
3. **Tool descriptions are available via a help/discovery tool** — not baked into context
4. **Error messages include correct usage examples** — guide the agent when it guesses wrong

Example error response:

```json
{
  "error": "Unknown tool 'search_issue'. Did you mean 'github_search_issues'?",
  "usage": "github_search_issues({ query: string, state?: 'open' | 'closed' })"
}
```

## Strategy 2: Tool Description Optimization

Every token in a tool description costs money on every inference turn.

### Before (Verbose) — ~45 tokens per tool

```json
{
  "name": "github_search_issues",
  "description": "This tool allows you to search for issues across all repositories in a GitHub organization. It supports filtering by state (open, closed, all), labels, assignees, and milestone. Results are returned in paginated format with a default page size of 30 items."
}
```

### After (Concise) — ~18 tokens per tool

```json
{
  "name": "github_search_issues",
  "description": "Search GitHub issues. Filters: state, labels, assignee, milestone. Paginated (default 30)."
}
```

### Rules for Token-Efficient Descriptions

1. **One sentence max** for the summary
2. **Use comma-separated lists** for parameters instead of prose
3. **Omit obvious information** — don't say "returns results"
4. **Put detailed docs in a separate help tool or resource**, not in the description
5. **Target: under 100 tokens per tool description**
6. **Measure: count tokens** with tiktoken or Anthropic's tokenizer

### Measuring Your Server's Context Footprint

Calculate total token overhead:

```python
import tiktoken
import json

def measure_tool_footprint(tools: list[dict]) -> dict:
    """Calculate token overhead of tool definitions."""
    enc = tiktoken.encoding_for_model("gpt-4")  # rough proxy
    total = 0
    per_tool = {}

    for tool in tools:
        # Serialize the full tool definition as it appears in context
        text = f"{tool['name']}: {tool.get('description', '')} {json.dumps(tool.get('inputSchema', {}))}"
        tokens = len(enc.encode(text))
        per_tool[tool['name']] = tokens
        total += tokens

    return {
        "total_tokens": total,
        "per_tool": per_tool,
        "tool_count": len(tools),
        "avg_tokens_per_tool": total / len(tools) if tools else 0
    }

# Usage
tools = [
    {
        "name": "github_search_issues",
        "description": "Search GitHub issues. Filters: state, labels, assignee, milestone.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "state": {"type": "string", "enum": ["open", "closed", "all"]}
            },
            "required": ["query"]
        }
    }
]

footprint = measure_tool_footprint(tools)
print(f"Total tokens: {footprint['total_tokens']}")
print(f"Average per tool: {footprint['avg_tokens_per_tool']:.1f}")
```

## Strategy 3: Tool Consolidation

Merge similar tools into single parameterized functions.

### Before: 3 separate search tools (~600 tokens total)

```python
@mcp.tool()
async def tavily_search(query: str) -> str:
    """Search using Tavily API."""
    ...

@mcp.tool()
async def brave_search(query: str) -> str:
    """Search using Brave API."""
    ...

@mcp.tool()
async def google_search(query: str) -> str:
    """Search using Google API."""
    ...
```

### After: 1 consolidated tool (~200 tokens)

```python
from enum import Enum
from pydantic import BaseModel

class SearchProvider(str, Enum):
    TAVILY = "tavily"
    BRAVE = "brave"
    GOOGLE = "google"

@mcp.tool()
async def web_search(
    query: str,
    provider: SearchProvider = SearchProvider.TAVILY
) -> str:
    """Search the web. Providers: tavily (default), brave, google."""
    handlers = {
        SearchProvider.TAVILY: _tavily_search,
        SearchProvider.BRAVE: _brave_search,
        SearchProvider.GOOGLE: _google_search,
    }
    return await handlers[provider](query)
```

### When to Consolidate

- **Multiple tools doing the same action on different providers** → consolidate with `provider` param
- **CRUD operations on the same resource** → consolidate with `action` param
- **Tools that differ only by a filter** → consolidate with filter param
- **Result:** up to 60% reduction in tool definition overhead

### When NOT to Consolidate

- Tools with fundamentally different input schemas
- Tools with different security levels (read vs write)
- Tools where the model needs to clearly distinguish behavior

## Strategy 4: RAG-MCP (Vector-Based Tool Selection)

For very large tool catalogs (50+), use vector retrieval to select relevant tools.

### How It Works

1. Embed all tool descriptions into a vector store
2. When a user query arrives, embed the query
3. Retrieve top-K most relevant tools (K=5-10)
4. Only inject those tool definitions into the context
5. **Result:** 50%+ token reduction, 200% better tool selection accuracy

### Implementation Pattern

```python
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class ToolSelector:
    """Vector-based tool selector for large MCP servers."""

    def __init__(self, tools: list[dict]):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.tools = tools

        # Build index from tool descriptions
        descriptions = [f"{t['name']}: {t['description']}" for t in tools]
        embeddings = self.model.encode(descriptions)

        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)

    def select_tools(self, query: str, top_k: int = 5) -> list[dict]:
        """Return top-K most relevant tools for the query."""
        query_embedding = self.model.encode([query])
        faiss.normalize_L2(query_embedding)
        scores, indices = self.index.search(query_embedding, top_k)
        return [self.tools[i] for i in indices[0]]

# Usage in MCP server
selector = ToolSelector(all_tools)

@server.list_tools()
async def handle_list_tools(context: str = "") -> list[types.Tool]:
    """Return only relevant tools based on conversation context."""
    if not context:
        # No context yet, return a minimal set
        return get_core_tools()

    # Select relevant tools
    relevant = selector.select_tools(context, top_k=10)
    return [tool_to_mcp_format(t) for t in relevant]
```

### Trade-offs

- **Requires an embedding model** — adds latency on first call (~50-200ms)
- **May miss relevant tools** if descriptions don't match query semantics
- **Best for:** servers with 50+ tools where loading all would exceed context limits
- **Not needed for:** servers with <20 tools

## Strategy 5: Claude Code Tool Search

Claude Code has a built-in tool search feature that defers loading MCP tools.

### How It Works

- Instead of injecting all tool definitions upfront, Claude Code uses a search-based approach
- Agent reasons about what tools it needs, then searches for them
- Only matched tools are loaded into context
- **Result:** 47-85% token reduction (51K → 8.5K in benchmarks)

### Making Your Server Compatible

Ensure your tools are discoverable by Claude Code's search:

1. **Use descriptive, keyword-rich tool names** — `github_search_issues` not `gh_si`
2. **Include key terms in descriptions** that users would search for
3. **Add tool annotations with clear titles** — MCP supports title field
4. **Group related tools with consistent prefixes** — `github_*`, `slack_*`

Example:

```python
@mcp.tool()
async def github_search_issues(query: str, state: str = "open") -> str:
    """
    Search GitHub issues and pull requests.

    Keywords: bug, feature, ticket, task, PR, issue tracking
    """
    ...
```

## Strategy 6: Sub-Agent Routing

Instead of one agent with 150 tools, route work through focused sub-agents.

### Pattern

```
Main Agent (coordinator — minimal tools)
├→ GitHub Agent (only github_* tools loaded)
├→ Database Agent (only db_* tools loaded)
├→ Slack Agent (only slack_* tools loaded)
└→ Analytics Agent (only analytics_* tools loaded)
```

### Benefits

- Each sub-agent's context is lean (5-10 tools, not 150)
- Tool selection accuracy improves dramatically
- Cost is lower per sub-agent (smaller context)
- Parallelize: multiple sub-agents can run simultaneously

### Implementation

```python
# Coordinator delegates to focused sub-agents
async def handle_task(task: str):
    """Route to appropriate sub-agent based on task type."""

    if needs_github(task):
        return await delegate_to("github-agent", task)
    elif needs_database(task):
        return await delegate_to("database-agent", task)
    elif needs_slack(task):
        return await delegate_to("slack-agent", task)
    else:
        # Fallback to general-purpose agent
        return await delegate_to("general-agent", task)

def needs_github(task: str) -> bool:
    """Check if task requires GitHub tools."""
    keywords = ["github", "repo", "issue", "pr", "pull request", "commit"]
    return any(kw in task.lower() for kw in keywords)
```

## Strategy 7: Tool Groups / Workflow Bundling

Bundle tools by workflow to limit exposure per task.

### Lunar MCPX Pattern

Define named tool groups:

```yaml
tool_groups:
  development:
    - github_*
    - jira_*
    - ci_*
  marketing:
    - salesforce_*
    - slack_*
    - cms_*
  admin:
    - user_management_*
    - billing_*
    - audit_*
```

Agent activates a group at task start. Only those tools enter context.

Implementation:

```python
class ToolGroupManager:
    """Manage tool groups for workflow-based filtering."""

    def __init__(self, all_tools: list[dict], groups: dict[str, list[str]]):
        self.all_tools = all_tools
        self.groups = groups

    def get_tools_for_workflow(self, workflow: str) -> list[dict]:
        """Return only tools relevant to the specified workflow."""
        if workflow not in self.groups:
            return self.all_tools  # Fallback to all

        patterns = self.groups[workflow]
        selected = []

        for tool in self.all_tools:
            for pattern in patterns:
                if self._matches_pattern(tool['name'], pattern):
                    selected.append(tool)
                    break

        return selected

    def _matches_pattern(self, name: str, pattern: str) -> bool:
        """Check if tool name matches glob pattern."""
        if pattern.endswith('*'):
            prefix = pattern[:-1]
            return name.startswith(prefix)
        return name == pattern
```

## Optimization Checklist

| Check | Target | How to Measure |
|-------|--------|---------------|
| Tool description tokens | <100 per tool | tiktoken count |
| Total server footprint | <5,000 tokens | sum all tool defs |
| Consolidation opportunities | 0 duplicate tools | manual audit |
| Gateway enabled | Yes for 4+ servers | config check |
| Code Mode available | Yes if supported | gateway feature flag |
| Cache hit rate | >30% | gateway metrics |
| Sub-agent routing | Yes for 20+ tools | architecture review |

## Context Budget Planning Template

When designing a new MCP server, plan your token budget:

```
Available context: 200,000 tokens
├── System prompt:     ~2,000 tokens (1%)
├── Tool definitions:  ~5,000 tokens (2.5%) ← YOUR BUDGET
├── Conversation:      ~50,000 tokens (25%)
├── File contents:     ~100,000 tokens (50%)
└── Reasoning buffer:  ~43,000 tokens (21.5%)

Your server gets 5,000 tokens for ALL tool definitions.
At ~200 tokens per tool, that's 25 tools max.
At ~100 tokens per tool (optimized), that's 50 tools max.
```

## Real-World Example: Optimizing a GitHub MCP Server

### Before Optimization

```python
# 30 tools, verbose descriptions
@mcp.tool()
async def search_issues(query: str, state: str, labels: list[str], assignee: str) -> str:
    """
    This tool allows you to search for issues in GitHub repositories.
    You can filter by state (open, closed, or all), apply multiple labels,
    and specify an assignee. Results are returned in JSON format.
    """
    ...

# Total footprint: ~18,000 tokens (30 tools × ~600 tokens each)
```

### After Optimization

```python
# 12 consolidated tools, concise descriptions
from enum import Enum

class IssueState(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    ALL = "all"

@mcp.tool()
async def issues(
    action: str,  # search, create, update, close
    query: str = "",
    state: IssueState = IssueState.OPEN,
    labels: list[str] = None,
    assignee: str = None
) -> str:
    """GitHub issues. Actions: search, create, update, close. Filters: state, labels, assignee."""
    ...

# Total footprint: ~3,600 tokens (12 tools × ~300 tokens each)
# Reduction: 80% (18,000 → 3,600)
```

### Additional Optimizations Applied

1. **Consolidated 30 tools → 12 tools** by grouping CRUD operations
2. **Reduced description length by 70%** — removed prose, used comma lists
3. **Used enums for common parameters** — reduces schema token count
4. **Added a discovery tool** — `github_help()` returns full docs, not in context

Result: **80% token reduction** while maintaining full functionality.

## Monitoring and Metrics

Track these metrics for your MCP server:

```python
import time
from collections import defaultdict

class MCPMetrics:
    """Track context optimization metrics."""

    def __init__(self):
        self.tool_calls = defaultdict(int)
        self.token_overhead = 0
        self.cache_hits = 0
        self.cache_misses = 0

    def record_tool_call(self, tool_name: str):
        """Track which tools are actually used."""
        self.tool_calls[tool_name] += 1

    def record_context_load(self, tokens: int):
        """Track token overhead per request."""
        self.token_overhead = tokens

    def get_utilization_report(self) -> dict:
        """Return tool utilization statistics."""
        total_calls = sum(self.tool_calls.values())
        return {
            "total_calls": total_calls,
            "unique_tools_used": len(self.tool_calls),
            "most_used": sorted(
                self.tool_calls.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10],
            "avg_token_overhead": self.token_overhead,
            "cache_hit_rate": self.cache_hits / (self.cache_hits + self.cache_misses)
        }
```

### Key Metrics to Track

- **Tool utilization rate** — % of tools actually used vs exposed
- **Average tokens per request** — measure context bloat
- **Cache hit rate** — higher is better (means stable tool sets)
- **Tool selection accuracy** — did the agent pick the right tool?

## Summary: Decision Tree

```
How many tools does your server expose?
│
├─ <10 tools → Strategy 2 (optimize descriptions)
│
├─ 10-25 tools → Strategy 2 + 3 (optimize + consolidate)
│
├─ 25-50 tools → Strategy 2 + 3 + 5 (add Claude Code search)
│
└─ 50+ tools → Strategy 1 or 4 or 6 (Code Mode, RAG, or sub-agents)

Are you using 4+ MCP servers simultaneously?
├─ Yes → Strategy 1 (Code Mode via gateway) or Strategy 6 (sub-agents)
└─ No → Focus on per-server optimization (Strategies 2-5)
```

## Further Reading

- MCP Specification: https://spec.modelcontextprotocol.io/
- Bifrost Gateway (Code Mode): https://github.com/lunarbase-ai/bifrost
- Claude Code Tool Search: https://docs.anthropic.com/claude-code/tools
- Token counting (tiktoken): https://github.com/openai/tiktoken
