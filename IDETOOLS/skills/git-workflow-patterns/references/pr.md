---
description: This workflow guides creating, managing, and reviewing pull requests following best practices for clear descriptions, proper linking, and efficient code review.
---

# Pull Request Workflow

## Creating a Pull Request

### Step 1: Prepare Your Branch

Before creating a PR, ensure your branch is ready:

```bash
# Ensure you're on your feature branch
git branch --show-current

# Fetch latest changes from remote
git fetch origin

# Rebase on target branch (usually main/master)
git rebase origin/main

# Resolve any conflicts if necessary
# Then force push if you rebased
git push --force-with-lease
```

### Step 2: Review Your Changes

Before opening the PR, self-review your changes:

```bash
# View all commits that will be in the PR
git log origin/main..HEAD --oneline

# View the complete diff
git diff origin/main...HEAD

# Check for any files that shouldn't be committed
git diff origin/main...HEAD --name-only
```

**Self-review checklist:**
- [ ] All changes are intentional
- [ ] No debug code, console.logs, or TODO comments left behind
- [ ] No secrets or credentials in the diff
- [ ] Tests are included for new functionality
- [ ] Documentation is updated if needed

### Step 3: Create the Pull Request

#### Using GitHub CLI (Recommended)

```bash
# Create PR with interactive prompts
gh pr create

# Create PR with title and body
gh pr create --title "feat: add user authentication" --body "## Summary
- Implemented JWT authentication
- Added login/logout endpoints

## Test Plan
- Run test suite
- Manual testing of auth flow"

# Create PR targeting specific branch
gh pr create --base develop --title "feat: new feature"

# Create draft PR
gh pr create --draft --title "WIP: experimental feature"
```

#### PR Description Template

```markdown
## Summary
[1-3 bullet points describing what this PR does]

## Changes
- [List of specific changes made]

## Related Issues
Closes #123
Related to #456

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] [Specific test scenarios]

## Screenshots (if UI changes)
[Before/after screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)
```

---

## Managing Pull Requests

### Viewing PR Status

```bash
# List your open PRs
gh pr list --author @me

# View specific PR details
gh pr view 123

# View PR in browser
gh pr view 123 --web

# Check PR status (CI, reviews, etc.)
gh pr status
```

### Updating a PR

```bash
# Add more commits (they'll automatically be added to the PR)
git add .
git commit -m "fix: address review feedback"
git push

# Amend the last commit (for small fixes)
git add .
git commit --amend --no-edit
git push --force-with-lease

# Rebase and squash commits before merge
git rebase -i origin/main
git push --force-with-lease
```

### Responding to Reviews

```bash
# View review comments
gh pr view 123 --comments

# Reply to a review
gh pr review 123 --comment --body "Addressed in latest commit"

# Request re-review after changes
gh pr edit 123 --add-reviewer username
```

---

## Reviewing Pull Requests

### Step 1: Check Out the PR Locally

```bash
# Fetch and checkout PR branch
gh pr checkout 123

# Or manually
git fetch origin pull/123/head:pr-123
git checkout pr-123
```

### Step 2: Review the Code

```bash
# View the diff
gh pr diff 123

# Run the test suite
npm test  # or appropriate test command

# Build and run locally if needed
npm run build && npm start
```

### Step 3: Submit Review

```bash
# Approve the PR
gh pr review 123 --approve --body "LGTM! Great work."

# Request changes
gh pr review 123 --request-changes --body "Please address the following:
- Issue 1
- Issue 2"

# Leave comments without approval/rejection
gh pr review 123 --comment --body "A few suggestions, but not blocking."
```

### Review Checklist

**Code Quality:**
- [ ] Code is readable and well-organized
- [ ] No obvious bugs or logic errors
- [ ] Error handling is appropriate
- [ ] No security vulnerabilities

**Testing:**
- [ ] Tests cover new functionality
- [ ] Edge cases are handled
- [ ] Tests are meaningful (not just for coverage)

**Documentation:**
- [ ] Code is self-documenting or has appropriate comments
- [ ] README/docs updated if needed
- [ ] API changes documented

**Performance:**
- [ ] No obvious performance issues
- [ ] No N+1 queries or inefficient loops
- [ ] Resources are properly cleaned up

---

## Merging Pull Requests

### Merge Strategies

**Squash and Merge** (Recommended for feature branches):
```bash
gh pr merge 123 --squash --body "feat: add user authentication (#123)"
```
- Combines all commits into one
- Keeps main branch history clean

**Merge Commit**:
```bash
gh pr merge 123 --merge
```
- Preserves all commits
- Good for long-running branches with meaningful commits

**Rebase and Merge**:
```bash
gh pr merge 123 --rebase
```
- Replays commits on top of base branch
- Linear history without merge commits

### Post-Merge Cleanup

```bash
# Delete the remote branch (usually automatic)
gh pr merge 123 --delete-branch

# Delete local branch
git branch -d feature-branch

# Update local main
git checkout main
git pull origin main

# Prune deleted remote branches
git fetch --prune
```

---

## Common Scenarios

### Draft to Ready

```bash
# Convert draft PR to ready for review
gh pr ready 123
```

### Change Target Branch

```bash
gh pr edit 123 --base develop
```

### Close Without Merging

```bash
gh pr close 123
```

### Reopen Closed PR

```bash
gh pr reopen 123
```

### Add Labels and Assignees

```bash
gh pr edit 123 --add-label "bug,priority:high" --add-assignee username
```

---

## PR Best Practices

1. **Keep PRs Small**: Aim for < 400 lines changed. Large PRs are harder to review and more likely to have bugs.

2. **One Concern Per PR**: Each PR should address a single feature, bug, or refactor.

3. **Descriptive Titles**: Use conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.

4. **Link to Issues**: Always link related issues for traceability.

5. **Respond Promptly**: Address review feedback within 24-48 hours to keep momentum.

6. **Don't Force Push After Review**: Unless necessary, as it makes reviewing changes harder.

7. **Use Draft PRs**: For work in progress or early feedback.

8. **Test Before Review**: Ensure CI passes before requesting review.

---

## Troubleshooting

### PR Shows Conflicts

```bash
# Update your branch with latest target
git fetch origin
git rebase origin/main
# Resolve conflicts in your editor
git add .
git rebase --continue
git push --force-with-lease
```

### CI Failing

```bash
# View CI status
gh pr checks 123

# View CI logs
gh run view --log
```

### Accidentally Pushed to Wrong Branch

```bash
# Create correct branch from your commits
git checkout -b correct-branch

# Reset wrong branch
git checkout wrong-branch
git reset --hard origin/wrong-branch

# Push correct branch and create new PR
git checkout correct-branch
git push -u origin correct-branch
```
