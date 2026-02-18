#!/bin/bash
# =============================================================================
# Example Hook: Pre-Push Test Runner
# =============================================================================
# This hook runs the test suite before pushing to remote.
# Prevents pushing code that breaks tests.
#
# Usage with git hooks:
#   cp hooks/pre-push-tests.sh .git/hooks/pre-push
#   chmod +x .git/hooks/pre-push
#
# Usage with Husky:
#   npx husky add .husky/pre-push "bash hooks/pre-push-tests.sh"
# =============================================================================

echo "Running tests before push..."

# Detect test runner
if [ -f "vitest.config.ts" ] || [ -f "vitest.config.js" ]; then
  npx vitest run
elif [ -f "jest.config.ts" ] || [ -f "jest.config.js" ]; then
  npx jest --ci
elif grep -q '"test"' package.json 2>/dev/null; then
  npm test
else
  echo "No test runner detected. Skipping tests."
  exit 0
fi

if [ $? -ne 0 ]; then
  echo ""
  echo "Tests failed. Push aborted."
  echo "Fix the failing tests and try again."
  exit 1
fi

echo "All tests passed."
exit 0
