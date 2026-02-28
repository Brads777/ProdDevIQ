# ©2026 Brad Scheller

# Payment & Token Metering for MCP Servers

## Overview

Two cost dimensions when running MCP servers at scale:

1. **LLM token costs** — Context bloat from tool definitions + inference
2. **Service costs** — Paying for the SaaS APIs your MCP servers connect to

This guide covers both: reducing token overhead, implementing financial guardrails, and managing payments for third-party services and your own MCP server offerings.

## 1. Reducing Token Costs

### Code Mode (Import Tools as Libraries)

Instead of dumping all tool definitions into context, present MCP tools as importable code libraries. The agent writes a script to call tools dynamically.

**Impact:** 90-98% token reduction (e.g., 150,000 tokens → 2,000)

**How it works:** Bifrost gateway supports this natively. Agent writes TypeScript/Python to call tools instead of having definitions injected into every request.

**Conceptual example** of agent-generated code:

```typescript
import { github } from "mcp-tools";

const issues = await github.search_issues({
  query: "bug",
  state: "open",
  labels: ["priority-high"]
});

for (const issue of issues) {
  console.log(`#${issue.number}: ${issue.title}`);
}
```

**Python equivalent:**

```python
from mcp_tools import github

issues = github.search_issues(
    query="bug",
    state="open",
    labels=["priority-high"]
)

for issue in issues:
    print(f"#{issue['number']}: {issue['title']}")
```

Instead of 150+ tool schemas in context, the agent imports a typed library and writes code. The gateway intercepts function calls and routes them to the appropriate MCP server.

### Tool Consolidation

Merge similar tools into parameterized functions to reduce tool definition overhead.

**BAD:** Three separate tools (3 tools, ~600 tokens)

```python
# Three separate tool definitions
@mcp_tool
async def tavily_search(query: str, max_results: int = 10):
    """Search the web using Tavily API."""
    ...

@mcp_tool
async def brave_search(query: str, max_results: int = 10):
    """Search the web using Brave Search API."""
    ...

@mcp_tool
async def google_search(query: str, max_results: int = 10):
    """Search the web using Google Custom Search."""
    ...
```

**GOOD:** Single consolidated tool (1 tool, ~200 tokens)

```python
from typing import Literal

@mcp_tool
async def web_search(
    query: str,
    provider: Literal["tavily", "brave", "google"] = "tavily",
    max_results: int = 10
):
    """Search web. Providers: tavily (default), brave, google."""
    if provider == "tavily":
        return await tavily_client.search(query, max_results)
    elif provider == "brave":
        return await brave_client.search(query, max_results)
    else:
        return await google_client.search(query, max_results)
```

**TypeScript consolidated tool:**

```typescript
type SearchProvider = "tavily" | "brave" | "google";

interface SearchParams {
  query: string;
  provider?: SearchProvider;
  maxResults?: number;
}

async function webSearch({
  query,
  provider = "tavily",
  maxResults = 10
}: SearchParams) {
  switch (provider) {
    case "tavily":
      return await tavilyClient.search(query, maxResults);
    case "brave":
      return await braveClient.search(query, maxResults);
    case "google":
      return await googleClient.search(query, maxResults);
  }
}
```

**Result:** Up to 60% reduction in tool definition overhead.

### Concise Tool Descriptions

Every token in a tool description costs money at inference time.

**BAD:** Verbose description (~40 tokens)

```python
@mcp_tool
async def search_github_issues(query: str, state: str = "open"):
    """
    This tool allows you to search for issues in GitHub repositories.
    It supports filtering by state, labels, assignees, and milestone.
    Results are paginated and return up to 100 items per request.
    Use this when you need to find specific issues or track bugs.
    """
    ...
```

**GOOD:** Concise description (~15 tokens)

```python
@mcp_tool
async def search_github_issues(query: str, state: str = "open"):
    """Search GitHub issues. Filters: state, labels, assignee, milestone. Paginated."""
    ...
```

**Rule of thumb:** Tool descriptions should be under 100 tokens each. Use parameter names and type hints to convey structure instead of prose.

**Before/after comparison:**

| Aspect | Before | After | Savings |
|--------|--------|-------|---------|
| Description length | 280 characters | 75 characters | 73% |
| Token count | ~40 tokens | ~15 tokens | 62% |
| Context clarity | Good | Excellent | N/A |

## 2. Hierarchical Financial Guardrails

### Token-Based Quotas (Not Just Request Counts)

A single complex query can cost 10x more than a simple one. Budget by tokens, not requests.

**Three-Tier Quota Structure:**

```
├── Global Level: Hard "kill switch" — $500/month org cap
│   ├── Team Level: Monthly caps per department — $100/month per team
│   │   └── User Level: Strict per-developer limits — $20/month per user
```

**Python middleware example for token budget tracking:**

```python
from typing import Dict
from datetime import datetime, timedelta
import asyncio

class BudgetExceededError(Exception):
    pass

