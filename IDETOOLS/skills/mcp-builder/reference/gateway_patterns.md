# ©2026 Brad Scheller

# MCP Gateway Patterns

## Overview

As MCP servers multiply, managing them individually becomes unsustainable. Gateways solve the N×M problem: every agent needs a connection to every tool, creating exponential complexity. Without a gateway, 5 agents accessing 10 servers requires 50 separate connection configurations. With a gateway, 5 agents connect to 1 gateway, which manages the 10 servers centrally.

Gateways provide:
- **Centralized routing**: Single connection point for all MCP servers
- **Credential management**: OAuth tokens, API keys, service accounts
- **Lifecycle control**: Start servers on demand, tear down when idle
- **Context optimization**: Load tools dynamically instead of all at once
- **Security boundaries**: Isolation, rate limiting, audit logging

This document focuses on the **primary recommended architecture**: Composio running as an MCP server inside Docker MCP Gateway, with Privacy.com virtual cards for payment scoping.

## The Context Bloat Problem

Before gateways, every MCP server's tool definitions loaded into the agent's context window at startup. The math is brutal:

- 5 servers × 30 tools = 150 tool definitions
- Each tool definition: ~200-400 tokens (name, description, parameters, examples)
- Total overhead: **30,000-60,000 tokens** before any actual work begins

Real-world measurement: 4 MCP servers connected to Claude Code consumed **~67,000 tokens** of context just from tool definitions.

### Platform Limits Hit Fast

| Platform | Max Tools | Real Capacity with 4-5 Servers |
|----------|-----------|--------------------------------|
| Cursor   | ~80 tools | 2-3 servers max                |
| OpenAI Assistants | 128 tools | 3-4 servers max         |
| Claude Desktop | ~120 tools | 3-4 servers max            |
| Claude Code | ~120 tools | 3-4 servers max               |

### What Happens When You Exceed Limits

1. **Reasoning degradation**: Model spends tokens managing tools instead of solving the task
2. **Cost increase**: 2-3× token consumption just from overhead
3. **Tool selection failures**: Model picks wrong tools or hallucinates tool names
4. **Context pressure**: Less room for actual work (code, specs, data)
5. **Slower responses**: More tokens to process per turn

Example: A developer using Claude Desktop with Supabase, Stripe, GitHub, and Slack MCP servers hit context limits before even starting a task. The solution? Gateway-based dynamic loading.

## Recommended Architecture: Composio + Docker + Privacy.com

This is the **primary recommended stack** for managing many MCP servers. It balances ease of setup, security, and cost control.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  AI Agent (Claude Code, Cursor, OpenAI)                     │
│  - Uses 2 primordial tools: mcp-find, mcp-add               │
│  - Context: ~500 tokens (not 60,000)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Docker MCP Gateway                                          │
│  - Container isolation per server                            │
│  - Credential injection at runtime                           │
│  - Lifecycle management (start on demand, teardown idle)     │
│  - Security policies (rate limits, spend caps)               │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌────────────────────────┐    ┌──────────────────────────┐
│  Composio MCP Server   │    │  Custom MCP Servers      │
│  - 500+ SaaS tools     │    │  - Internal APIs         │
│  - Managed OAuth       │    │  - Proprietary tools     │
│  - Tool discovery      │    │  - Database connectors   │
└────────┬───────────────┘    └──────────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Privacy.com           │
│  - Virtual card per    │
│    service             │
│  - Spend limits        │
│  - Pause/kill card     │
│    after use           │
└────────────────────────┘
```

### Why This Stack

**Composio** handles OAuth for 500+ integrations (Slack, GitHub, Salesforce, Jira, HubSpot, Stripe, AWS, etc.). You don't configure OAuth flows for each service—Composio manages tokens, refresh logic, and multi-tenancy.

**Docker MCP Gateway** provides:
- Container isolation: Each server runs in its own container
- Lifecycle management: Servers start on first request, stop when idle
- Credential injection: API keys and OAuth tokens injected at runtime (never in code)
- Security policies: Rate limits, spend caps, tool allowlists

**Privacy.com virtual cards** give per-service spend control:
- Create a card with a $5/month limit for a data API
- Assign the card to a specific MCP server or service
- Pause or close the card after the transaction completes
- Prevents runaway charges from agent loops or bugs
- Alternative for non-US: Revolut virtual cards, Stripe Issuing, wise.com virtual cards

**Custom MCP servers** run alongside Composio for internal/proprietary tools that aren't in the Composio catalog.

### The Agent Flow

1. **Discover**: Agent calls `mcp-find("send Slack messages")` → Composio catalog returns `slack` server metadata
2. **Load**: Agent calls `mcp-add("slack")` → Gateway starts Composio, loads Slack integration tools
3. **Authenticate**: Gateway retrieves stored OAuth token for Slack (two-hop auth handled transparently)
4. **Scope payment**: If the service requires payment (e.g., paid Slack workspace API), assign a Privacy.com card with spend limit
5. **Execute**: Agent calls `slack_send_message(channel, text)` → Gateway routes to Composio → Composio calls Slack API with stored token
6. **Teardown**: After idle timeout, Gateway stops the Slack server container
7. **Close**: If the task is complete, pause or close the Privacy.com card

### Setting Up Docker MCP Gateway

#### Install the Gateway

```bash
# Download the Docker MCP CLI plugin from:
# https://github.com/docker/mcp-gateway/releases
# (Windows: docker-mcp-windows-amd64.exe → rename to docker-mcp.exe)

