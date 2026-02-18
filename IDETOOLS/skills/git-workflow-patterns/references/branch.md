---
description: This workflow provides guidelines for branch naming conventions, creating branches, managing branch lifecycles, and organizing work across branches effectively.
---

# Branch Management Workflow

## Branch Naming Conventions

Use consistent, descriptive branch names that convey purpose at a glance.

### Format

```
<type>/<ticket-id>-<short-description>
```

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat/` | New features | `feat/AUTH-123-user-login` |
| `fix/` | Bug fixes | `fix/BUG-456-null-pointer` |
| `hotfix/` | Urgent production fixes | `hotfix/PROD-789-security-patch` |
| `refactor/` | Code refactoring | `refactor/TECH-101-simplify-api` |
| `docs/` | Documentation changes | `docs/DOC-202-api-reference` |
| `test/` | Test additions/fixes | `test/QA-303-integration-tests` |
| `chore/` | Maintenance tasks | `chore/DEP-404-update-deps` |
| `experiment/` | Experimental work | `experiment/try-new-framework` |

### Rules

1. **Lowercase only**: Use lowercase letters and hyphens
2. **No spaces**: Use hyphens to separate words
3. **Keep it short**: Max 50 characters if possible
4. **Be descriptive**: Someone should understand the purpose from the name

### Examples

```bash
# Good
feat/AUTH-123-oauth-google-login
fix/BUG-456-cart-total-calculation
refactor/TECH-789-extract-auth-service

# Bad
Feature/Add_New_Login_Page        # Wrong case, underscores
my-branch                          # Not descriptive
fix-stuff                          # Too vague
feat/AUTH-123-implement-the-new-oauth-based-google-login-system  # Too long
```

---

## Creating Branches

### From Main/Master

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feat/TICKET-123-new-feature

# Or using git switch (modern)
git switch -c feat/TICKET-123-new-feature
```

### From Another Branch

```bash
# Create branch from specific branch
git checkout -b fix/BUG-456-hotfix origin/release/v2.0

# Or from a specific commit
git checkout -b feat/TICKET-789-feature abc1234
```

### From a Remote Branch

```bash
# Fetch remote branches
git fetch origin

# Create local branch tracking remote
git checkout -b feat/TICKET-123-feature origin/feat/TICKET-123-feature

# Or shorter
git checkout feat/TICKET-123-feature  # Auto-tracks if remote exists
```

---

## Branch Workflow Strategies

### GitHub Flow (Simple)

Best for: Continuous deployment, small teams

```
main (always deployable)
  └── feat/feature-1 ─────────► PR ─► main
  └── fix/bug-1 ──────────────► PR ─► main
  └── feat/feature-2 ─────────► PR ─► main
```

**Process:**
1. Create branch from `main`
2. Make changes and commit
3. Open PR to `main`
4. Review, test, merge
5. Deploy from `main`

### GitFlow (Structured)

Best for: Scheduled releases, larger teams

```
main (production)
  └── develop (integration)
        ├── feat/feature-1 ──► PR ──► develop
        ├── feat/feature-2 ──► PR ──► develop
        └── release/v1.0 ────► PR ──► main + develop
              └── fix/release-bug ──► release/v1.0

hotfix/urgent-fix ─────────────► PR ──► main + develop
```

**Process:**
1. Create feature branches from `develop`
2. Merge features to `develop` via PR
3. Create release branch from `develop`
4. Fix release bugs on release branch
5. Merge release to `main` and `develop`
6. Hotfixes branch from `main`, merge to both `main` and `develop`

### Trunk-Based Development

Best for: CI/CD, experienced teams, small changes

```
main (trunk)
  └── short-lived-branch-1 (< 1 day) ──► PR ──► main
  └── short-lived-branch-2 (< 1 day) ──► PR ──► main
```

**Process:**
1. Create very short-lived branches
2. Small, frequent merges to `main`
3. Feature flags for incomplete features
4. Deploy continuously from `main`

---

## Managing Branches

### List Branches