class TokenBudgetMiddleware:
    def __init__(
        self,
        user_limit: int = 50_000,
        team_limit: int = 500_000,
        global_limit: int = 2_000_000,
        cost_per_1k_tokens: float = 0.01
    ):
        self.limits = {
            "user": user_limit,
            "team": team_limit,
            "global": global_limit
        }
        self.cost_per_1k = cost_per_1k_tokens
        self.usage: Dict[str, Dict[str, int]] = {
            "user": {},
            "team": {},
            "global": {"total": 0}
        }
        self.reset_time = datetime.now() + timedelta(days=30)

    async def check_budget(
        self,
        user_id: str,
        team_id: str,
        estimated_tokens: int
    ) -> None:
        """Check user → team → global in order."""
        # User level
        user_used = self.usage["user"].get(user_id, 0)
        if user_used + estimated_tokens > self.limits["user"]:
            cost = (user_used * self.cost_per_1k) / 1000
            raise BudgetExceededError(
                f"User {user_id} would exceed budget. "
                f"Used: ${cost:.2f}, Limit: ${(self.limits['user'] * self.cost_per_1k) / 1000:.2f}"
            )

        # Team level
        team_used = self.usage["team"].get(team_id, 0)
        if team_used + estimated_tokens > self.limits["team"]:
            cost = (team_used * self.cost_per_1k) / 1000
            raise BudgetExceededError(
                f"Team {team_id} would exceed budget. "
                f"Used: ${cost:.2f}, Limit: ${(self.limits['team'] * self.cost_per_1k) / 1000:.2f}"
            )

        # Global level
        global_used = self.usage["global"]["total"]
        if global_used + estimated_tokens > self.limits["global"]:
            cost = (global_used * self.cost_per_1k) / 1000
            raise BudgetExceededError(
                f"Global budget would be exceeded. "
                f"Used: ${cost:.2f}, Limit: ${(self.limits['global'] * self.cost_per_1k) / 1000:.2f}"
            )

    async def record_usage(
        self,
        user_id: str,
        team_id: str,
        actual_tokens: int
    ) -> None:
        """Deduct from all three levels."""
        self.usage["user"][user_id] = self.usage["user"].get(user_id, 0) + actual_tokens
        self.usage["team"][team_id] = self.usage["team"].get(team_id, 0) + actual_tokens
        self.usage["global"]["total"] += actual_tokens

    def get_usage_stats(self, user_id: str, team_id: str) -> dict:
        """Return current usage and remaining budget."""
        user_used = self.usage["user"].get(user_id, 0)
        team_used = self.usage["team"].get(team_id, 0)
        global_used = self.usage["global"]["total"]

        return {
            "user": {
                "used": user_used,
                "limit": self.limits["user"],
                "remaining": self.limits["user"] - user_used,
                "percent": (user_used / self.limits["user"]) * 100
            },
            "team": {
                "used": team_used,
                "limit": self.limits["team"],
                "remaining": self.limits["team"] - team_used,
                "percent": (team_used / self.limits["team"]) * 100
            },
            "global": {
                "used": global_used,
                "limit": self.limits["global"],
                "remaining": self.limits["global"] - global_used,
                "percent": (global_used / self.limits["global"]) * 100
            }
        }
```

**TypeScript version:**

```typescript
interface BudgetLimits {
  user: number;
  team: number;
  global: number;
}

interface Usage {
  user: Map<string, number>;
  team: Map<string, number>;
  global: { total: number };
}

class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BudgetExceededError";
  }
}

class TokenBudgetMiddleware {
  private limits: BudgetLimits;
  private usage: Usage;
  private costPer1k: number;
  private resetTime: Date;

  constructor(
    userLimit = 50_000,
    teamLimit = 500_000,
    globalLimit = 2_000_000,
    costPer1kTokens = 0.01
  ) {
    this.limits = {
      user: userLimit,
      team: teamLimit,
      global: globalLimit,
    };
    this.costPer1k = costPer1kTokens;
    this.usage = {
      user: new Map(),
      team: new Map(),
      global: { total: 0 },
    };
    this.resetTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  async checkBudget(
    userId: string,
    teamId: string,
    estimatedTokens: number
  ): Promise<void> {
    // User level
    const userUsed = this.usage.user.get(userId) || 0;
    if (userUsed + estimatedTokens > this.limits.user) {
      const cost = (userUsed * this.costPer1k) / 1000;
      throw new BudgetExceededError(
        `User ${userId} would exceed budget. Used: $${cost.toFixed(2)}, Limit: $${((this.limits.user * this.costPer1k) / 1000).toFixed(2)}`
      );
    }

    // Team level
    const teamUsed = this.usage.team.get(teamId) || 0;
    if (teamUsed + estimatedTokens > this.limits.team) {
      const cost = (teamUsed * this.costPer1k) / 1000;
      throw new BudgetExceededError(
        `Team ${teamId} would exceed budget. Used: $${cost.toFixed(2)}, Limit: $${((this.limits.team * this.costPer1k) / 1000).toFixed(2)}`
      );
    }

    // Global level
    const globalUsed = this.usage.global.total;
    if (globalUsed + estimatedTokens > this.limits.global) {
      const cost = (globalUsed * this.costPer1k) / 1000;
      throw new BudgetExceededError(
        `Global budget would be exceeded. Used: $${cost.toFixed(2)}, Limit: $${((this.limits.global * this.costPer1k) / 1000).toFixed(2)}`
      );
    }
  }

  async recordUsage(
    userId: string,
    teamId: string,
    actualTokens: number
  ): Promise<void> {
    this.usage.user.set(userId, (this.usage.user.get(userId) || 0) + actualTokens);
    this.usage.team.set(teamId, (this.usage.team.get(teamId) || 0) + actualTokens);
    this.usage.global.total += actualTokens;
  }

  getUsageStats(userId: string, teamId: string) {
    const userUsed = this.usage.user.get(userId) || 0;
    const teamUsed = this.usage.team.get(teamId) || 0;
    const globalUsed = this.usage.global.total;

    return {
      user: {
        used: userUsed,
        limit: this.limits.user,
        remaining: this.limits.user - userUsed,
        percent: (userUsed / this.limits.user) * 100,
      },
      team: {
        used: teamUsed,
        limit: this.limits.team,
        remaining: this.limits.team - teamUsed,
        percent: (teamUsed / this.limits.team) * 100,
      },
      global: {
        used: globalUsed,
        limit: this.limits.global,
        remaining: this.limits.global - globalUsed,
        percent: (globalUsed / this.limits.global) * 100,
      },
    };
  }
}
```

### Rate Limiting (Speed Limits)

5-15 requests per minute per agent prevents error loops from draining budget.

**Simple rate limiter implementation:**

```python
import time
from collections import deque
from typing import Dict

class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests: Dict[str, deque] = {}

