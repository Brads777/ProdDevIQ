---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
license: Complete terms in LICENSE.txt
---

# MCP Server Development Guide

## Overview

To create high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services, use this skill. An MCP server provides tools that allow LLMs to access external services and APIs. The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks using the tools provided.

---

# Process

## 🚀 High-Level Workflow

Creating a high-quality MCP server involves five main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Agent-Centric Design Principles

Before diving into implementation, understand how to design tools for AI agents by reviewing these principles:

**Build for Workflows, Not Just API Endpoints:**
- Don't simply wrap existing API endpoints - build thoughtful, high-impact workflow tools
- Consolidate related operations (e.g., `schedule_event` that both checks availability and creates event)
- Focus on tools that enable complete tasks, not just individual API calls
- Consider what workflows agents actually need to accomplish

**Optimize for Limited Context:**
- Agents have constrained context windows - make every token count
- Return high-signal information, not exhaustive data dumps
- Provide "concise" vs "detailed" response format options
- Default to human-readable identifiers over technical codes (names over IDs)
- Consider the agent's context budget as a scarce resource

**Design Actionable Error Messages:**
- Error messages should guide agents toward correct usage patterns
- Suggest specific next steps: "Try using filter='active_only' to reduce results"
- Make errors educational, not just diagnostic
- Help agents learn proper tool usage through clear feedback

**Follow Natural Task Subdivisions:**
- Tool names should reflect how humans think about tasks
- Group related tools with consistent prefixes for discoverability
- Design tools around natural workflows, not just API structure

**Use Evaluation-Driven Development:**
- Create realistic evaluation scenarios early
- Let agent feedback drive tool improvements
- Prototype quickly and iterate based on actual agent performance

#### 1.3 Study MCP Protocol Documentation

**Fetch the latest MCP protocol documentation:**

Use WebFetch to load: `https://modelcontextprotocol.io/llms-full.txt`

This comprehensive document contains the complete MCP specification and guidelines.

#### 1.4 Study Framework Documentation

**Load and read the following reference files:**

- **MCP Best Practices**: [📋 View Best Practices](./reference/mcp_best_practices.md) - Core guidelines for all MCP servers

**For Python implementations, also load:**
- **Python SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Python-specific best practices and examples

**For Node/TypeScript implementations, also load:**
- **TypeScript SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Node/TypeScript-specific best practices and examples

#### 1.5 Exhaustively Study API Documentation

To integrate a service, read through **ALL** available API documentation:
- Official API reference documentation
- Authentication and authorization requirements
- Rate limiting and pagination patterns
- Error responses and status codes
- Available endpoints and their parameters
- Data models and schemas

**To gather comprehensive information, use web search and the WebFetch tool as needed.**

#### 1.6 Plan Your Context Budget

Before designing tools, understand how they impact the LLM's context window. Every tool definition is injected into every inference turn — this is a recurring cost.

**Token Budget Planning:**
- Target **<100 tokens per tool description** (concise > verbose)
- Target **<5,000 tokens total** for your entire server
- At 200 tokens/tool, you can have ~25 tools before hitting budget
- At 100 tokens/tool (optimized), you can have ~50 tools

**Consolidation Opportunities:**
- Identify similar tools that can merge into parameterized functions
- Example: 3 search tools → 1 `web_search(provider)` tool saves ~60% overhead
- See [Context Optimization Guide](./reference/context_optimization.md) for full strategies

**Gateway Compatibility:**
- Will this server run behind a Docker MCP Gateway? Plan for stateless design.
- Will it join a Composio-managed catalog? Ensure rich metadata for discovery.
- See [Gateway Patterns Guide](./reference/gateway_patterns.md) for architecture details

**Payment Model Decision:**
- Free (open source, internal use)
- Per-call (charge per JSON-RPC invocation)
- Credit-based (pre-purchased credits deducted per use)
- Subscription (monthly flat fee + overage)
- See [Payment & Metering Guide](./reference/payment_metering.md) for implementation

#### 1.7 Create a Comprehensive Implementation Plan

Based on your research, create a detailed plan that includes:

**Tool Selection:**
- List the most valuable endpoints/operations to implement
- Prioritize tools that enable the most common and important use cases
- Consider which tools work together to enable complex workflows

**Shared Utilities and Helpers:**
- Identify common API request patterns
- Plan pagination helpers
- Design filtering and formatting utilities
- Plan error handling strategies

**Input/Output Design:**
- Define input validation models (Pydantic for Python, Zod for TypeScript)
- Design consistent response formats (e.g., JSON or Markdown), and configurable levels of detail (e.g., Detailed or Concise)
- Plan for large-scale usage (thousands of users/resources)
- Implement character limits and truncation strategies (e.g., 25,000 tokens)