# Linux/macOS
curl -L https://github.com/docker/mcp-gateway/releases/latest/download/docker-mcp-$(uname -s)-$(uname -m) -o docker-mcp
chmod +x docker-mcp
sudo mv docker-mcp /usr/local/bin/

# Verify installation
docker mcp version
```

#### Configure Servers

```yaml
# ~/.docker/mcp/config.yaml
servers:
  composio:
    image: composio/mcp-server:latest
    env:
      COMPOSIO_API_KEY: ${COMPOSIO_API_KEY}
    healthcheck:
      path: /health
      interval: 30s
    idle_timeout: 300s  # Stop after 5 min idle

  your-custom-server:
    image: your-org/custom-mcp-server:latest
    env:
      DATABASE_URL: ${DATABASE_URL}
      API_KEY: ${CUSTOM_API_KEY}
    volumes:
      - ./data:/data
    ports:
      - "8080:8080"
    healthcheck:
      path: /health
      interval: 30s
    idle_timeout: 600s  # Stop after 10 min idle

clients:
  claude-code:
    allowed_servers:
      - composio
      - your-custom-server
    security:
      rate_limit: 100/minute
      max_parallel_requests: 10
```

#### Enable and Connect

```bash
# Enable servers (makes them available to the gateway)
docker mcp server enable composio
docker mcp server enable your-custom-server

# Verify servers are registered
docker mcp server list
# Output:
# NAME                STATUS    IMAGE
# composio            enabled   composio/mcp-server:latest
# your-custom-server  enabled   your-org/custom-mcp-server:latest

# Connect your AI client
docker mcp client connect claude-code

# Start the gateway
docker mcp gateway run

# Gateway logs:
# [INFO] Gateway started on port 3000
# [INFO] Client 'claude-code' connected
# [INFO] Primordial tools exposed: mcp-find, mcp-add
```

#### Gateway Lifecycle Walkthrough

1. **Agent starts**: Context contains only 2 tools (`mcp-find`, `mcp-add`), ~500 tokens
2. **Tool request arrives**: `mcp-add("slack")`
3. **Gateway checks**: Is `composio` server running? No.
4. **Container start**: `docker run composio/mcp-server:latest` with env vars injected
5. **Health check**: Gateway polls `/health` endpoint until 200 OK
6. **Credential injection**: Gateway injects `COMPOSIO_API_KEY` and any stored OAuth tokens
7. **Security policies applied**: Rate limit 100/min, max 10 parallel requests
8. **Tool registration**: Composio's Slack tools (30-50 tools) now available to the agent
9. **Request forwarded**: Agent calls `slack_send_message` → Gateway routes to Composio container
10. **Composio executes**: Retrieves stored OAuth token for Slack, calls Slack API
11. **Response returned**: Gateway forwards response to agent
12. **Idle timeout**: After 5 min (configurable) with no requests, Gateway stops the container
13. **Context cleanup**: Slack tools removed from agent context

### Adding Composio as a Server

Composio provides **500+ pre-built SaaS integrations**. It's the fastest way to connect agents to common tools without writing custom MCP servers.

#### What Composio Provides

- **Managed OAuth**: Handles the "two-hop" authentication problem (see Centralized Authentication section)
- **Tool discovery**: Catalog API returns metadata for all supported integrations
- **Multi-tenancy**: Each user gets their own isolated credential storage
- **Pre-built integrations**: Slack, GitHub, Salesforce, Jira, HubSpot, Stripe, AWS, Google Workspace, etc.
- **Automatic token refresh**: Composio handles OAuth token expiration and renewal
- **Unified interface**: All integrations exposed as MCP tools with consistent naming

#### Install Composio

```bash
# Install Composio CLI
npm install -g composio-core

# Or with pip
pip install composio-core

# Login (creates account if needed)
composio login

# Get your API key
composio whoami
# Output includes: COMPOSIO_API_KEY=comp_xxxxxxxxxxxx
```

#### Configure Composio in Docker Gateway

```yaml
# ~/.docker/mcp/config.yaml
servers:
  composio:
    image: composio/mcp-server:latest
    env:
      COMPOSIO_API_KEY: ${COMPOSIO_API_KEY}
      # Optional: Pre-load specific integrations
      COMPOSIO_PRELOAD: "slack,github,jira"
    healthcheck:
      path: /health
      interval: 30s
    idle_timeout: 300s
    restart_policy: unless-stopped

clients:
  claude-code:
    allowed_servers:
      - composio
    security:
      tool_allowlist:
        - "slack_*"      # Allow all Slack tools
        - "github_*"     # Allow all GitHub tools
        - "jira_*"       # Allow all Jira tools
```

#### Authenticate an Integration

```bash
# Authenticate Slack (opens browser for OAuth)
composio add slack

# Authenticate GitHub
composio add github

# Authenticate Jira
composio add jira

# List connected integrations
composio apps
# Output:
# APP       STATUS      CONNECTED_AT
# slack     connected   2026-02-14 10:30:00
# github    connected   2026-02-14 10:31:00
# jira      connected   2026-02-14 10:32:00
```

When the agent requests a Slack action, Composio retrieves the stored OAuth token and makes the API call. The agent never sees credentials.

#### Agent Usage

```python
# Agent context (after mcp-add("slack")):
# Available tools:
# - slack_send_message(channel, text, thread_ts=None)
# - slack_list_channels()
# - slack_get_channel_history(channel, limit=100)
# - slack_upload_file(channel, file_path, title=None)
# ... (30+ more Slack tools)