    def can_proceed(self, identifier: str) -> bool:
        """Check if request is allowed under rate limit."""
        now = time.time()

        if identifier not in self.requests:
            self.requests[identifier] = deque()

        # Remove requests outside the window
        while self.requests[identifier] and self.requests[identifier][0] < now - self.window:
            self.requests[identifier].popleft()

        # Check if we're at the limit
        if len(self.requests[identifier]) >= self.max_requests:
            return False

        # Record this request
        self.requests[identifier].append(now)
        return True

    def time_until_available(self, identifier: str) -> float:
        """Return seconds until next request is allowed."""
        if identifier not in self.requests or len(self.requests[identifier]) < self.max_requests:
            return 0.0

        oldest = self.requests[identifier][0]
        return max(0.0, self.window - (time.time() - oldest))
```

**TypeScript rate limiter:**

```typescript
class RateLimiter {
  private maxRequests: number;
  private windowSeconds: number;
  private requests: Map<string, number[]>;

  constructor(maxRequests = 10, windowSeconds = 60) {
    this.maxRequests = maxRequests;
    this.windowSeconds = windowSeconds;
    this.requests = new Map();
  }

  canProceed(identifier: string): boolean {
    const now = Date.now() / 1000;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const userRequests = this.requests.get(identifier)!;

    // Remove requests outside the window
    const cutoff = now - this.windowSeconds;
    const validRequests = userRequests.filter((t) => t >= cutoff);
    this.requests.set(identifier, validRequests);

    // Check if we're at the limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Record this request
    validRequests.push(now);
    return true;
  }

  timeUntilAvailable(identifier: string): number {
    if (!this.requests.has(identifier)) {
      return 0;
    }

    const userRequests = this.requests.get(identifier)!;
    if (userRequests.length < this.maxRequests) {
      return 0;
    }

    const oldest = userRequests[0];
    return Math.max(0, this.windowSeconds - (Date.now() / 1000 - oldest));
  }
}
```

### Output Token Caps

Output tokens are priced 4-8x higher than input tokens. Set maximum output limits to prevent verbose responses.

**Example configuration:**

```python
# In your MCP server config
DEFAULT_OUTPUT_LIMITS = {
    "simple_lookup": 512,      # File reads, database queries
    "analysis": 2048,           # Code reviews, summarization
    "generation": 4096,         # Complex document generation
    "streaming": 8192           # Multi-step workflows
}

async def execute_tool(
    tool_name: str,
    args: dict,
    max_output_tokens: int = None
):
    category = get_tool_category(tool_name)
    limit = max_output_tokens or DEFAULT_OUTPUT_LIMITS.get(category, 4096)

    # Pass to LLM provider
    response = await llm_client.complete(
        messages=[...],
        max_tokens=limit
    )

    return response
```

## 3. Semantic Caching & Model Routing

### Semantic Caching

If an agent asks "Show me sales" and another asks "Display revenue", serve cached response.

**How it works:** Embed the tool call (name + arguments) as a vector. On each new call, search for semantically similar previous calls. If found and fresh, return cached result without invoking the tool or LLM.

**Savings:** 40-60% on repetitive workflows.

**Python implementation:**

```python
import json
import hashlib
from typing import Any, Optional
import numpy as np
from datetime import datetime, timedelta

class SemanticCache:
    def __init__(self, embedding_fn, vector_store, ttl_seconds=3600):
        self.embed = embedding_fn
        self.store = vector_store
        self.ttl = ttl_seconds

    def _cache_key(self, tool_name: str, args: dict) -> str:
        """Generate cache key from tool call."""
        normalized = json.dumps({"tool": tool_name, "args": args}, sort_keys=True)
        return hashlib.sha256(normalized.encode()).hexdigest()

    async def get_cached(
        self,
        tool_name: str,
        args: dict,
        threshold: float = 0.85
    ) -> Optional[Any]:
        """Check cache for semantically similar call."""
        query_text = f"{tool_name}:{json.dumps(args)}"
        embedding = await self.embed(query_text)

        # Search vector store
        results = await self.store.search(embedding, threshold=threshold, limit=1)

        if not results:
            return None

        cached_entry = results[0]

        # Check TTL
        if datetime.now() - cached_entry["timestamp"] > timedelta(seconds=self.ttl):
            await self.store.delete(cached_entry["id"])
            return None

        return cached_entry["result"]

    async def store_result(
        self,
        tool_name: str,
        args: dict,
        result: Any
    ) -> None:
        """Cache the result with embedding."""
        query_text = f"{tool_name}:{json.dumps(args)}"
        embedding = await self.embed(query_text)