```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches (local and remote)
git branch -a

# List branches with last commit info
git branch -v

# List merged/unmerged branches
git branch --merged main
git branch --no-merged main
```

### Switch Between Branches

```bash
# Switch to existing branch
git checkout feat/TICKET-123
# Or modern
git switch feat/TICKET-123

# Switch and discard local changes (careful!)
git checkout -f feat/TICKET-123

# Switch to previous branch
git checkout -
```

### Rename Branches

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name

# Rename and update remote
git push origin :old-name new-name
git push origin -u new-name
```

### Delete Branches

```bash
# Delete local branch (safe - won't delete unmerged)
git branch -d feat/TICKET-123

# Force delete local branch
git branch -D feat/TICKET-123

# Delete remote branch
git push origin --delete feat/TICKET-123

# Prune deleted remote branches locally
git fetch --prune

# Delete all merged local branches (except main/master/develop)
git branch --merged main | grep -v "main\|master\|develop" | xargs git branch -d
```

---

## Keeping Branches Updated

### Rebase vs Merge

**Rebase** (Recommended for feature branches):
```bash
# Update feature branch with latest main
git checkout feat/TICKET-123
git fetch origin
git rebase origin/main

# Resolve conflicts if any, then continue
git add .
git rebase --continue

# Force push after rebase
git push --force-with-lease
```

**Merge** (When preserving history matters):
```bash
git checkout feat/TICKET-123
git fetch origin
git merge origin/main
# Resolve conflicts, commit
git push
```

### Best Practices

1. **Rebase before PR**: Keep your branch up to date with target branch
2. **Don't rebase shared branches**: Only rebase branches you own
3. **Use `--force-with-lease`**: Safer than `--force`, fails if remote changed
4. **Rebase frequently**: Smaller, more frequent rebases are easier

---

## Branch Protection

### Recommended Protection Rules

For `main`/`master`:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Prevent force pushes
- Prevent deletion

For `develop`:
- Require pull request reviews
- Require status checks to pass

### Setting Up (GitHub CLI)

```bash
# Note: Branch protection requires admin access
# Usually configured via GitHub web UI or API

# View current protection
gh api repos/{owner}/{repo}/branches/main/protection
```

---

## Common Scenarios

### Stash Changes Before Switching

```bash
# Save current changes
git stash push -m "WIP: feature work"

# Switch branches
git checkout other-branch

# Do work, then return
git checkout original-branch

# Restore changes
git stash pop
```

### Cherry-Pick Commits

```bash
# Apply specific commit to current branch
git cherry-pick abc1234

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678

# Cherry-pick without committing
git cherry-pick abc1234 --no-commit
```

### Create Branch from Stash

```bash
# Create branch and apply stash
git stash branch new-feature-branch stash@{0}
```

### Compare Branches

```bash
# Show commits in branch-a not in branch-b
git log branch-b..branch-a

# Show file differences between branches
git diff branch-a..branch-b

# Show changed files between branches
git diff branch-a..branch-b --name-only
```

---

## Troubleshooting

### Detached HEAD State

```bash
# You're on a commit, not a branch
# Create a branch to save your work
git checkout -b save-my-work

# Or return to a branch
git checkout main
```

### Accidentally Committed to Wrong Branch

```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick abc1234

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1  # Removes last commit
```

### Branch Diverged from Remote

```bash
# View divergence
git log HEAD..origin/branch --oneline
git log origin/branch..HEAD --oneline

# Option 1: Rebase (rewrite local commits)
git rebase origin/branch

# Option 2: Merge (preserve both histories)
git merge origin/branch
```

### Recover Deleted Branch

```bash
# Find the commit SHA (if recent)
git reflog

# Recreate branch from that SHA
git checkout -b recovered-branch abc1234
```

---

## Quick Reference

```bash
# Create branch
git checkout -b type/ticket-description

# List branches
git branch -a

# Switch branch
git switch branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename branch
git branch -m new-name

# Update branch with main
git fetch origin && git rebase origin/main

# Clean up merged branches
git branch --merged | grep -v "main" | xargs git branch -d
```