# Agent calls:
result = slack_send_message(
    channel="#engineering",
    text="Deployment complete. Build #1234 is live."
)
```

Composio handles:
- OAuth token retrieval
- API request formatting
- Rate limiting (Slack's tier limits)
- Error handling (token expiration, network failures)
- Response parsing

### Connecting Privacy.com for Payment

Many SaaS tools require payment (API usage, premium tiers, third-party data). Giving agents access to your main credit card is risky—runaway loops can rack up charges. **Virtual cards with spend limits** are the solution.

#### Why Privacy.com?

- **Free tier**: 12 cards/month, $1,500 total spending
- **Per-card limits**: Set daily, monthly, or per-transaction caps
- **Instant creation**: API or web UI, cards ready in seconds
- **Pause/close anytime**: Stop charges immediately
- **Transaction alerts**: Email/SMS when card is used
- **US-based**: Works with most US-based services

#### The Pattern

1. **Create a scoped card**: $5/month limit for a data enrichment API
2. **Assign to service**: Use the card only for that specific MCP server/integration
3. **Agent executes**: Composio (or custom server) uses the card for API calls
4. **Monitor spend**: Privacy.com dashboard shows real-time usage
5. **Close after task**: Pause or delete the card when the task completes

#### Example: Scoped Card for Clearbit API

```bash
# Create a Privacy.com virtual card via CLI (unofficial wrapper)
# Or use the web UI at privacy.com

# Card details:
# - Name: "Clearbit API - Agent Task #1234"
# - Limit: $10/month
# - Type: Merchant-locked (only works with clearbit.com)
# - Expiration: 1 month (auto-close after)

# Add to Composio integration
composio add clearbit
# When prompted for payment method, enter the Privacy.com card number

# Configure in Docker Gateway
# ~/.docker/mcp/config.yaml
servers:
  composio:
    env:
      COMPOSIO_API_KEY: ${COMPOSIO_API_KEY}
      # Store card metadata (not the number itself)
      CLEARBIT_CARD_NAME: "Clearbit API - Agent Task #1234"
      CLEARBIT_SPEND_LIMIT: "10"  # USD/month
```

#### Monitoring and Teardown

```bash
# Check spend (Privacy.com CLI or API)
curl -H "Authorization: Bearer ${PRIVACY_API_KEY}" \
  https://api.privacy.com/v1/transactions?card_id=card_xxxxx

# Output:
# [
#   {"amount": 0.50, "merchant": "clearbit.com", "timestamp": "2026-02-14T10:45:00Z"},
#   {"amount": 1.20, "merchant": "clearbit.com", "timestamp": "2026-02-14T11:30:00Z"}
# ]

# After task completes, pause the card
curl -X PATCH -H "Authorization: Bearer ${PRIVACY_API_KEY}" \
  https://api.privacy.com/v1/cards/card_xxxxx \
  -d '{"state": "PAUSED"}'

# Or close it permanently
curl -X PATCH -H "Authorization: Bearer ${PRIVACY_API_KEY}" \
  https://api.privacy.com/v1/cards/card_xxxxx \
  -d '{"state": "CLOSED"}'
```

#### Non-US Alternatives

| Service | Region | Features | Pricing |
|---------|--------|----------|---------|
| Revolut | EU, UK, US | Virtual cards, spend limits, instant freeze | Free tier: 5 cards |
| Wise (formerly TransferWise) | Global | Multi-currency cards, spend controls | $9/month |
| Stripe Issuing | Global (via platform) | API-first, programmatic card creation | $0.10/card + interchange |
| Brex | US | Business cards, spend policies | Free for businesses |

For enterprise deployments, **Stripe Issuing** is recommended: full API control, webhook events for every transaction, and integration with accounting systems.

## The Primordial Tools Pattern

Instead of loading all tool definitions (thousands of tokens) at startup, the gateway exposes just **2 bootstrap tools**. The agent uses these to discover and load tools on demand.

### mcp-find

**Purpose**: Search the catalog of available MCP servers by name or description.

**Returns**: Metadata only (not full tool definitions), saving ~450 tokens per result.

**Token cost**: ~50 tokens per search result vs ~500 tokens per full tool definition.

#### Tool Definition

```json
{
  "name": "mcp-find",
  "description": "Search for available MCP servers by name, category, or description. Returns metadata about matching servers. Use this before mcp-add to discover what's available.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query (e.g., 'Slack', 'database', 'payment processing')"
      },
      "category": {
        "type": "string",
        "enum": ["communication", "storage", "analytics", "automation", "development", "finance", "all"],
        "description": "Filter by category"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "Maximum results to return"
      }
    },
    "required": ["query"]
  }
}
```

#### Example Usage

```javascript
// Agent calls:
mcp-find({ query: "send Slack messages", category: "communication", limit: 5 })