        await self.store.insert({
            "id": self._cache_key(tool_name, args),
            "embedding": embedding,
            "tool_name": tool_name,
            "args": args,
            "result": result,
            "timestamp": datetime.now()
        })

async def cached_tool_call(
    tool_name: str,
    args: dict,
    cache: SemanticCache,
    threshold: float = 0.85
) -> Any:
    """Execute tool with semantic caching."""
    # Check cache
    cached = await cache.get_cached(tool_name, args, threshold)
    if cached is not None:
        print(f"Cache hit for {tool_name}")
        return cached

    # Execute tool
    print(f"Cache miss for {tool_name}, executing...")
    result = await execute_tool(tool_name, args)

    # Store result
    await cache.store_result(tool_name, args, result)

    return result
```

**TypeScript implementation:**

```typescript
import crypto from "crypto";

interface CacheEntry {
  id: string;
  embedding: number[];
  toolName: string;
  args: Record<string, any>;
  result: any;
  timestamp: Date;
}

interface VectorStore {
  search(embedding: number[], threshold: number, limit: number): Promise<CacheEntry[]>;
  insert(entry: CacheEntry): Promise<void>;
  delete(id: string): Promise<void>;
}

class SemanticCache {
  private ttlSeconds: number;

  constructor(
    private embed: (text: string) => Promise<number[]>,
    private store: VectorStore,
    ttlSeconds = 3600
  ) {
    this.ttlSeconds = ttlSeconds;
  }

  private cacheKey(toolName: string, args: Record<string, any>): string {
    const normalized = JSON.stringify({ tool: toolName, args }, Object.keys(args).sort());
    return crypto.createHash("sha256").update(normalized).digest("hex");
  }

  async getCached(
    toolName: string,
    args: Record<string, any>,
    threshold = 0.85
  ): Promise<any | null> {
    const queryText = `${toolName}:${JSON.stringify(args)}`;
    const embedding = await this.embed(queryText);

    const results = await this.store.search(embedding, threshold, 1);

    if (results.length === 0) {
      return null;
    }

    const cachedEntry = results[0];

    // Check TTL
    const age = Date.now() - cachedEntry.timestamp.getTime();
    if (age > this.ttlSeconds * 1000) {
      await this.store.delete(cachedEntry.id);
      return null;
    }

    return cachedEntry.result;
  }

  async storeResult(
    toolName: string,
    args: Record<string, any>,
    result: any
  ): Promise<void> {
    const queryText = `${toolName}:${JSON.stringify(args)}`;
    const embedding = await this.embed(queryText);

    await this.store.insert({
      id: this.cacheKey(toolName, args),
      embedding,
      toolName,
      args,
      result,
      timestamp: new Date(),
    });
  }
}

async function cachedToolCall(
  toolName: string,
  args: Record<string, any>,
  cache: SemanticCache,
  threshold = 0.85
): Promise<any> {
  // Check cache
  const cached = await cache.getCached(toolName, args, threshold);
  if (cached !== null) {
    console.log(`Cache hit for ${toolName}`);
    return cached;
  }

  // Execute tool
  console.log(`Cache miss for ${toolName}, executing...`);
  const result = await executeToolFunction(toolName, args);

  // Store result
  await cache.storeResult(toolName, args, result);

  return result;
}

// Placeholder for actual tool execution
async function executeToolFunction(toolName: string, args: Record<string, any>): Promise<any> {
  // Your tool execution logic here
  return {};
}
```

### Dynamic Model Routing

Route by task complexity to minimize cost:

| Task Type | Route To | Cost per Call |
|-----------|----------|---------------|
| Fetch a file, simple lookup | Haiku / GPT-4o mini | $0.001 |
| Moderate reasoning, data analysis | Sonnet | $0.01 |
| Complex multi-step reasoning | Opus | $0.05 |

**OpenRouter integration for model routing:**

```python
import os
import openai

client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"]
)

def route_model(task_complexity: str) -> str:
    """Select model based on task complexity."""
    model_map = {
        "simple": "anthropic/claude-haiku",
        "moderate": "anthropic/claude-sonnet",
        "complex": "anthropic/claude-opus"
    }
    return model_map.get(task_complexity, "anthropic/claude-sonnet")

def classify_task_complexity(tool_name: str, args: dict) -> str:
    """Heuristic to determine task complexity."""
    # Simple tasks
    simple_tools = {"read_file", "get_user", "list_items"}
    if tool_name in simple_tools:
        return "simple"

    # Complex tasks
    complex_tools = {"generate_report", "deep_analysis", "multi_step_workflow"}
    if tool_name in complex_tools:
        return "complex"

    # Check argument complexity
    if len(str(args)) > 1000:
        return "complex"

    return "moderate"

async def execute_with_routing(tool_name: str, args: dict, prompt: str):
    """Execute tool call with dynamic model routing."""
    complexity = classify_task_complexity(tool_name, args)
    model = route_model(complexity)

    print(f"Routing to {model} (complexity: {complexity})")

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
```

**TypeScript with OpenRouter:**

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function routeModel(taskComplexity: "simple" | "moderate" | "complex"): string {
  const modelMap = {
    simple: "anthropic/claude-haiku",
    moderate: "anthropic/claude-sonnet",
    complex: "anthropic/claude-opus",
  };
  return modelMap[taskComplexity];
}

function classifyTaskComplexity(
  toolName: string,
  args: Record<string, any>
): "simple" | "moderate" | "complex" {
  const simpleTools = new Set(["read_file", "get_user", "list_items"]);
  if (simpleTools.has(toolName)) {
    return "simple";
  }

  const complexTools = new Set([
    "generate_report",
    "deep_analysis",
    "multi_step_workflow",
  ]);
  if (complexTools.has(toolName)) {
    return "complex";
  }

  if (JSON.stringify(args).length > 1000) {
    return "complex";
  }

  return "moderate";
}

async function executeWithRouting(
  toolName: string,
  args: Record<string, any>,
  prompt: string
): Promise<string> {
  const complexity = classifyTaskComplexity(toolName, args);
  const model = routeModel(complexity);

  console.log(`Routing to ${model} (complexity: ${complexity})`);

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "";
}
```

