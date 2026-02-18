---
trigger: always_on
---

# Pre-Merge Checks

Run these checks before merging any branch into main/master.

## 1. Code Quality

- [ ] All linting passes: `npm run lint` or `eslint .`
- [ ] No TypeScript errors: `tsc --noEmit`
- [ ] Code formatter applied: `prettier --check .` or `npm run format:check`

## 2. Tests

- [ ] All unit tests pass: `npm test` or `pytest`
- [ ] Integration tests pass (if applicable)
- [ ] Test coverage meets threshold: `npm run test:coverage`
- [ ] No skipped or pending tests without explanation

## 3. Build Verification

- [ ] Project builds successfully: `npm run build`
- [ ] No build warnings treated as errors
- [ ] Bundle size within acceptable limits

## 4. Security

- [ ] No secrets or API keys in code: `git secrets --scan` or `gitleaks detect`
- [ ] Dependencies scanned: `npm audit` or `safety check`
- [ ] No vulnerable dependencies at critical/high severity

## 5. Git Hygiene

- [ ] Branch is up to date with target branch: `git fetch && git rebase origin/main`
- [ ] No merge conflicts
- [ ] Commits are atomic and well-messaged
- [ ] No large binary files committed accidentally
- [ ] `.gitignore` is respected (no `node_modules`, `.env`, etc.)

## 6. Documentation

- [ ] README updated if public API changed
- [ ] CHANGELOG updated (if maintained)
- [ ] Inline comments for complex logic
- [ ] JSDoc/docstrings for public functions

## 7. Review Checklist

- [ ] PR description explains the change
- [ ] Linked to relevant issue/ticket
- [ ] Self-reviewed the diff
- [ ] Removed debug statements (`console.log`, `debugger`, `print`)
- [ ] No TODO comments without tracking issue

## Quick Commands

```bash
# Run all checks at once
npm run lint && npm run test && npm run build

# Python projects
ruff check . && pytest && mypy .

# Check for secrets
git diff origin/main --name-only | xargs grep -l -E "(api_key|secret|password|token)" || echo "No secrets found"

# Verify no console.logs left
git diff origin/main -- '*.js' '*.ts' '*.tsx' | grep -E "^\+.*console\.(log|debug)" && echo "⚠️  Found console statements" || echo "✓ Clean"
```

## Pre-Commit Hook (optional)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run lint || exit 1
npm run test || exit 1
npm run build || exit 1
echo "✓ All pre-merge checks passed"
```

Make executable: `chmod +x .git/hooks/pre-commit`