// Gateway returns:
{
  "results": [
    {
      "server_id": "slack",
      "name": "Slack",
      "description": "Send messages, upload files, manage channels in Slack workspaces",
      "provider": "composio",
      "category": "communication",
      "tool_count": 47,
      "auth_type": "oauth2",
      "estimated_tokens": 8200  // If all tools loaded
    },
    {
      "server_id": "discord",
      "name": "Discord",
      "description": "Bot actions for Discord servers",
      "provider": "composio",
      "category": "communication",
      "tool_count": 32,
      "auth_type": "bot_token",
      "estimated_tokens": 5800
    }
  ],
  "total": 2,
  "tokens_saved": 13500  // vs loading both servers' tools upfront
}
```

### mcp-add

**Purpose**: Dynamically load an MCP server into the current session.

**Effect**: Starts the container (if not running), injects credentials, registers tools into the agent's context.

**Token cost**: Only the loaded server's tools enter the context window (not all servers).

#### Tool Definition

```json
{
  "name": "mcp-add",
  "description": "Load an MCP server and its tools into the current session. Use mcp-find first to discover available servers. Loading a server adds its tools to your context.",
  "parameters": {
    "type": "object",
    "properties": {
      "server_id": {
        "type": "string",
        "description": "Server identifier from mcp-find results"
      },
      "config": {
        "type": "object",
        "description": "Optional runtime configuration (e.g., specific workspace, database name)",
        "properties": {
          "workspace_id": { "type": "string" },
          "database": { "type": "string" },
          "region": { "type": "string" }
        }
      }
    },
    "required": ["server_id"]
  }
}
```

#### Example Usage

```javascript
// Agent calls:
mcp-add({ server_id: "slack", config: { workspace_id: "T01234567" } })

// Gateway response:
{
  "server_id": "slack",
  "status": "loaded",
  "container_id": "a3f9d8c2b1e0",
  "tools_added": 47,
  "estimated_tokens_added": 8200,
  "auth_status": "authenticated",
  "health": "healthy"
}

// Agent's context now includes 47 Slack tools:
// - slack_send_message(...)
// - slack_list_channels(...)
// - slack_upload_file(...)
// ... etc
```

### Token Savings Calculation

**Without gateway** (traditional all-at-once loading):

```
5 servers × 30 tools/server = 150 tools
150 tools × 200 tokens/tool = 30,000 tokens overhead
```

**With primordial tools** (load on demand):

```
2 primordial tools × 250 tokens/tool = 500 tokens overhead
Agent loads 1 server when needed: +8,000 tokens
Total first-turn cost: 8,500 tokens (vs 30,000)
Reduction: 72%

If agent only needs 1-2 servers per session:
Average overhead: ~10,000 tokens (vs 30,000)
Reduction: 67%
```

**Real-world measurement**: Developer using Composio gateway with 12 available servers. Without primordial tools, startup cost was 78,000 tokens. With primordial tools, startup cost dropped to 500 tokens, and average session used 3 servers (~15,000 tokens total). **Savings: 80%**.

### Implementation Notes

- **Catalog indexing**: Gateway maintains a searchable index of all available servers (updated when servers register)
- **Fuzzy matching**: `mcp-find` supports partial matches ("slack" finds "Slack" and "Slack App")
- **Tool unloading**: Some gateways support `mcp-remove(server_id)` to free context mid-session
- **Pre-warming**: Frequently used servers can be kept warm (container running but tools not loaded) for faster `mcp-add`

## Virtual MCP Servers (vMCPs)

A **virtual MCP server** is a role-scoped view of available tools. Instead of exposing all 500 Composio integrations to every agent, the gateway creates subsets based on team, project, or security policy.

### Team Scoping Examples

#### Platform Team vMCP

**Tools exposed**: AWS, Datadog, PagerDuty, Kubernetes, Terraform, GitHub (infra repos only)

**Use case**: On-call engineers responding to incidents, deploying infrastructure changes

```yaml
# ~/.docker/mcp/vmcp-config.yaml
virtual_servers:
  platform-team:
    description: "Tools for platform engineering and ops"
    base_servers:
      - aws
      - datadog
      - pagerduty
      - kubernetes
      - terraform
    tool_filters:
      github:
        allowed_repos:
          - "org/infrastructure"
          - "org/terraform-modules"
          - "org/k8s-configs"
    security:
      require_approval_for:
        - "aws_ec2_terminate_instance"
        - "kubernetes_delete_namespace"
      rate_limit: 200/minute
```

#### Marketing Team vMCP

**Tools exposed**: Salesforce, HubSpot, Slack, Google Analytics, Figma, CMS

**Use case**: Marketing automation, campaign analytics, content updates

```yaml
virtual_servers:
  marketing-team:
    description: "Tools for marketing and growth"
    base_servers:
      - salesforce
      - hubspot
      - slack
      - google-analytics
      - figma
      - contentful
    tool_filters:
      slack:
        allowed_channels:
          - "#marketing"
          - "#growth"
          - "#campaigns"
    security:
      rate_limit: 50/minute
      max_spend: 20  # USD/day via Privacy.com cards
```

#### Developer vMCP

**Tools exposed**: GitHub, Jira, Sentry, CircleCI, Vercel, npm, Docker Hub

**Use case**: Software development, CI/CD, debugging

```yaml
virtual_servers:
  developer-team:
    description: "Tools for software development"
    base_servers:
      - github
      - jira
      - sentry
      - circleci
      - vercel
      - npm
      - docker-hub
    tool_filters:
      github:
        allowed_orgs:
          - "your-company"
        disallowed_repos:
          - "*/sensitive-data"
    security:
      rate_limit: 100/minute
```

#### Student vMCP

**Tools exposed**: Free-tier tools only, with spend caps

**Use case**: Educational environments, hackathons, demos

```yaml
virtual_servers:
  student:
    description: "Limited free-tier tools for students"
    base_servers:
      - github
      - vercel
      - render
      - supabase
    tool_filters:
      all:
        free_tier_only: true
    security:
      rate_limit: 20/minute
      max_spend: 0  # No paid API calls
      require_approval_for:
        - "*_delete_*"
        - "*_update_*"