**Benefits of OpenRouter:**

- Single API key for all LLM providers (Anthropic, OpenAI, Google, Meta, etc.)
- Unified billing across providers — no need to manage multiple accounts
- Automatic fallback if a model is down or rate-limited
- Usage tracking and cost dashboards in one place
- Pay-per-use pricing with no monthly minimums

## 4. Payment for MCP Server Services

### Primary: Privacy.com Virtual Cards

**The recommended approach** for paying for third-party MCP server APIs.

**How it works:**

1. Create a virtual card per MCP server/service
2. Set spending limit (e.g., $5/month for a data API)
3. Assign to the service's billing
4. Agent uses the service; charges go to the scoped card
5. Pause or close the card when done

**Benefits:**

- Per-service spend isolation (know exactly what each MCP server costs)
- Can be paused/closed instantly (kill switch for runaway costs)
- No exposure of real payment details to third-party services
- Spending alerts per card (email notification at 50%, 80%, 100%)
- Transaction-level visibility (see every API charge itemized)

**Example workflow:**

```bash
# Via Privacy.com dashboard or API
1. Create card "MCP-GitHub-API" with $10/month limit
2. Create card "MCP-Tavily-Search" with $20/month limit
3. Create card "MCP-Database-Service" with $50/month limit

# Assign each card to the respective service billing
# Monitor via Privacy.com dashboard or webhooks

# If a service gets compromised or misbehaves
-> Pause card instantly (charges decline immediately)
-> Close card to prevent any future use
-> Create new card with new number if resuming service
```

**Limitations:**

- **US-only** (requires US bank account and SSN/EIN)
- **Alternatives for international:**
  - Revolut virtual cards (EU, UK, US)
  - Stripe Issuing (via custom implementation)
  - Wise virtual cards (multi-currency)

### Stripe Metered Billing (For YOUR Server)

If you're building an MCP server that others will pay to use, implement usage-based billing with Stripe.

**Complete metering middleware — Python:**

```python
import os
import stripe
from typing import Optional
from datetime import datetime

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

class MeteringMiddleware:
    def __init__(self, meter_event_name: str = "mcp_tool_call"):
        self.meter_event_name = meter_event_name

    async def record_usage(
        self,
        customer_id: str,
        tool_name: str,
        tokens_used: int,
        metadata: Optional[dict] = None
    ) -> None:
        """Record a metered billing event."""
        try:
            event = stripe.billing.MeterEvent.create(
                event_name=self.meter_event_name,
                payload={
                    "stripe_customer_id": customer_id,
                    "value": str(tokens_used),
                },
                metadata={
                    "tool": tool_name,
                    "timestamp": datetime.utcnow().isoformat(),
                    **(metadata or {})
                }
            )
            print(f"Recorded {tokens_used} tokens for {customer_id} ({tool_name})")
            return event
        except stripe.error.StripeError as e:
            print(f"Metering error: {e}")
            raise

    async def get_usage(self, customer_id: str, start_date: str, end_date: str) -> dict:
        """Retrieve usage for a customer in a date range."""
        # Query meter events
        events = stripe.billing.MeterEvent.list(
            customer=customer_id,
            created={
                "gte": start_date,
                "lte": end_date
            },
            limit=100
        )

        total_tokens = sum(int(event.payload["value"]) for event in events.data)

        return {
            "customer_id": customer_id,
            "period": {"start": start_date, "end": end_date},
            "total_tokens": total_tokens,
            "event_count": len(events.data)
        }

# Usage in your MCP server
metering = MeteringMiddleware()

async def handle_tool_call(customer_id: str, tool_name: str, args: dict):
    # Execute tool
    result, tokens_used = await execute_tool_with_tracking(tool_name, args)

    # Record usage
    await metering.record_usage(
        customer_id=customer_id,
        tool_name=tool_name,
        tokens_used=tokens_used,
        metadata={"args_size": len(str(args))}
    )

    return result
```

**Complete metering middleware — TypeScript:**

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

interface MeteringMetadata {
  tool: string;
  timestamp: string;
  [key: string]: string;
}

class MeteringMiddleware {
  private meterEventName: string;

  constructor(meterEventName = "mcp_tool_call") {
    this.meterEventName = meterEventName;
  }

  async recordUsage(
    customerId: string,
    toolName: string,
    tokensUsed: number,
    metadata?: Record<string, string>
  ): Promise<Stripe.Billing.MeterEvent> {
    try {
      const event = await stripe.billing.meterEvents.create({
        event_name: this.meterEventName,
        payload: {
          stripe_customer_id: customerId,
          value: String(tokensUsed),
        },
        metadata: {
          tool: toolName,
          timestamp: new Date().toISOString(),
          ...(metadata || {}),
        } as MeteringMetadata,
      });

      console.log(`Recorded ${tokensUsed} tokens for ${customerId} (${toolName})`);
      return event;
    } catch (error) {
      console.error("Metering error:", error);
      throw error;
    }
  }

