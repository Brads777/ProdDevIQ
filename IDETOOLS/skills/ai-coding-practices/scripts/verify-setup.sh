#!/bin/bash
# =============================================================================
# Verify Environment Setup
# =============================================================================
# Checks that all tools and configurations from env-setup.sh are properly
# installed. Run this to diagnose issues with the workflow setup.
#
# Usage:
#   ./scripts/verify-setup.sh
# =============================================================================

PASS=0
FAIL=0
WARN=0

check() {
  local label="$1"
  local status="$2"  # pass, fail, warn
  local detail="$3"

  if [ "$status" = "pass" ]; then
    echo "  [PASS] $label"
    PASS=$((PASS + 1))
  elif [ "$status" = "warn" ]; then
    echo "  [WARN] $label — $detail"
    WARN=$((WARN + 1))
  else
    echo "  [FAIL] $label — $detail"
    FAIL=$((FAIL + 1))
  fi
}

echo "============================================"
echo "  Environment Verification"
echo "============================================"
echo ""

# 1. Claude Code CLI
if command -v claude &>/dev/null; then
  check "Claude Code CLI" "pass"
else
  check "Claude Code CLI" "fail" "Not found. Run: npm install -g @anthropic-ai/claude-code"
fi

# 2. Git
if command -v git &>/dev/null; then
  check "Git" "pass"
else
  check "Git" "fail" "Not found. Install git."
fi

# 3. Node.js
if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -ge 18 ]; then
    check "Node.js $(node --version)" "pass"
  else
    check "Node.js $(node --version)" "warn" "Version 18+ recommended"
  fi
else
  check "Node.js" "fail" "Not found. Install Node.js 18+."
fi

# 4. .claude/settings.json
if [ -f ".claude/settings.json" ]; then
  check ".claude/settings.json" "pass"

  # Check for hooks config
  if grep -q '"hooks"' .claude/settings.json 2>/dev/null; then
    check "Hooks configuration" "pass"
  else
    check "Hooks configuration" "warn" "No hooks found in settings.json"
  fi

  # Check for MCP Tool Search
  if grep -q 'ENABLE_TOOL_SEARCH' .claude/settings.json 2>/dev/null; then
    check "MCP Tool Search" "pass"
  else
    check "MCP Tool Search" "warn" "ENABLE_TOOL_SEARCH not set in settings.json"
  fi
else
  check ".claude/settings.json" "fail" "Not found. Copy from template."
fi

# 5. Test protection hook
if [ -f ".claude/hooks/protect-tests.sh" ]; then
  if [ -x ".claude/hooks/protect-tests.sh" ]; then
    check "Test protection hook" "pass"
  else
    check "Test protection hook" "warn" "Not executable. Run: chmod +x .claude/hooks/protect-tests.sh"
  fi
else
  check "Test protection hook" "fail" "Not found at .claude/hooks/protect-tests.sh"
fi

# 6. CLAUDE.md
if [ -f "CLAUDE.md" ]; then
  check "CLAUDE.md" "pass"
else
  check "CLAUDE.md" "fail" "Not found. Copy from template."
fi

# 7. Templates directory
if [ -d "templates" ] && [ "$(ls -A templates/ 2>/dev/null)" ]; then
  TEMPLATE_COUNT=$(ls templates/*.md 2>/dev/null | wc -l | tr -d ' ')
  check "Templates ($TEMPLATE_COUNT files)" "pass"
else
  check "Templates" "fail" "Directory missing or empty"
fi

# 8. Docs directory
if [ -d "docs" ] && [ "$(ls -A docs/ 2>/dev/null)" ]; then
  check "docs/ directory" "pass"
else
  check "docs/ directory" "warn" "Empty — this is expected for new projects. Run templates/context-generation-prompt.md to generate your docs."
fi

# 9. Agent Browser (optional)
if command -v agent-browser &>/dev/null; then
  check "Agent Browser" "pass"
else
  check "Agent Browser" "warn" "Not installed. Optional but recommended for UI verification."
fi

# 10. Context7 MCP (check if configured)
if command -v claude &>/dev/null; then
  if claude mcp list 2>/dev/null | grep -q "context7"; then
    check "Context7 MCP" "pass"
  else
    check "Context7 MCP" "warn" "Not configured. Run: claude mcp add context7 -- npx -y @upstash/context7-mcp"
  fi
else
  check "Context7 MCP" "warn" "Cannot verify (Claude Code not installed)"
fi

echo ""
echo "============================================"
echo "  Results: $PASS passed, $FAIL failed, $WARN warnings"
echo "============================================"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Run env-setup.sh to fix failed checks:"
  echo "  chmod +x env-setup.sh && ./env-setup.sh"
  exit 1
fi
