#!/bin/bash
# =============================================================================
# Git Worktree Cleanup Script
# =============================================================================
# Removes all worktrees created by worktree-setup.sh and deletes their branches.
# Run this after all features have been merged into the main branch.
#
# Usage:
#   ./scripts/worktree-cleanup.sh               # Interactive mode
#   ./scripts/worktree-cleanup.sh --force        # Remove all without prompting
# =============================================================================

set -e

if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "Error: Not inside a git repository."
  exit 1
fi

FORCE=false
if [ "$1" = "--force" ]; then
  FORCE=true
fi

echo "Current worktrees:"
git worktree list
echo ""

# Find worktrees in parent directory matching our naming convention
WORKTREES=$(git worktree list --porcelain | grep "^worktree " | grep "/worktree-" | sed 's/^worktree //')

if [ -z "$WORKTREES" ]; then
  echo "No worktrees matching 'worktree-*' pattern found."
  exit 0
fi

for WT in $WORKTREES; do
  FEATURE_NAME=$(basename "$WT" | sed 's/^worktree-//')
  BRANCH_NAME="feature/${FEATURE_NAME}"

  if [ "$FORCE" = true ]; then
    CONFIRM="y"
  else
    echo -n "Remove worktree $WT and branch $BRANCH_NAME? [y/N] "
    read CONFIRM
  fi

  if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
    echo "  Removing worktree: $WT"
    git worktree remove "$WT" --force 2>/dev/null || {
      echo "  Warning: Could not remove worktree. It may have uncommitted changes."
      echo "  Use --force flag or clean up manually."
      continue
    }

    echo "  Deleting branch: $BRANCH_NAME"
    git branch -d "$BRANCH_NAME" 2>/dev/null || {
      echo "  Warning: Branch $BRANCH_NAME not fully merged. Use 'git branch -D' to force delete."
    }
  else
    echo "  Skipped: $WT"
  fi
done

echo ""
echo "Remaining worktrees:"
git worktree list
