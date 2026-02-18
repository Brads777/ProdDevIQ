# Git Worktree Parallel Implementation

Use this pattern when multiple features need to be implemented in parallel by separate agents without file conflicts.

---

## Why Worktrees Over Branches

- Branches share the same working directory — agents stepping on each other's files
- Worktrees give each agent a physically separate directory
- Each agent works in isolation, no merge conflicts during development
- Final merge happens only after all features pass individually

---

## Setup Prompt

```
I need to implement the following features in parallel using git worktrees.
Each feature must be implemented by a separate agent in its own worktree.

FEATURES:
1. [Feature 1 name] — [brief description]
2. [Feature 2 name] — [brief description]
3. [Feature 3 name] — [brief description]

INSTRUCTIONS:
1. For each feature, create a git worktree:
   git worktree add ../worktree-{feature-name} -b feature/{feature-name}

2. Assign one agent per worktree to implement the feature in isolation

3. Each agent should:
   - Work ONLY in its assigned worktree directory
   - Follow docs/architecture.md and docs/features.json
   - Run tests within its worktree
   - Commit when the feature passes all acceptance criteria

4. After ALL features are implemented and passing:
   - Merge each feature branch into main one at a time
   - Resolve any merge conflicts
   - Run the full test suite after each merge
   - Verify the combined implementation works correctly

Do NOT start merging until all features pass individually in their worktrees.
```

---

## Cleanup

After successful merge:
```bash
# Remove worktrees
git worktree remove ../worktree-{feature-name}

# Delete feature branches if no longer needed
git branch -d feature/{feature-name}
```