```

### Benefits of vMCPs

1. **Prevents context bloat**: Agents only see tools relevant to their role (not 500 tools)
2. **Enforces least-privilege access**: Marketing team can't deploy infrastructure
3. **Simplifies onboarding**: New team members get pre-configured tool access
4. **Different teams, same gateway**: No need to run separate gateway instances
5. **Dynamic switching**: Agent can switch vMCPs mid-session if authorized

### Agent Connection

```bash
# Connect agent to a specific vMCP
docker mcp client connect claude-code --virtual-server platform-team

# Or in code:
export MCP_VIRTUAL_SERVER=platform-team
claude-code
```

When the agent calls `mcp-find`, it only sees tools from the `platform-team` vMCP.

## API Virtualization (OpenAPI → MCP)

Many organizations have existing REST or gRPC APIs that don't have native MCP servers. **API virtualization** tools generate MCP tool definitions automatically from API specs.

### IBM ContextForge

**What it does**: Ingests OpenAPI/Swagger specs and presents them as MCP tools.

**Best for**: Complex multi-team environments with existing API infrastructure.

#### Architecture

```
Internal REST API
  ├─ OpenAPI spec (swagger.json)
  └─ ContextForge ingests spec
       └─ Generates MCP tool definitions
            └─ Exposes via Docker MCP Gateway
                 └─ Agents call as native MCP tools
```

#### Setup

```bash
# Install ContextForge
docker pull icr.io/contextforge/server:latest

# Run ContextForge
docker run -d \
  -p 3001:3001 \
  -v ./openapi-specs:/specs \
  -e CONTEXTFORGE_SPECS_DIR=/specs \
  icr.io/contextforge/server:latest

# Point it at your OpenAPI spec
curl -X POST http://localhost:3001/api/v1/specs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "internal-api",
    "url": "https://api.yourcompany.com/openapi.json"
  }'

# ContextForge generates MCP tools:
# - internal_api_get_users()
# - internal_api_create_user(name, email)
# - internal_api_delete_user(user_id)
# ... etc
```

#### Add to Docker Gateway

```yaml
# ~/.docker/mcp/config.yaml
servers:
  internal-api:
    image: icr.io/contextforge/server:latest
    env:
      CONTEXTFORGE_API_URL: "https://api.yourcompany.com"
      CONTEXTFORGE_AUTH_HEADER: "Authorization: Bearer ${INTERNAL_API_KEY}"
    volumes:
      - ./openapi-specs:/specs
    healthcheck:
      path: /health
      interval: 30s
```

Now agents can call your internal API as if it were a native MCP server.

#### gRPC Support

ContextForge also translates gRPC services via server reflection:

```bash
# Enable gRPC reflection in your service
# (most frameworks support this: Go grpc-go, Python grpcio, etc.)

# Point ContextForge at your gRPC service
curl -X POST http://localhost:3001/api/v1/grpc-services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user-service",
    "endpoint": "grpc://user-service.yourcompany.com:50051"
  }'

# ContextForge generates MCP tools from gRPC methods:
# - user_service_GetUser(user_id)
# - user_service_CreateUser(request)
# - user_service_ListUsers(page_size, page_token)
```

#### Federation

ContextForge supports **federation**: multiple ContextForge instances discover each other's APIs.

```yaml
# ContextForge config
federation:
  enabled: true
  peers:
    - url: "http://team-a-contextforge:3001"
      trust_level: "full"
    - url: "http://team-b-contextforge:3001"
      trust_level: "read_only"
```

Now Team A's agents can discover and call Team B's APIs (if authorized).

### Azure API Management (APIM)

**What it does**: Exposes Azure-managed REST APIs directly as MCP servers.

**Best for**: Microsoft ecosystem shops, Azure-native architectures.

#### Setup

```bash
# Create an APIM instance (via Azure Portal or CLI)
az apim create \
  --name your-apim \
  --resource-group your-rg \
  --publisher-email admin@yourcompany.com \
  --publisher-name "Your Company"

# Import your API
az apim api import \
  --path /api/v1 \
  --api-id internal-api \
  --specification-format OpenApiJson \
  --specification-url https://api.yourcompany.com/openapi.json \
  --resource-group your-rg \
  --service-name your-apim

# Enable MCP gateway (Azure APIM plugin)
az apim api update \
  --api-id internal-api \
  --set properties.protocols=mcp \
  --resource-group your-rg \
  --service-name your-apim
```

Azure APIM now exposes your API as an MCP server at:
```
mcp://your-apim.azure-api.net/internal-api
```

#### Governance Policies

Azure APIM provides built-in policies for MCP servers:

```xml
<!-- APIM policy for rate limiting -->
<policies>
  <inbound>
    <rate-limit calls="100" renewal-period="60" />
    <quota calls="10000" renewal-period="86400" />
    <authentication-managed-identity resource="https://api.yourcompany.com" />
  </inbound>
</policies>
```

### The Pattern (Conceptual Flow)

1. **You have an existing REST API** with an OpenAPI spec (Swagger)
2. **Point ContextForge (or Azure APIM) at the spec**
3. **Gateway generates MCP tool definitions automatically**
   - Each endpoint becomes a tool
   - Parameters map to tool arguments
   - Response schemas documented in tool descriptions
4. **Your agents can now call it as if it were a native MCP server**
   - No custom code required
   - Authentication handled by gateway
   - Rate limiting and governance via policies

#### Example: Stripe API → MCP

```bash
# Stripe provides an OpenAPI spec
curl -o stripe-openapi.json https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json