**Error Handling Strategy:**
- Plan graceful failure modes
- Design clear, actionable, LLM-friendly, natural language error messages which prompt further action
- Consider rate limiting and timeout scenarios
- Handle authentication and authorization errors

---

### Phase 2: Implementation

Now that you have a comprehensive plan, begin implementation following language-specific best practices.

#### 2.1 Set Up Project Structure

**For Python:**
- Create a single `.py` file or organize into modules if complex (see [🐍 Python Guide](./reference/python_mcp_server.md))
- Use the MCP Python SDK for tool registration
- Define Pydantic models for input validation

**For Node/TypeScript:**
- Create proper project structure (see [⚡ TypeScript Guide](./reference/node_mcp_server.md))
- Set up `package.json` and `tsconfig.json`
- Use MCP TypeScript SDK
- Define Zod schemas for input validation

#### 2.2 Implement Core Infrastructure First

**To begin implementation, create shared utilities before implementing tools:**
- API request helper functions
- Error handling utilities
- Response formatting functions (JSON and Markdown)
- Pagination helpers
- Authentication/token management

#### 2.3 Implement Tools Systematically

For each tool in the plan:

**Define Input Schema:**
- Use Pydantic (Python) or Zod (TypeScript) for validation
- Include proper constraints (min/max length, regex patterns, min/max values, ranges)
- Provide clear, descriptive field descriptions
- Include diverse examples in field descriptions

**Write Comprehensive Docstrings/Descriptions:**
- One-line summary of what the tool does
- Detailed explanation of purpose and functionality
- Explicit parameter types with examples
- Complete return type schema
- Usage examples (when to use, when not to use)
- Error handling documentation, which outlines how to proceed given specific errors

**Implement Tool Logic:**
- Use shared utilities to avoid code duplication
- Follow async/await patterns for all I/O
- Implement proper error handling
- Support multiple response formats (JSON and Markdown)
- Respect pagination parameters
- Check character limits and truncate appropriately

**Add Tool Annotations:**
- `readOnlyHint`: true (for read-only operations)
- `destructiveHint`: false (for non-destructive operations)
- `idempotentHint`: true (if repeated calls have same effect)
- `openWorldHint`: true (if interacting with external systems)

#### 2.4 Add Metering Middleware (If Applicable)

If your server will be billed per-use or needs cost tracking, add metering early:

**What to Track Per Tool Call:**
- Tool name and input parameters
- Execution duration (latency)
- Token count (input + output)
- Success/failure status
- Caller identity (user, team, agent)

**When to Add Metering:**
- Your server will be used by multiple teams/tenants
- Your server connects to paid APIs (track downstream costs)
- You plan to charge for your server's usage
- You need cost attribution and budgeting

See [Payment & Metering Guide](./reference/payment_metering.md) for Stripe integration, credit wallets, and middleware code examples in Python and Node.

#### 2.5 Follow Language-Specific Best Practices

**At this point, load the appropriate language guide:**

**For Python: Load [🐍 Python Implementation Guide](./reference/python_mcp_server.md) and ensure the following:**
- Using MCP Python SDK with proper tool registration
- Pydantic v2 models with `model_config`
- Type hints throughout
- Async/await for all I/O operations
- Proper imports organization
- Module-level constants (CHARACTER_LIMIT, API_BASE_URL)

**For Node/TypeScript: Load [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) and ensure the following:**
- Using `server.registerTool` properly
- Zod schemas with `.strict()`
- TypeScript strict mode enabled
- No `any` types - use proper types
- Explicit Promise<T> return types
- Build process configured (`npm run build`)

---

### Phase 3: Review and Refine

After initial implementation:

#### 3.1 Code Quality Review

To ensure quality, review the code for:
- **DRY Principle**: No duplicated code between tools
- **Composability**: Shared logic extracted into functions
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls have error handling
- **Type Safety**: Full type coverage (Python type hints, TypeScript types)
- **Documentation**: Every tool has comprehensive docstrings/descriptions

#### 3.2 Test and Build

**Important:** MCP servers are long-running processes that wait for requests over stdio/stdin or sse/http. Running them directly in your main process (e.g., `python server.py` or `node dist/index.js`) will cause your process to hang indefinitely.

**Safe ways to test the server:**
- Use the evaluation harness (see Phase 4) - recommended approach
- Run the server in tmux to keep it outside your main process
- Use a timeout when testing: `timeout 5s python server.py`

**For Python:**
- Verify Python syntax: `python -m py_compile your_server.py`
- Check imports work correctly by reviewing the file
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

**For Node/TypeScript:**
- Run `npm run build` and ensure it completes without errors
- Verify dist/index.js is created
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

#### 3.3 Context Footprint Audit

