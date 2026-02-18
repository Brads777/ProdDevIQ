#!/bin/bash
# =============================================================================
# Git Worktree Setup Script
# =============================================================================
# Creates git worktrees for parallel feature implementation.
# Each worktree gets its own directory and branch, isolated from others.
#
# Usage:
#   ./scripts/worktree-setup.sh feature-auth feature-tasks feature-realtime
#
# This creates:
#   ../worktree-feature-auth/     (branch: feature/feature-auth)
#   ../worktree-feature-tasks/    (branch: feature/feature-tasks)
#   ../worktree-feature-realtime/ (branch: feature/feature-realtime)
# =============================================================================

set -e

if [ $# -eq 0 ]; then
  echo "Usage: $0 <feature-name> [feature-name] ..."
  echo ""
  echo "Example:"
  echo "  $0 auth tasks realtime"
  echo ""
  echo "This creates a git worktree for each feature in the parent directory."
  exit 1
fi

# Verify we're in a git repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "Error: Not inside a git repository."
  echo "Initialize a repo first: git init"
  exit 1
fi

BASE_BRANCH=$(git branch --show-current)
echo "Base branch: $BASE_BRANCH"
echo ""

for FEATURE in "$@"; do
  WORKTREE_DIR="../worktree-${FEATURE}"
  BRANCH_NAME="feature/${FEATURE}"

  if [ -d "$WORKTREE_DIR" ]; then
    echo "  SKIP: $WORKTREE_DIR already exists"
  else
    echo "  Creating worktree: $WORKTREE_DIR (branch: $BRANCH_NAME)"
    git worktree add "$WORKTREE_DIR" -b "$BRANCH_NAME"
  fi
done

echo ""
echo "Worktrees created. List all worktrees:"
git worktree list

echo ""
echo "To remove a worktree when done:"
echo "  git worktree remove ../worktree-<feature-name>"
echo "  git branch -d feature/<feature-name>"