# Load into ContextForge
curl -X POST http://localhost:3001/api/v1/specs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "stripe",
    "spec_path": "/specs/stripe-openapi.json"
  }'

# ContextForge generates 200+ MCP tools:
# - stripe_create_customer(email, name, metadata)
# - stripe_create_payment_intent(amount, currency, customer)
# - stripe_create_subscription(customer, price_id)
# - stripe_list_invoices(customer, limit)
# ... etc

# Add to Docker Gateway
# (see config.yaml examples above)

# Agent usage:
customer = stripe_create_customer(
  email="user@example.com",
  name="Jane Doe"
)

payment_intent = stripe_create_payment_intent(
  amount=5000,  # $50.00 in cents
  currency="usd",
  customer=customer.id
)
```

No custom MCP server code required—ContextForge handled the entire translation from OpenAPI → MCP.

## Centralized Authentication (The "Two-Hop" Problem)

### The Problem

**Hop 1**: Agent authenticates with the Gateway (e.g., API key, OAuth token)

**Hop 2**: Gateway must authenticate with the downstream service (e.g., Slack OAuth, AWS credentials)

Without centralized auth, you'd need to:
- Store 50+ sets of credentials (one per service)
- Handle OAuth flows manually for each service
- Manage token refresh logic
- Secure credential storage (encryption at rest, access control)
- Audit who accessed which credentials when

This is a nightmare at scale.

### The Solution

Gateways like **Composio** and **MintMCP** store user-specific OAuth tokens in a secure vault. When an agent requests an action:

1. **Agent authenticates with gateway**: Sends API key or JWT
2. **Gateway identifies user**: Maps API key to user account
3. **Request includes service identifier**: "Call Slack API"
4. **Gateway looks up user's Slack OAuth token**: Retrieved from encrypted storage
5. **Gateway injects token**: Makes API call with user's token
6. **Agent never sees credentials**: Response returned, token stays in gateway

#### Architecture

```
Agent
  └─ Authenticates with Gateway (API key: gw_abc123)
       └─ Gateway maps key → User ID: user_xyz
            └─ Request: "Send Slack message"
                 └─ Gateway retrieves user_xyz's Slack OAuth token
                      └─ Gateway calls Slack API with token
                           └─ Response returned to agent
                                └─ Token never exposed to agent
```

### MCP OAuth 2.1 Standard

In June 2025, the MCP spec was updated to classify MCP servers as **OAuth Resource Servers**. This means:

- **Clients must implement Resource Indicators** (RFC 8707) to prevent token misuse
- **Tokens are scoped to specific MCP servers** (not reusable across servers)
- **Gateway acts as Authorization Server** (issues tokens, enforces scopes)

#### Token Scoping Example

```http
POST /oauth/token HTTP/1.1
Host: gateway.yourcompany.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=agent_abc123
&client_secret=secret_xyz789
&resource=mcp://slack
&scope=slack_send_message slack_list_channels
```

Gateway response:

```json
{
  "access_token": "gw_token_abc123",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "slack_send_message slack_list_channels",
  "resource": "mcp://slack"
}
```

This token **only works for Slack** and **only for the specified scopes**. If the agent tries to use it for GitHub, the gateway rejects it.

### Implementation in Composio

```javascript
// User authenticates an integration (one-time setup)
// This opens a browser for OAuth consent
composio add slack

// Composio stores the OAuth token securely
// When agent calls a Slack tool:
slack_send_message({ channel: "#general", text: "Hello" })

// Composio flow:
// 1. Receives request from agent
// 2. Identifies user (via agent's API key)
// 3. Retrieves user's Slack token from vault
// 4. Calls Slack API: POST /chat.postMessage with token
// 5. Returns response to agent

// Agent never handles the OAuth token
```

### Security Benefits

- **Credentials never in code**: Tokens stored in gateway, not in agent prompts or logs
- **Per-user isolation**: User A's Slack token can't be used by User B
- **Automatic rotation**: Gateways handle OAuth refresh tokens
- **Audit trail**: Gateway logs which agent accessed which service when
- **Revocation**: Disconnect an integration, gateway immediately stops using the token

### Multi-Tenancy

For SaaS products using MCP servers, gateways provide tenant isolation:

```yaml
# Gateway config for multi-tenant SaaS
tenants:
  tenant_abc:
    user_1:
      slack_token: "xoxb-tenant-abc-user-1"
      github_token: "ghp_tenant-abc-user-1"
    user_2:
      slack_token: "xoxb-tenant-abc-user-2"
      github_token: "ghp_tenant-abc-user-2"

  tenant_xyz:
    user_1:
      slack_token: "xoxb-tenant-xyz-user-1"
      github_token: "ghp_tenant-xyz-user-1"
```

When `tenant_abc`'s `user_1` calls a Slack tool, the gateway uses their specific token. No cross-tenant leakage.

## Gateway Decision Tree

```
How many MCP servers do you need?
│
├─ 1-3 servers
│  └─ Direct config (.mcp.json) — no gateway needed
│     └─ Manual credential management OK at this scale
│
├─ 4-10 servers
│  └─ Docker MCP Gateway (self-hosted, free, open source)
│     └─ Add Composio for SaaS integrations (managed OAuth)
│     └─ Privacy.com cards for spend control
│     └─ Best for: Startups, small teams, prototypes
│
├─ 10-50 servers
│  └─ Bifrost or IBM ContextForge (self-hosted, federation support)
│     └─ Add Composio for OAuth-heavy integrations
│     └─ Privacy.com (or Stripe Issuing) for payment management
│     └─ Best for: Mid-size companies, multi-team orgs
│
└─ 50+ servers or enterprise
   └─ Composio (fully managed) or MintMCP (compliance: SOC 2, HIPAA)
      └─ Full payment infrastructure (Stripe Issuing, budget dashboards)
      └─ SSO integration (Okta, Azure AD)
      └─ Best for: Enterprises, regulated industries, Fortune 500