Before shipping, measure your server's impact on the context window:

1. **Count tokens per tool**: Use tiktoken or Anthropic's tokenizer on each tool's name + description + schema
2. **Total footprint target**: <5,000 tokens for the entire server
3. **Description optimization**: Rewrite any tool descriptions exceeding 100 tokens
4. **Consolidation check**: Flag any tools that could merge into parameterized functions
5. **Gateway smoke test**: If using Docker MCP Gateway, verify your server starts/stops cleanly and responds to health checks

See [Context Optimization Guide](./reference/context_optimization.md) for a measurement script and optimization strategies.

#### 3.4 Metering Dry Run (If Applicable)

If you added metering middleware:
1. Run through 10-20 representative tool calls
2. Verify all calls are recorded with correct metadata
3. Check that billing events (Stripe, credit deductions) fire correctly
4. Test budget limit enforcement — does the server reject calls when budget is exhausted?

#### 3.5 Use Quality Checklist

To verify implementation quality, load the appropriate checklist from the language-specific guide:
- Python: see "Quality Checklist" in [🐍 Python Guide](./reference/python_mcp_server.md)
- Node/TypeScript: see "Quality Checklist" in [⚡ TypeScript Guide](./reference/node_mcp_server.md)

---

### Phase 4: Create Evaluations

After implementing your MCP server, create comprehensive evaluations to test its effectiveness.

**Load [✅ Evaluation Guide](./reference/evaluation.md) for complete evaluation guidelines.**

#### 4.1 Understand Evaluation Purpose

Evaluations test whether LLMs can effectively use your MCP server to answer realistic, complex questions.

#### 4.2 Create 10 Evaluation Questions

To create effective evaluations, follow the process outlined in the evaluation guide:

1. **Tool Inspection**: List available tools and understand their capabilities
2. **Content Exploration**: Use READ-ONLY operations to explore available data
3. **Question Generation**: Create 10 complex, realistic questions
4. **Answer Verification**: Solve each question yourself to verify answers

#### 4.3 Evaluation Requirements

Each question must be:
- **Independent**: Not dependent on other questions
- **Read-only**: Only non-destructive operations required
- **Complex**: Requiring multiple tool calls and deep exploration
- **Realistic**: Based on real use cases humans would care about
- **Verifiable**: Single, clear answer that can be verified by string comparison
- **Stable**: Answer won't change over time

#### 4.4 Output Format

Create an XML file with this structure:

```xml
<evaluation>
  <qa_pair>
    <question>Find discussions about AI model launches with animal codenames. One model needed a specific safety designation that uses the format ASL-X. What number X was being determined for the model named after a spotted wild cat?</question>
    <answer>3</answer>
  </qa_pair>
<!-- More qa_pairs... -->
</evaluation>
```

---

### Phase 5: Deploy & Monetize

After your MCP server is built and tested, deploy it for production use. The recommended architecture uses **Composio + Docker MCP Gateway + Privacy.com** for maximum scalability with minimum configuration.

**Load [🌐 Gateway Patterns Guide](./reference/gateway_patterns.md) and [💰 Payment & Metering Guide](./reference/payment_metering.md) for comprehensive deployment guidance.**

#### 5.1 Choose Your Deployment Path

```
Your MCP server is...
├── For personal/team use only
│   └→ Direct config (.mcp.json) — simplest, no gateway needed
├── One of many servers your agents need
│   └→ Docker MCP Gateway — container isolation + lifecycle management
├── Alongside 500+ SaaS integrations
│   └→ Composio in Docker Gateway — discovery + OAuth for everything
└── A paid service others will consume
    └→ Gateway + Stripe metered billing — usage-based revenue
```

#### 5.2 Recommended Stack: Composio + Docker + Privacy.com

This is the primary recommended architecture for managing many MCP servers:

```
Agent
  └→ Docker MCP Gateway (isolation + lifecycle)
       ├→ Composio MCP Server (discovery + OAuth for 500+ SaaS tools)
       │    └→ Privacy.com virtual card (scoped payment per service)
       └→ Your custom MCP server (runs alongside Composio)
```

**Setup:**
```bash
# Enable your server and Composio in the Docker Gateway
docker mcp server enable composio
docker mcp server enable your-custom-server

# Connect to your AI client
docker mcp client connect claude-code

# Start the gateway
docker mcp gateway run
```

**Why this stack:**
- **Composio** handles OAuth for 500+ SaaS integrations — no per-service config
- **Docker Gateway** provides container isolation, lifecycle management, credential injection
- **Privacy.com** virtual cards give per-service spend limits — pause or kill cards after use
- Your custom MCP servers run alongside Composio for internal/proprietary tools
- Agents use `mcp-find` / `mcp-add` to dynamically discover and load tools (~98% token savings)