  async getUsage(
    customerId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    customerId: string;
    period: { start: string; end: string };
    totalTokens: number;
    eventCount: number;
  }> {
    const events = await stripe.billing.meterEvents.list({
      customer: customerId,
      created: {
        gte: Math.floor(new Date(startDate).getTime() / 1000),
        lte: Math.floor(new Date(endDate).getTime() / 1000),
      },
      limit: 100,
    });

    const totalTokens = events.data.reduce(
      (sum, event) => sum + parseInt(event.payload.value, 10),
      0
    );

    return {
      customerId,
      period: { start: startDate, end: endDate },
      totalTokens,
      eventCount: events.data.length,
    };
  }
}

// Usage in your MCP server
const metering = new MeteringMiddleware();

async function handleToolCall(
  customerId: string,
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  // Execute tool
  const { result, tokensUsed } = await executeToolWithTracking(toolName, args);

  // Record usage
  await metering.recordUsage(customerId, toolName, tokensUsed, {
    args_size: String(JSON.stringify(args).length),
  });

  return result;
}

// Placeholder for tool execution
async function executeToolWithTracking(
  toolName: string,
  args: Record<string, any>
): Promise<{ result: any; tokensUsed: number }> {
  // Your tool execution + token counting logic
  return { result: {}, tokensUsed: 100 };
}
```

### Billing Models

| Model | Best For | How It Works |
|-------|----------|-------------|
| Per-call | Simple tools | Charge $0.01-$0.10 per JSON-RPC invocation |
| Per-token | LLM-adjacent | Charge based on input+output tokens used |
| Credit-based | Flexible usage | Pre-purchased credits, deducted per use |
| Subscription | Predictable revenue | Monthly flat fee (e.g., $50) + overage charges |

**Example pricing structure:**

```python
PRICING_TIERS = {
    "starter": {
        "monthly_fee": 0,
        "included_tokens": 10_000,
        "overage_rate": 0.02  # per 1k tokens
    },
    "professional": {
        "monthly_fee": 49,
        "included_tokens": 500_000,
        "overage_rate": 0.015
    },
    "enterprise": {
        "monthly_fee": 199,
        "included_tokens": 5_000_000,
        "overage_rate": 0.01
    }
}

def calculate_bill(tier: str, tokens_used: int) -> float:
    config = PRICING_TIERS[tier]
    base = config["monthly_fee"]

    overage = max(0, tokens_used - config["included_tokens"])
    overage_cost = (overage / 1000) * config["overage_rate"]

    return base + overage_cost
```

### Credit Wallet Systems

For platforms managing many users across many MCP servers.

**How it works:**

- Users purchase credits (e.g., $10 = 1000 credits)
- Credits map to API calls, tokens, compute time, or composite usage
- Each tool call deducts credits based on complexity
- Refill manually or auto-recharge when low

**Simple credit wallet implementation:**

```python
from decimal import Decimal
from typing import Optional

class CreditWallet:
    def __init__(self, user_id: str, initial_balance: Decimal = Decimal("0")):
        self.user_id = user_id
        self.balance = initial_balance
        self.transactions = []

    def add_credits(self, amount: Decimal, note: str = "") -> None:
        """Add credits to wallet."""
        self.balance += amount
        self.transactions.append({
            "type": "credit",
            "amount": amount,
            "balance": self.balance,
            "note": note
        })

    def deduct_credits(self, amount: Decimal, note: str = "") -> bool:
        """Deduct credits if sufficient balance."""
        if self.balance < amount:
            return False

        self.balance -= amount
        self.transactions.append({
            "type": "debit",
            "amount": amount,
            "balance": self.balance,
            "note": note
        })
        return True

    def get_balance(self) -> Decimal:
        return self.balance

# Tool pricing in credits
TOOL_COSTS = {
    "simple_lookup": Decimal("1"),
    "web_search": Decimal("5"),
    "code_generation": Decimal("10"),
    "video_processing": Decimal("50")
}

async def execute_tool_with_credits(
    wallet: CreditWallet,
    tool_name: str,
    args: dict
) -> Optional[dict]:
    cost = TOOL_COSTS.get(tool_name, Decimal("1"))

    if not wallet.deduct_credits(cost, f"Tool call: {tool_name}"):
        raise InsufficientCreditsError(
            f"Need {cost} credits, have {wallet.get_balance()}"
        )

    result = await execute_tool(tool_name, args)
    return result
```

### x402 Micropayments (Emerging)

HTTP 402-based protocol for agent-to-agent pay-per-call.

**How it works:**

1. Agent makes request to MCP server
2. Server responds with `402 Payment Required` + payment details
3. Agent sends payment via HTTP header (often USDC stablecoin)
4. Server validates payment and fulfills request
5. As low as $0.001 per invocation

**Benefits:**

- No account setup needed per service
- Instant settlement (blockchain-based)
- Open standard, supported by Skyfire and others
- Eliminates subscription fatigue

**Conceptual flow:**

```python
import httpx

async def x402_tool_call(url: str, method: str, data: dict, wallet):
    """Execute tool call with x402 micropayment."""
    # Initial request
    response = await httpx.request(method, url, json=data)

    if response.status_code == 402:
        # Payment required
        payment_info = response.json()
        amount = payment_info["amount_usd"]
        address = payment_info["payment_address"]

        # Send payment
        tx_hash = await wallet.send_usdc(address, amount)

        # Retry with payment proof
        response = await httpx.request(
            method,
            url,
            json=data,
            headers={"X-Payment-Proof": tx_hash}
        )

    return response.json()
