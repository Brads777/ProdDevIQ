---
description: This workflow explains git worktrees for managing multiple branches simultaneously without stashing or switching, enabling parallel development and efficient code review.
---

# Git Worktrees Workflow

## What Are Worktrees?

Git worktrees allow you to have multiple working directories attached to a single repository. Each worktree can have a different branch checked out, enabling you to:

- Work on multiple features simultaneously
- Review PRs without stashing current work
- Run tests on one branch while coding on another
- Compare implementations side by side

```
my-project/                    # Main worktree (main branch)
├── .git/
├── src/
└── ...

my-project-feature/            # Linked worktree (feature branch)
├── src/
└── ...

my-project-hotfix/             # Linked worktree (hotfix branch)
├── src/
└── ...
```

All worktrees share the same `.git` directory and repository history.

---

## Basic Operations

### Create a Worktree

```bash
# Create worktree for existing branch
git worktree add ../my-project-feature feat/TICKET-123

# Create worktree with new branch
git worktree add -b feat/new-feature ../my-project-new-feature main

# Create worktree in specific location
git worktree add ~/projects/my-project-review feat/review-branch
```

### List Worktrees

```bash
# List all worktrees
git worktree list

# Output example:
# /path/to/my-project        abc1234 [main]
# /path/to/my-project-feat   def5678 [feat/TICKET-123]
# /path/to/my-project-fix    ghi9012 [fix/BUG-456]
```

### Remove a Worktree

```bash
# Remove worktree (directory must be clean)
git worktree remove ../my-project-feature

# Force remove (discards changes)
git worktree remove --force ../my-project-feature

# Manual cleanup (if directory was deleted manually)
git worktree prune
```

### Move a Worktree

```bash
# Move worktree to new location
git worktree move ../my-project-feature ../new-location
```

---

## Common Use Cases

### Use Case 1: Parallel Feature Development

Work on two features without context switching:

```bash
# You're on main, start feature A
git worktree add ../project-feature-a -b feat/feature-a

# Start feature B in another directory
git worktree add ../project-feature-b -b feat/feature-b

# Work on feature A
cd ../project-feature-a
# ... make changes, commit ...

# Switch to feature B (instant, no stash needed)
cd ../project-feature-b
# ... make changes, commit ...

# Both features can have separate terminal sessions, editors, etc.
```

### Use Case 2: Code Review Without Interruption

Review a PR without losing your current work:

```bash
# Currently working on your feature
# Need to review PR #123 on branch feat/other-feature

# Create worktree for review
git fetch origin
git worktree add ../project-review origin/feat/other-feature

# Review in new worktree
cd ../project-review
# ... run tests, examine code ...

# Return to your work (unchanged)
cd ../project
# ... continue working ...

# Clean up after review
git worktree remove ../project-review
```

### Use Case 3: Hotfix While Developing

Handle urgent fix without losing feature work:

```bash
# Working on feature, urgent bug reported
git worktree add ../project-hotfix -b hotfix/urgent-bug main

# Fix the bug
cd ../project-hotfix
# ... fix bug, test, commit ...
git push -u origin hotfix/urgent-bug

# Create PR and merge
gh pr create --title "hotfix: urgent bug fix"

# Return to feature work
cd ../project
# ... continue feature development ...

# Clean up
git worktree remove ../project-hotfix
```

### Use Case 4: Compare Implementations

Compare two approaches side by side:

```bash
# Create worktrees for two approaches
git worktree add ../project-approach-a -b experiment/approach-a
git worktree add ../project-approach-b -b experiment/approach-b

# Implement approach A
cd ../project-approach-a
# ... implement ...

# Implement approach B
cd ../project-approach-b
# ... implement ...

# Open both in editors/IDEs for comparison
# Run benchmarks in separate terminals
```

### Use Case 5: Long-Running Tests

Run tests while continuing development:

```bash
# Create worktree for testing
git worktree add ../project-test HEAD

# Start long-running tests in background
cd ../project-test
npm test -- --coverage &

# Continue development in main worktree
cd ../project
# ... keep coding ...
```

---

## Worktree Organization

### Recommended Directory Structure

```bash
# Option 1: Sibling directories
~/projects/
├── my-project/              # Main worktree (main/master)
├── my-project-feat-auth/    # Feature worktree
├── my-project-fix-bug/      # Bugfix worktree
└── my-project-review/       # Review worktree

# Option 2: Subdirectory approach
~/projects/my-project/
├── main/                    # Main worktree
├── worktrees/
│   ├── feat-auth/
│   ├── fix-bug/
│   └── review/
```

### Naming Convention

Use descriptive names that indicate the purpose:

```bash
# Format: project-purpose or project-branch-type
my-project-feat-auth
my-project-fix-123
my-project-review-pr-456
my-project-hotfix
```

