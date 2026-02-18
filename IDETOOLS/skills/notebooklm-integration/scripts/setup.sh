#!/usr/bin/env bash
set -euo pipefail

echo "========================================="
echo "  NotebookLM Resource Kit - Setup"
echo "========================================="
echo ""

PASS=0
FAIL=0

# Step 1: Check nlm
echo "1. Checking nlm CLI..."
if command -v nlm &>/dev/null; then
  NLM_VERSION=$(nlm --version 2>/dev/null || echo "unknown")
  echo "   OK: nlm found ($NLM_VERSION)"
  ((PASS++))
else
  echo "   MISSING: nlm not found"
  echo "   Install: uv tool install notebooklm-mcp-cli (or pip install notebooklm-mcp-cli)"
  echo "   Repo: https://github.com/jacob-bd/notebooklm-mcp-cli"
  ((FAIL++))
fi

# Step 2: Check repomix
echo "2. Checking repomix..."
if command -v repomix &>/dev/null; then
  REPOMIX_VERSION=$(repomix --version 2>/dev/null || echo "unknown")
  echo "   OK: repomix found ($REPOMIX_VERSION)"
  ((PASS++))
else
  echo "   MISSING: repomix not found"
  echo "   Install: npm install -g repomix"
  ((FAIL++))
fi

# Step 3: Verify NLM authentication
echo "3. Checking NLM authentication..."
if nlm login --check &>/dev/null; then
  echo "   OK: authenticated"
  ((PASS++))
else
  echo "   NOT AUTHENTICATED: run 'nlm login' to sign in"
  ((FAIL++))
fi

# Step 4: Run nlm doctor
echo "4. Running nlm doctor..."
if nlm doctor &>/dev/null; then
  echo "   OK: all diagnostics passed"
  ((PASS++))
else
  echo "   WARNING: some diagnostics failed (run 'nlm doctor' for details)"
  ((FAIL++))
fi

echo ""
echo "========================================="
echo "  Results: $PASS passed, $FAIL failed"
echo "========================================="

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "All checks passed! Next steps:"
  echo ""
  echo "  1. Run /second-brain init     — Create your project knowledge base"
  echo "  2. Run /debug-companion init   — Build a debugging companion"
  echo "  3. Run /security-audit init    — Set up security handbook"
  echo "  4. Run /research <topic>       — Research anything"
  echo ""
  echo "See README.md for full documentation."
else
  echo ""
  echo "Fix the issues above and re-run ./setup.sh"
  exit 1
fi
