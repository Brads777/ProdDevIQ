#!/bin/bash
# =============================================================================
# Example Hook: Pre-Commit Lint Check
# =============================================================================
# This hook runs the linter on staged files before committing.
# Add to .git/hooks/pre-commit or use with a tool like Husky.
#
# Usage with git hooks:
#   cp hooks/pre-commit-lint.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Usage with Husky:
#   npx husky add .husky/pre-commit "bash hooks/pre-commit-lint.sh"
# =============================================================================

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')

if [ -z "$STAGED_FILES" ]; then
  echo "No staged TypeScript/JavaScript files to lint."
  exit 0
fi

echo "Running linter on staged files..."

# Run ESLint on staged files
npx eslint $STAGED_FILES --max-warnings=0

if [ $? -ne 0 ]; then
  echo ""
  echo "Lint errors found. Fix them before committing."
  echo "Run: npx eslint --fix <file>"
  exit 1
fi

echo "Lint check passed."
exit 0