---

## Working with Multiple Worktrees

### Shared Git State

All worktrees share:
- Commit history
- Remote tracking
- Git configuration
- Hooks

Changes in any worktree (commits, fetches) are visible in all others.

### Branch Locking

A branch can only be checked out in ONE worktree at a time:

```bash
# This fails if feat/xyz is checked out in another worktree
git checkout feat/xyz
# fatal: 'feat/xyz' is already checked out at '/path/to/other-worktree'

# Check which worktree has the branch
git worktree list | grep feat/xyz
```

### Running Commands Across Worktrees

```bash
# Run command in each worktree
for wt in $(git worktree list --porcelain | grep worktree | cut -d' ' -f2); do
  echo "=== $wt ==="
  (cd "$wt" && git status --short)
done
```

---

## IDE Integration

### VS Code

Open each worktree as a separate workspace:

```bash
# Open main worktree
code ../my-project

# Open feature worktree in new window
code ../my-project-feature
```

Or use VS Code's multi-root workspaces to see all worktrees.

### JetBrains IDEs

Open each worktree as a separate project. The IDE will recognize they share the same repository.

### Vim/Neovim

Use separate terminal sessions or tabs for each worktree.

---

## Worktree Lifecycle Management

### Creating Ephemeral Worktrees

For temporary tasks (reviews, experiments):

```bash
# Create with descriptive temporary name
git worktree add ../project-temp-review-123 origin/feat/pr-123

# Do the work...

# Remove when done
git worktree remove ../project-temp-review-123
```

### Long-Running Worktrees

For ongoing parallel development:

```bash
# Create persistent worktree
git worktree add ../project-v2-development develop

# Update regularly
cd ../project-v2-development
git pull --rebase

# Keep until project phase completes
```

### Cleanup Script

```bash
#!/bin/bash
# cleanup-worktrees.sh

# Prune worktrees with missing directories
git worktree prune

# List remaining worktrees
echo "Active worktrees:"
git worktree list

# Optional: remove worktrees for merged branches
for wt in $(git worktree list --porcelain | grep worktree | cut -d' ' -f2); do
  branch=$(cd "$wt" && git branch --show-current)
  if git branch --merged main | grep -q "$branch"; then
    echo "Worktree for merged branch: $wt ($branch)"
    # Uncomment to auto-remove: git worktree remove "$wt"
  fi
done
```

---

## Troubleshooting

### "Branch is already checked out"

```bash
# Find where branch is checked out
git worktree list

# Either remove that worktree or use a different branch
git worktree remove /path/to/other-worktree
```

### Worktree Shows Wrong Branch

```bash
# Verify worktree state
git worktree list

# If corrupted, remove and recreate
git worktree remove /path/to/worktree
git worktree add /path/to/worktree branch-name
```

### Orphaned Worktree Data

```bash
# Clean up references to deleted worktree directories
git worktree prune

# Verbose cleanup
git worktree prune --verbose
```

### Can't Delete Worktree

```bash
# Check for uncommitted changes
cd /path/to/worktree
git status

# Force remove (loses uncommitted changes!)
git worktree remove --force /path/to/worktree
```

### Detached HEAD in Worktree

```bash
# Check out a branch
cd /path/to/worktree
git checkout branch-name

# Or create new branch from current HEAD
git checkout -b new-branch-name
```

---

## Best Practices

1. **Use descriptive directory names**: Make it clear what each worktree is for

2. **Clean up promptly**: Remove worktrees when done to avoid confusion

3. **Keep worktrees updated**: Regularly fetch and rebase in active worktrees

4. **One purpose per worktree**: Don't switch branches within a worktree

5. **Document active worktrees**: For teams, track who's using which worktrees

6. **Use consistent locations**: Keep all worktrees in predictable places

7. **Don't nest worktrees**: Keep worktree directories as siblings, not nested

8. **Prune regularly**: Run `git worktree prune` to clean up stale references

---

## Quick Reference

```bash
# Create worktree for existing branch
git worktree add ../path branch-name

# Create worktree with new branch
git worktree add -b new-branch ../path base-branch

# List all worktrees
git worktree list

# Remove worktree
git worktree remove ../path

# Force remove
git worktree remove --force ../path

# Clean up stale worktree references
git worktree prune

# Move worktree
git worktree move ../old-path ../new-path
```

---

## Worktrees vs Alternatives

| Scenario | Worktrees | Stash | Multiple Clones |
|----------|-----------|-------|-----------------|
| Quick branch switch | Overkill | Good | Overkill |
| Parallel development | Best | Bad | Works |
| PR review | Best | OK | Works |
| Long-running comparison | Best | Bad | Works |
| Disk space | Efficient | N/A | Wasteful |
| Setup time | Fast | Instant | Slow |
| Shared git state | Yes | Yes | No |