```

### Skyfire Wallet Abstraction

"Know Your Agent" (KYA) verified identity for agents.

**How it works:**

1. Register agent with Skyfire KYA
2. Pre-fund agent wallet with corporate treasury funds
3. Agent autonomously pays for API calls using wallet
4. Corporate treasury stays secure with strict spending limits
5. All transactions logged for compliance

**Conceptual setup:**

```python
from skyfire import AgentWallet

# Initialize agent wallet
agent_wallet = AgentWallet(
    agent_id="assistant-prod-001",
    kya_verified=True,
    daily_limit_usd=100,
    allowed_services=["github", "tavily", "stripe"]
)

# Agent makes autonomous payment
async def call_paid_service(service: str, endpoint: str, data: dict):
    if service not in agent_wallet.allowed_services:
        raise PermissionError(f"Agent not authorized for {service}")

    # Agent pays autonomously
    result = await agent_wallet.call_service(
        service=service,
        endpoint=endpoint,
        data=data,
        max_cost_usd=5.00
    )

    return result
```

### Marqeta Agentic Payments

For agents that need to make **real financial transactions** (not just API payments).

**Use cases:**

- Agent books a flight for user
- Agent orders office supplies
- Agent pays contractor invoice

**Features:**

- Virtual card provisioning at runtime
- Spend and velocity controls per transaction
- Dispute management automation
- Transaction monitoring and anomaly flagging

**Conceptual integration:**

```python
from marqeta import MarqetaClient

marqeta = MarqetaClient(api_key=os.environ["MARQETA_API_KEY"])

async def provision_agent_card(agent_id: str, transaction_limit: float):
    """Provision a virtual card for a specific agent transaction."""
    card = await marqeta.cards.create({
        "user_token": agent_id,
        "card_product_token": "agent_virtual_card",
        "activation_actions": {"activate_upon_issue": True}
    })

    # Set spend controls
    await marqeta.velocity_controls.create({
        "token": card.token,
        "amount_limit": transaction_limit,
        "velocity_window": "TRANSACTION",
        "currency_code": "USD"
    })

    return card

# Agent executes transaction
async def agent_purchase(agent_id: str, merchant: str, amount: float):
    card = await provision_agent_card(agent_id, transaction_limit=amount * 1.1)

    # Agent uses card number to make purchase
    transaction = await execute_purchase(
        card_number=card.pan,
        cvv=card.cvv,
        merchant=merchant,
        amount=amount
    )

    # Close card after transaction
    await marqeta.cards.update(card.token, {"state": "SUSPENDED"})

    return transaction
```

## 5. Cost Dashboards & Observability

### Unified Metrics

Track both LLM tokens AND tool call costs in one view.

**Key platforms:**

- **TrueFoundry:** Combined LLM + MCP metrics with cost attribution
- **Moesif:** MCP server usage analytics + billing integration
- **Custom:** Build your own with Prometheus + Grafana

**Custom dashboard data model:**

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List

@dataclass
class ToolCallMetrics:
    timestamp: datetime
    user_id: str
    team_id: str
    tool_name: str
    input_tokens: int
    output_tokens: int
    execution_time_ms: int
    cost_usd: float
    cache_hit: bool
    model_used: str

class MetricsCollector:
    def __init__(self):
        self.metrics: List[ToolCallMetrics] = []

    def record(self, metric: ToolCallMetrics) -> None:
        self.metrics.append(metric)

    def aggregate_by_tool(self) -> dict:
        """Aggregate metrics by tool name."""
        tool_stats = {}

        for m in self.metrics:
            if m.tool_name not in tool_stats:
                tool_stats[m.tool_name] = {
                    "calls": 0,
                    "total_cost": 0.0,
                    "total_tokens": 0,
                    "avg_latency_ms": 0,
                    "cache_hit_rate": 0
                }

            stats = tool_stats[m.tool_name]
            stats["calls"] += 1
            stats["total_cost"] += m.cost_usd
            stats["total_tokens"] += m.input_tokens + m.output_tokens
            stats["avg_latency_ms"] = (
                (stats["avg_latency_ms"] * (stats["calls"] - 1) + m.execution_time_ms)
                / stats["calls"]
            )
            if m.cache_hit:
                stats["cache_hit_rate"] = (
                    (stats["cache_hit_rate"] * (stats["calls"] - 1) + 1)
                    / stats["calls"]
                )

        return tool_stats

    def aggregate_by_user(self) -> dict:
        """Aggregate metrics by user."""
        user_stats = {}

        for m in self.metrics:
            if m.user_id not in user_stats:
                user_stats[m.user_id] = {
                    "calls": 0,
                    "total_cost": 0.0,
                    "total_tokens": 0
                }

            stats = user_stats[m.user_id]
            stats["calls"] += 1
            stats["total_cost"] += m.cost_usd
            stats["total_tokens"] += m.input_tokens + m.output_tokens

        return user_stats
```

### Key Metrics to Track

| Metric | Why | Alert Threshold |
|--------|-----|-----------------|
| Token cost per tool call | Identifies expensive tools | >$0.10 per call |
| Cache hit rate | Measures caching effectiveness | <40% |
| Tool selection accuracy | Catches misfires | <85% success rate |
| Cost per user/team/agent | Attribution and budgeting | >80% of monthly budget |
| Error rate per MCP server | Reliability monitoring | >5% errors |
| Budget utilization % | Prevents surprises | >90% consumed |
| Average response time | Performance SLA | >3 seconds |
| Output token ratio | Verbosity detection | >4x input tokens |