#### 5.3 Containerize Your Server

Package your MCP server as a Docker container for the gateway:

**Python:**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "print('ok')"
CMD ["python", "server.py"]
```

**Node/TypeScript:**
```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json .
RUN npm ci --production
COPY dist/ ./dist/
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "console.log('ok')"
CMD ["node", "dist/index.js"]
```

**Key requirements for gateway compatibility:**
- Read credentials from environment variables (gateway injects them)
- Respond to health checks within 5 seconds
- Handle SIGTERM for graceful shutdown
- Design tools to be stateless (no required call ordering)

#### 5.4 Set Up Payment Controls

**For services your server consumes (downstream costs):**
- Create a Privacy.com virtual card per external API
- Set spending limits per card (e.g., $5/month for a data API)
- Pause or close cards when not in use
- International alternative: Revolut virtual cards, Stripe Issuing

**For charging others to use your server (upstream revenue):**
- Integrate Stripe metered billing via your metering middleware
- Choose a billing model: per-call, per-token, credit-based, or subscription
- Set up budget alerting (50% → info, 75% → warning, 90% → alert, 100% → hard stop)

**For routing LLM costs across providers:**
- Use OpenRouter for unified billing across Anthropic, OpenAI, Google
- Route simple tasks to cheap models (Haiku), complex tasks to expensive models (Opus)
- Single API key, one bill, automatic fallback

See [💰 Payment & Metering Guide](./reference/payment_metering.md) for complete code examples.

#### 5.5 Verify Production Deployment

1. **Gateway test**: `docker mcp server list` shows your server enabled
2. **Discovery test**: Agent can find your server via `mcp-find`
3. **Load test**: Agent can dynamically add your server via `mcp-add`
4. **Tool execution test**: All tools return correct results through the gateway
5. **Auth test**: Credentials are injected correctly, no hardcoded secrets
6. **Payment test**: Metering records usage, billing events fire, budgets enforce
7. **Shutdown test**: `docker mcp server disable your-server` stops cleanly

---

# Reference Files

## 📚 Documentation Library

Load these resources as needed during development:

### Core MCP Documentation (Load First)
- **MCP Protocol**: Fetch from `https://modelcontextprotocol.io/llms-full.txt` - Complete MCP specification
- [📋 MCP Best Practices](./reference/mcp_best_practices.md) - Universal MCP guidelines including:
  - Server and tool naming conventions
  - Response format guidelines (JSON vs Markdown)
  - Pagination best practices
  - Character limits and truncation strategies
  - Context window budget rules
  - Tool development guidelines
  - Security and error handling standards
  - Gateway compatibility requirements

### SDK Documentation (Load During Phase 1/2)
- **Python SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **TypeScript SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### Language-Specific Implementation Guides (Load During Phase 2)
- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Complete Python/FastMCP guide with:
  - Server initialization patterns
  - Pydantic model examples
  - Tool registration with `@mcp.tool`
  - Complete working examples
  - Quality checklist

- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Complete TypeScript guide with:
  - Project structure
  - Zod schema patterns
  - Tool registration with `server.registerTool`
  - Complete working examples
  - Quality checklist

### Evaluation Guide (Load During Phase 4)
- [✅ Evaluation Guide](./reference/evaluation.md) - Complete evaluation creation guide with:
  - Question creation guidelines
  - Answer verification strategies
  - XML format specifications
  - Example questions and answers
  - Running an evaluation with the provided scripts

### Deployment & Operations Guides (Load During Phase 5)
- [🌐 Gateway Patterns](./reference/gateway_patterns.md) - MCP Gateway architecture including:
  - Composio + Docker + Privacy.com recommended stack
  - Primordial tools pattern (mcp-find, mcp-add)
  - Virtual MCP Servers (vMCPs) for team scoping
  - API virtualization (OpenAPI → MCP)
  - Centralized authentication (two-hop problem)
  - Gateway decision tree and comparison table

- [💰 Payment & Metering](./reference/payment_metering.md) - Cost management including:
  - Privacy.com virtual cards for per-service spend control
  - Stripe metered billing for monetizing your server
  - OpenRouter for unified LLM cost routing
  - Hierarchical financial guardrails (user → team → global)
  - Semantic caching and model routing
  - x402 micropayments and agentic commerce
  - Credit wallet systems and budget alerting

- [📊 Context Optimization](./reference/context_optimization.md) - Token management including:
  - Code Mode pattern (90-98% token reduction)
  - Tool description optimization rules
  - Tool consolidation patterns
  - RAG-MCP vector-based tool selection
  - Claude Code tool search compatibility
  - Sub-agent routing architecture
  - Context budget planning template
