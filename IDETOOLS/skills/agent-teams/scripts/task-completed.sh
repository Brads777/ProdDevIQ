#!/usr/bin/env bash
# Hook: PreToolUse on TaskUpdate
# Runs tests before allowing a task to be marked as completed.
#
# This is a Claude Code PreToolUse hook. It receives the tool input
# as JSON on stdin when TaskUpdate is called. Only acts when status
# is being set to "completed".
#
# Exit codes:
#   0 — allow the TaskUpdate
#   2 — block the TaskUpdate (quality check failed)

set -euo pipefail

INPUT="$(cat)"

# Extract status from tool input
if command -v jq &>/dev/null; then
  STATUS="$(echo "$INPUT" | jq -r '.status // empty')"
else
  # Fallback: handle both compact ("status":"completed") and spaced ("status": "completed")
  STATUS="$(echo "$INPUT" | grep -oE '"status"\s*:\s*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/' || true)"
fi

# Only validate when marking completed
if [[ "$STATUS" != "completed" ]]; then
  exit 0
fi

echo "Task being marked completed — running quality checks..."

# --- Check 1: Test suite ---
TESTS_FAILED=false

if [[ -f "package.json" ]] && grep -q '"test"' package.json 2>/dev/null; then
  echo "Running npm test..."
  if ! npm test --silent 2>&1; then
    TESTS_FAILED=true
  fi
elif [[ -f "Cargo.toml" ]]; then
  echo "Running cargo test..."
  if ! cargo test --quiet 2>&1; then
    TESTS_FAILED=true
  fi
elif [[ -f "pytest.ini" ]] || [[ -f "conftest.py" ]]; then
  if command -v pytest &>/dev/null; then
    echo "Running pytest..."
    if ! pytest --quiet 2>&1; then
      TESTS_FAILED=true
    fi
  fi
elif [[ -f "pyproject.toml" ]] && grep -q '\[tool\.pytest' pyproject.toml 2>/dev/null; then
  if command -v pytest &>/dev/null; then
    echo "Running pytest..."
    if ! pytest --quiet 2>&1; then
      TESTS_FAILED=true
    fi
  fi
elif [[ -f "Makefile" ]] && grep -q '^test:' Makefile 2>/dev/null; then
  echo "Running make test..."
  if ! make test 2>&1; then
    TESTS_FAILED=true
  fi
else
  echo "No test suite detected. Skipping test validation."
fi

if [[ "$TESTS_FAILED" == true ]]; then
  echo ""
  echo "Cannot mark task complete — tests are failing."
  echo "Fix failing tests before completing this task."
  exit 2
fi

# --- Check 2: Build (if applicable) ---
if [[ -f "package.json" ]] && grep -q '"build"' package.json 2>/dev/null; then
  echo "Running npm run build..."
  if ! npm run build --silent 2>&1; then
    echo ""
    echo "Cannot mark task complete — build is broken."
    exit 2
  fi
fi

echo "All checks passed."
exit 0