```

### When NOT to Use a Gateway

**1-3 servers, simple auth, single user/team**: Direct `.mcp.json` config is simpler.

Example `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token"
      }
    }
  }
}
```

At this scale, a gateway adds complexity without benefit.

## Gateway Comparison Table

| Gateway | Type | Best For | Key Feature | Latency | Cost |
|---------|------|----------|-------------|---------|------|
| **Docker MCP Gateway** | Open source | Container-based tools, self-hosted | Lifecycle management, isolation | Low (~10ms) | Free |
| **Composio** | Managed SaaS | SaaS integrations (500+) | OAuth for everything, auto-refresh | Medium (~50ms) | Free tier: 1k requests/mo, Pro: $29/mo |
| **Bifrost** (Maxim AI) | Open source (Go) | Performance-critical, low-latency | Sub-3ms routing, "Code Mode" | Very low (<3ms) | Free |
| **IBM ContextForge** | Open source | Enterprise federation, OpenAPI→MCP | gRPC support, multi-gateway discovery | Medium (~40ms) | Free |
| **MintMCP** | Managed SaaS | Regulated industries (healthcare, finance) | SOC 2, HIPAA, SSO, audit logs | Medium (~60ms) | Enterprise pricing |
| **Azure APIM** | Cloud service | Microsoft ecosystem, Azure-native | Policy-based governance, AAD integration | Medium (~50ms) | $0.10/hour + API calls |

### Feature Comparison

| Feature | Docker Gateway | Composio | Bifrost | ContextForge | MintMCP | Azure APIM |
|---------|----------------|----------|---------|--------------|---------|------------|
| Self-hosted | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Managed OAuth | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Container lifecycle | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| API virtualization | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Federation | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Compliance certs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Free tier | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tool discovery | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Primordial tools | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

### Recommendations by Use Case

**Startups, prototypes, personal projects**: Docker MCP Gateway + Composio + Privacy.com

**Performance-critical (trading, real-time systems)**: Bifrost (sub-3ms latency)

**Large enterprises, federated teams**: IBM ContextForge (federation, OpenAPI support)

**Regulated industries (healthcare, finance)**: MintMCP (SOC 2, HIPAA)

**Microsoft shops**: Azure APIM (native Azure integration, AAD SSO)

## Tool Namespacing for Multi-Server Environments

When running multiple MCP servers, **tool name collisions** are common. Without namespacing, you might have:

- `search` from GitHub (search repos)
- `search` from Slack (search messages)
- `search` from Google Drive (search files)
- `search` from Jira (search issues)

The agent can't differentiate—it will pick one arbitrarily or fail.

### Namespacing Strategies

#### 1. Prefix with Server Name

```
github_search(query, type)
slack_search(query, sort)
gdrive_search(query, folder_id)
jira_search(jql, max_results)
```

**Pros**: Clear ownership, easy to read

**Cons**: Verbose, requires manual naming discipline

#### 2. URI-Based Naming

```
github.com:search(query, type)
slack.com:search(query, sort)
drive.google.com:search(query, folder_id)
atlassian.net:search(jql, max_results)
```

**Pros**: Globally unique, follows web conventions

**Cons**: Requires URI parsing, less readable

#### 3. Category + Action

```
repo_search(query)          # GitHub
message_search(query)       # Slack
file_search(query)          # Google Drive
issue_search(jql)           # Jira
```

**Pros**: Semantic clarity, shorter names

**Cons**: Requires upfront categorization, potential conflicts

### Composio's Approach

Composio **automatically namespaces** all tools by integration:

```javascript
// Composio tool naming:
slack_send_message(...)
slack_list_channels(...)
slack_upload_file(...)

github_create_issue(...)
github_list_repos(...)
github_create_pull_request(...)

jira_create_issue(...)      // No conflict with github_create_issue
jira_search_issues(...)
jira_update_issue(...)
```

Each integration gets its own namespace. The agent sees `slack_send_message`, not a generic `send_message`.

### CRITICAL: Never Create Generic Tool Names

**Bad**:
```
search(...)
get_status(...)
send_message(...)
create_item(...)
```

**Good**:
```
github_search_repos(...)
jira_get_issue_status(...)
slack_send_message(...)
todoist_create_task(...)
```

Generic names cause:
- Tool selection ambiguity (model guesses which `search` to use)
- Debugging nightmares (which server failed?)
- Context pollution (model wastes tokens clarifying which tool)

### Gateway Enforcement

Configure the gateway to **reject** generic tool names:

```yaml
# ~/.docker/mcp/config.yaml
tool_validation:
  disallow_generic_names:
    - "search"
    - "get"
    - "send"
    - "create"
    - "update"
    - "delete"
    - "list"
  require_namespace: true  # All tools must have server prefix
```

If a server registers a tool named `search`, the gateway rejects it and logs an error.

## Troubleshooting

### Gateway Can't Find Server

**Symptom**: `mcp-find` returns empty results, or `mcp-add` fails with "server not found"

**Diagnosis**:

```bash
# Check registered servers
docker mcp server list