### Budget Alerting

**Example alert thresholds:**

```python
class BudgetAlerter:
    def __init__(self, budget_limit: float):
        self.budget_limit = budget_limit
        self.thresholds = {
            0.50: "info",      # 50% budget used
            0.75: "warning",   # 75% budget used
            0.90: "critical",  # 90% budget used
            1.00: "emergency"  # 100% budget used
        }

    def check_and_alert(self, current_spend: float) -> Optional[str]:
        """Check budget utilization and return alert level."""
        utilization = current_spend / self.budget_limit

        for threshold, level in sorted(self.thresholds.items(), reverse=True):
            if utilization >= threshold:
                return self._send_alert(level, utilization, current_spend)

        return None

    def _send_alert(self, level: str, utilization: float, spend: float) -> str:
        message = f"Budget {level.upper()}: {utilization*100:.1f}% used (${spend:.2f}/${self.budget_limit:.2f})"

        if level == "info":
            print(f"INFO: {message}")
        elif level == "warning":
            print(f"WARNING: {message}")
            # Send email to team lead
        elif level == "critical":
            print(f"CRITICAL: {message}")
            # Send Slack alert + email
            # Reduce rate limits
        elif level == "emergency":
            print(f"EMERGENCY: {message}")
            # Hard stop (kill switch)
            # Page on-call engineer

        return message
```

**TypeScript alerter:**

```typescript
interface AlertThresholds {
  [utilization: number]: "info" | "warning" | "critical" | "emergency";
}

class BudgetAlerter {
  private budgetLimit: number;
  private thresholds: AlertThresholds = {
    0.5: "info",
    0.75: "warning",
    0.9: "critical",
    1.0: "emergency",
  };

  constructor(budgetLimit: number) {
    this.budgetLimit = budgetLimit;
  }

  checkAndAlert(currentSpend: number): string | null {
    const utilization = currentSpend / this.budgetLimit;

    const sortedThresholds = Object.entries(this.thresholds).sort(
      ([a], [b]) => parseFloat(b) - parseFloat(a)
    );

    for (const [threshold, level] of sortedThresholds) {
      if (utilization >= parseFloat(threshold)) {
        return this.sendAlert(level, utilization, currentSpend);
      }
    }

    return null;
  }

  private sendAlert(
    level: "info" | "warning" | "critical" | "emergency",
    utilization: number,
    spend: number
  ): string {
    const message = `Budget ${level.toUpperCase()}: ${(utilization * 100).toFixed(1)}% used ($${spend.toFixed(2)}/$${this.budgetLimit.toFixed(2)})`;

    switch (level) {
      case "info":
        console.log(`INFO: ${message}`);
        break;
      case "warning":
        console.warn(`WARNING: ${message}`);
        // Send email to team lead
        break;
      case "critical":
        console.error(`CRITICAL: ${message}`);
        // Send Slack alert + email
        // Reduce rate limits
        break;
      case "emergency":
        console.error(`EMERGENCY: ${message}`);
        // Hard stop (kill switch)
        // Page on-call engineer
        break;
    }

    return message;
  }
}
```

## Summary Checklist

| Strategy | Action | Expected Benefit |
|----------|--------|-----------------|
| Context Optimization | Use Code Mode to load tool schemas on-demand | ~90% reduction in input token costs |
| Tool Consolidation | Merge similar tools with provider parameters | ~60% reduction in tool definition overhead |
| Concise Descriptions | Keep tool descriptions under 100 tokens | Lower inference costs per request |
| Access Control | Deploy Virtual MCP Servers to filter tools by team | Prevents context bloat; lowers latency |
| Output Limits | Set max_output_tokens per tool category | Prevent 4-8x output token costs |
| Cost Avoidance | Enable Semantic Caching at the gateway | Saves ~50% on repetitive queries |
| Budgeting | Enforce token-based quotas (not just request limits) | Prevents "runaway" agent loops |
| Rate Limiting | 5-15 requests/min per agent | Stops error loops from draining budget |
| Model Routing | Route simple tasks to cheap models via OpenRouter | 10-50x cost reduction on simple ops |
| Service Payments | Use Privacy.com virtual cards per MCP server | Per-service spend isolation + kill switch |
| Your Server Revenue | Stripe metered billing for your MCP server users | Usage-based monetization |
| Agent Payments | x402 or Skyfire for autonomous agent commerce | Enables micropayments at scale |
| Observability | Track token cost per tool call + cache hit rate | Identify expensive patterns early |
| Alerting | 50%/75%/90%/100% budget alerts | Prevent surprise overages |

## Additional Resources

- **Anthropic Prompt Caching:** Reduce costs for repeated context
- **OpenRouter Docs:** Unified API for all LLM providers
- **Stripe Metered Billing:** Usage-based pricing guide
- **Privacy.com API:** Programmatic virtual card creation
- **x402 Protocol Spec:** HTTP 402 micropayment standard
- **Skyfire Platform:** Agent wallet and KYA documentation
- **TrueFoundry:** LLM + MCP observability platform
- **Moesif:** API analytics and monetization

By combining these strategies, you can reduce LLM costs by 80-95% while maintaining full visibility into service spending and agent behavior.
