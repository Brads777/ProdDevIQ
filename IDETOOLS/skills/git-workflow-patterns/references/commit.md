---
description: This workflow ensures all commits follow security best practices, pass required checks, and use a consistent commit message format.
---

# Commit Workflow


## Commit Message Format

All commit messages MUST follow this structure:

```
<type>-<ticket/issue>: [description]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting (no logic changes)
- `refactor` - Code refactoring (no feature changes)
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependencies, configs
- `perf` - Performance improvements
- `security` - Security fixes or improvements

### Examples
```
feat-123: [add user authentication flow]
fix-456: [resolve race condition in data sync]
docs-789: [update API documentation for v2 endpoints]
security-101: [sanitize user input on form submissions]
chore-xxx: [update dependencies to latest versions]
```

---

## Pre-Commit Checks

Before committing, the agent MUST perform ALL of the following checks:

### 1. Security Review (CRITICAL)

#### API Keys & Secrets Detection
Scan all staged files for:
- API keys (patterns like `api_key`, `apikey`, `api-key`)
- AWS credentials (`AKIA`, `aws_access_key_id`, `aws_secret_access_key`)
- Private keys (`-----BEGIN RSA PRIVATE KEY-----`, `-----BEGIN OPENSSH PRIVATE KEY-----`)
- Tokens (`token`, `bearer`, `auth_token`, `access_token`, `refresh_token`)
- Passwords (`password`, `passwd`, `pwd`, `secret`)
- Database connection strings (`mongodb://`, `postgres://`, `mysql://`, `redis://`)
- OAuth secrets (`client_secret`, `oauth`)
- JWT secrets
- Encryption keys
- `.env` file contents being committed

**Action if found:**
- STOP the commit
- Report the file and line number
- Suggest using environment variables or a secrets manager
- Check if the file should be in `.gitignore`

#### Sensitive File Check
Ensure these files are NOT being committed:
- `.env`, `.env.local`, `.env.production`, `.env.*`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `id_rsa`, `id_dsa`, `id_ecdsa`, `id_ed25519`
- `credentials.json`, `secrets.json`, `config.secret.*`
- `*.keystore`, `*.jks`
- `service-account*.json` (GCP)
- `kubeconfig`, `kube/config`

### 2. Code Quality Checks

#### Linting
- Run the project's configured linter (ESLint, Pylint, Rubocop, etc.)
- Ensure no errors (warnings may be acceptable based on project config)

#### Type Checking (if applicable)
- TypeScript: Run `tsc --noEmit`
- Python: Run `mypy` or `pyright`
- Other typed languages: Run appropriate type checker

#### Formatting
- Verify code follows project formatting standards
- Run Prettier, Black, gofmt, or equivalent if configured

### 3. Test Verification

#### Unit Tests
- Run unit tests related to changed files
- All tests must pass before committing

#### Test Coverage (if configured)
- Ensure new code has adequate test coverage
- Coverage should not decrease from the change

### 4. Build Verification

- Ensure the project builds successfully
- No compilation errors
- No unresolved imports or dependencies

### 5. Dependency Check

#### New Dependencies
If `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, or similar changed:
- Verify dependencies are from trusted sources
- Check for known vulnerabilities using `npm audit`, `pip-audit`, etc.
- Ensure license compatibility

#### Lock File Sync
- Ensure lock files are in sync with dependency manifests

### 6. Documentation Check

- If public APIs changed, verify documentation is updated
- README updates for significant feature changes
- Changelog entry for user-facing changes (if project uses one)

---

## Pre-Commit Checklist

```
[ ] No secrets, API keys, or credentials in staged files
[ ] No sensitive files being committed
[ ] .gitignore is properly configured
[ ] Linting passes with no errors
[ ] Type checking passes (if applicable)
[ ] Code is properly formatted
[ ] Related tests pass
[ ] Build succeeds
[ ] Dependencies are secure and compatible
[ ] Documentation updated (if needed)
[ ] Commit message follows format: <type>-<ticket>: [description]
```

---

## Workflow Execution

### Step 1: Stage Changes
```bash
git add <files>
# or
git add -p  # for interactive staging
```

### Step 2: Run Security Scan
```bash
# Example using grep for basic detection
git diff --cached --name-only | xargs grep -l -E "(api[_-]?key|secret|password|token|AKIA)" 2>/dev/null

# Or use dedicated tools like:
# - git-secrets
# - trufflehog
# - gitleaks
# - detect-secrets
```

### Step 3: Run Tests
```bash
# Run project-specific test command
npm test        # Node.js
pytest          # Python
go test ./...   # Go
cargo test      # Rust
```

### Step 4: Run Linter
```bash
# Run project-specific linter
npm run lint    # Node.js
pylint .        # Python
golangci-lint   # Go
```

### Step 5: Commit with Proper Message
```bash
git commit -m "feat-123: [add new authentication middleware]"
```

---

## Emergency Override

In rare cases where a commit must bypass checks (hotfix scenarios):

1. Document the reason clearly
2. Use commit message prefix: `HOTFIX-<ticket>: [description]`
3. Create a follow-up ticket to address any skipped checks
4. Notify the team immediately

**Note:** Security checks should NEVER be bypassed. If secrets are accidentally committed, immediately:
1. Revoke the exposed credentials
2. Remove from git history using `git filter-branch` or BFG Repo Cleaner
3. Force push (with team coordination)
4. Audit for any unauthorized access

---

## Common Issues & Solutions

### Issue: Accidentally staged a secret
```bash
git reset HEAD <file>  # Unstage the file
# Add file to .gitignore if needed
echo "<file>" >> .gitignore
```

### Issue: Need to amend last commit message
```bash
git commit --amend -m "feat-123: [corrected description]"
```

### Issue: Committed a secret (not yet pushed)
```bash
git reset --soft HEAD~1  # Undo last commit, keep changes staged
# Remove the secret, then recommit
```

### Issue: Committed a secret (already pushed)
```bash
# IMMEDIATELY revoke the credential
# Then use BFG or git filter-branch to remove from history
# Coordinate with team before force pushing
```

---

## Integration with CI/CD

This workflow complements CI/CD pipelines. The pre-commit checks catch issues early, while CI/CD provides:
- Full test suite execution
- Integration tests
- Security scanning with enterprise tools
- Deployment gates

Always ensure local checks pass before pushing to avoid failed CI builds.