# Expected output:
# NAME        STATUS    IMAGE
# composio    enabled   composio/mcp-server:latest
# my-server   enabled   my-org/my-server:latest

# If server is missing, enable it:
docker mcp server enable composio
```

**Common causes**:
- Server not registered in `~/.docker/mcp/config.yaml`
- Server image not pulled (`docker pull composio/mcp-server:latest`)
- Typo in server name

### OAuth Token Expired

**Symptom**: API calls fail with "401 Unauthorized" or "Token expired"

**Diagnosis**:

```bash
# Check token status (Composio example)
composio apps

# Output:
# APP       STATUS      CONNECTED_AT           TOKEN_EXPIRES
# slack     expired     2026-01-14 10:30:00    2026-02-13 10:30:00

# Gateways should auto-refresh, check gateway logs:
docker logs <gateway-container-id>

# Look for:
# [ERROR] Failed to refresh Slack token for user_xyz
# [INFO] Token refresh successful for user_xyz
```

**Fix**:
- If auto-refresh failed, re-authenticate: `composio add slack` (forces OAuth re-consent)
- Check gateway has refresh token stored (some services don't issue refresh tokens)
- Verify gateway has network access to OAuth provider (firewall, DNS)

### Tool Not Appearing in Agent

**Symptom**: `mcp-add` succeeds, but tools don't show up in agent's context

**Diagnosis**:

```bash
# Verify server is running
docker ps | grep composio

# Check server health
curl http://localhost:3000/health

# Verify tools registered
curl http://localhost:3000/api/v1/tools

# Expected: JSON array of tool definitions
# If empty, server started but didn't load tools
```

**Common causes**:
- Server started but tools failed to load (missing credentials)
- Agent's context window full (too many other tools loaded)
- Tool allowlist too restrictive (check `~/.docker/mcp/config.yaml`)

**Fix**:
- Check server logs: `docker logs <server-container-id>`
- Verify credentials injected: `docker exec <container-id> env | grep API_KEY`
- Unload unused servers: `mcp-remove("other-server")` to free context

### Container Keeps Restarting

**Symptom**: `docker ps` shows server container restarting every few seconds

**Diagnosis**:

```bash
# Check restart count
docker ps -a | grep composio
# Output: ... Restarting (1) 3 seconds ago ...

# View logs
docker logs <container-id>

# Look for:
# - Crash on startup (missing env var, bad config)
# - Health check failures
# - Port conflicts
```

**Common causes**:
- Health check endpoint returning non-200 (server not ready)
- Required env var missing (e.g., `COMPOSIO_API_KEY`)
- Port already in use (another server bound to same port)

**Fix**:

```yaml
# Adjust health check (give server more time to start)
servers:
  composio:
    healthcheck:
      path: /health
      interval: 30s
      timeout: 10s        # Increase timeout
      retries: 5          # Allow more retries
      start_period: 60s   # Wait 60s before first check
```

### Context Still Bloated

**Symptom**: Agent's context usage high despite using primordial tools

**Diagnosis**:

```bash
# Check which tools are loaded
# (agent's context inspector, varies by platform)

# Example for Claude Code:
# View Tools panel → shows all registered tools

# Or via gateway API:
curl http://localhost:3000/api/v1/sessions/<session-id>/tools

# If 100+ tools loaded, primordial tools aren't being used
```

**Common causes**:
- Agent not using `mcp-find` / `mcp-add` (loading all servers upfront)
- Gateway configured with `preload: all` (defeats the purpose)
- Client doesn't support dynamic tool loading

**Fix**:

```yaml
# Ensure preload is disabled
servers:
  composio:
    preload: false  # Or remove this line (false is default)

# Verify primordial tools are exposed
clients:
  claude-code:
    primordial_tools:
      enabled: true  # Must be true
```

If your AI client doesn't support dynamic loading, you're stuck with full tool loading. Consider switching to a gateway-aware client (Claude Code, Cursor 0.43+, OpenAI Agents API with MCP plugin).

---

## Summary

**Primary recommended architecture**: Composio (OAuth for 500+ SaaS tools) + Docker MCP Gateway (container lifecycle, credential injection) + Privacy.com (scoped payment per service)

**Key patterns**:
- **Primordial tools** (`mcp-find`, `mcp-add`) reduce context overhead by 70-98%
- **Virtual MCP servers** (vMCPs) provide role-scoped tool access without separate gateway instances
- **API virtualization** (OpenAPI → MCP) lets you expose existing REST/gRPC APIs as MCP tools
- **Centralized auth** solves the two-hop problem (gateway stores OAuth tokens, agents never see credentials)

**When to use a gateway**:
- 4+ MCP servers (context bloat becomes a problem)
- SaaS integrations needing OAuth (Composio handles this)
- Multi-team environments (vMCPs enforce access control)
- Performance-critical systems (Bifrost: sub-3ms latency)
- Regulated industries (MintMCP: SOC 2, HIPAA)

**When NOT to use a gateway**:
- 1-3 servers with simple auth (direct `.mcp.json` config is simpler)

**Next steps**:
1. Install Docker MCP Gateway (free, open source)
2. Add Composio server for SaaS integrations (free tier: 1k requests/mo)
3. Set up Privacy.com virtual cards for spend control
4. Configure vMCPs for team-specific tool access
5. Deploy to agents, measure token savings

For enterprise deployments, consider IBM ContextForge (federation, OpenAPI support) or MintMCP (compliance certifications).
