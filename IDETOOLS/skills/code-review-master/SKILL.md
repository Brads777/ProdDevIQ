---
name: code-review-master
description: >
  Comprehensive code review guide covering review checklists, giving and
  receiving feedback, automated checks, and review culture best practices.
  Consolidates 4 code review skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---
# ©2026 Brad Scheller

# Code Review Master

A complete guide to effective code reviews, covering both the mechanics of reviewing code and the human aspects of collaborative software development.

## When to Use This Skill

Trigger this skill when you encounter:

- "review my code" or "can you review this PR"
- "what should I check in a code review"
- "how do I give good feedback on code"
- "my PR keeps getting rejected"
- "how do I write a good PR description"
- Quality gates before merging
- Architecture or design review requests
- Security audit or performance review
- Setting up review automation
- Establishing review culture for a team

This skill applies to all code review scenarios: pull requests, pair programming sessions, async reviews, pre-commit reviews, and architectural assessments.

## The Code Review Checklist

### Core Review Dimensions

Use this 20-point checklist for every code review. Not all items apply to every change, but consider each dimension:

#### 1. Correctness
- Does the code do what it's supposed to do?
- Are edge cases handled properly?
- Are there off-by-one errors, null pointer risks, or race conditions?

#### 2. Tests
- Are there tests for new functionality?
- Do tests cover edge cases and error paths?
- Are tests clear, fast, and maintainable?
- Is test coverage at acceptable levels?

#### 3. Naming & Clarity
- Are variables, functions, and types named clearly?
- Can you understand what the code does without comments?
- Do names follow project conventions?

#### 4. Code Complexity
- Is the code as simple as it can be?
- Are functions short and focused (single responsibility)?
- Are deeply nested conditionals or loops refactorable?

#### 5. Architecture & Design
- Does this fit the existing architecture?
- Are abstractions at the right level?
- Does it introduce unnecessary coupling?
- Are patterns used appropriately (not over-engineered)?

#### 6. Error Handling
- Are errors caught and handled appropriately?
- Do error messages help with debugging?
- Are error paths tested?
- Does the code fail gracefully?

#### 7. Security
- Are inputs validated and sanitized?
- Is authentication/authorization checked?
- Are secrets hardcoded or properly managed?
- SQL injection, XSS, CSRF vulnerabilities addressed?

#### 8. Performance
- Are there obvious performance issues (N+1 queries, unnecessary loops)?
- Is pagination used for large datasets?
- Are expensive operations cached or memoized?
- Does it scale with expected load?

#### 9. Dependencies
- Are new dependencies justified?
- Are they well-maintained and secure?
- Do they increase bundle size significantly?
- Are version ranges appropriate?

#### 10. Documentation
- Are complex sections commented?
- Is public API documented?
- Are breaking changes noted?
- Does the PR description explain why, not just what?

#### 11. Consistency
- Does it follow project style guidelines?
- Are patterns consistent with existing code?
- Does it match team conventions (file structure, naming, imports)?

#### 12. Backwards Compatibility
- Are breaking changes necessary and documented?
- Are migrations or deprecation warnings included?
- Is there a rollback plan?

#### 13. Data Integrity
- Are database migrations safe and reversible?
- Is data validated before persistence?
- Are constraints enforced at the database level?

#### 14. Observability
- Are important actions logged?
- Are metrics emitted for monitoring?
- Can this code be debugged in production?

#### 15. Dead Code
- Are there unused imports, functions, or variables?
- Is commented-out code removed?
- Are temporary debugging statements removed?

#### 16. Type Safety
- Are types used correctly (no inappropriate any/unknown)?
- Are runtime type checks needed?
- Are nullability cases handled?

#### 17. Concurrency
- Are race conditions possible?
- Are shared resources locked appropriately?
- Are async operations handled correctly?

#### 18. Accessibility (for UI changes)
- Are semantic HTML elements used?
- Is keyboard navigation supported?
- Are ARIA labels present where needed?
- Is color contrast sufficient?

#### 19. Internationalization (i18n)
- Are user-facing strings externalized?
- Are date/time/number formats locale-aware?
- Are layouts resilient to text expansion?

#### 20. Deployment & Config
- Are environment-specific configs handled correctly?
- Are feature flags used appropriately?
- Is the change safe to deploy incrementally?

### Review Severity Levels

Categorize feedback into three levels:

**MUST-FIX (blocking):**
- Correctness bugs
- Security vulnerabilities
- Breaking changes without migration path
- Test failures or missing critical tests
- Performance regressions
- Violations of core architecture principles

**SUGGESTION (non-blocking):**
- Better variable names
- Simplified logic
- Additional test coverage
- Performance optimizations
- Documentation improvements

**NIT (nitpick, optional):**
- Style preferences not covered by linter
- Micro-optimizations with negligible impact
- Subjective improvements
- Formatting issues that auto-formatters should catch

Always indicate severity explicitly: `[MUST-FIX]`, `[SUGGESTION]`, or `[NIT]`.

## Giving Good Code Reviews

### Tone & Approach

Code review is collaboration, not gatekeeping. Follow these principles:

#### Be Kind and Constructive
```
❌ "This is terrible, why would you do it this way?"
✅ "This works, but have you considered using a Map here for O(1) lookups instead of an array with O(n) filtering?"
```

#### Assume Good Intent
Reviewers have full context of the codebase but limited context of the author's constraints (time, knowledge, requirements). Ask questions instead of making accusations:

```
❌ "You didn't handle errors at all."
✅ "What happens if the API call fails here? Should we show an error to the user?"
```

#### Praise What's Good
Don't just point out problems. Call out clever solutions, well-written tests, clear naming, and good documentation:

```
✅ "Nice use of early returns here—makes the happy path very readable."
✅ "This test setup is really clean, great use of factories."
```

#### Explain the "Why"
Don't just say what to change, explain why it matters:

```
❌ "Use const instead of let here."
✅ "Use const here since this value never changes—it prevents accidental reassignment and signals intent to readers."
```

#### Offer Alternatives, Not Just Criticism
```
❌ "This function is too complex."
✅ "This function handles three concerns (validation, transformation, persistence). Consider splitting into validateInput(), transformData(), and saveToDatabase() for easier testing and reuse."
```

#### Link to Resources
Point to docs, style guides, or architectural decision records (ADRs) instead of asserting personal preferences:

```
✅ "We use Zod for runtime validation per ADR-015: docs/adr/ADR-015-validation-strategy.md"
```

### Effective Feedback Format

Structure comments like this:

```
[SEVERITY] Issue description

Why it matters: <explain impact>
Suggestion: <concrete alternative>
Example: <code snippet if helpful>
Reference: <link to docs/ADR if applicable>
```

Example:
```
[MUST-FIX] SQL injection vulnerability

Why it matters: User input is directly interpolated into the query string, allowing attackers to execute arbitrary SQL.

Suggestion: Use parameterized queries instead:
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

Reference: https://owasp.org/www-community/attacks/SQL_Injection
```

### What to Review First

1. **Architecture & approach** — is the overall design sound? If not, stop here and discuss before reviewing details.
2. **Correctness & security** — does it work and is it safe?
3. **Tests** — are they present and sufficient?
4. **Complexity & clarity** — can it be simpler?
5. **Style & nitpicks** — only if the above are solid

### When to Approve vs Request Changes

**Approve if:**
- All MUST-FIX items are resolved
- SUGGESTIONS and NITS are documented but don't block merge
- Tests pass and coverage is acceptable
- You'd be comfortable debugging this code in production

**Request Changes if:**
- Any MUST-FIX item is unresolved
- Tests are missing or failing
- You don't understand what the code does or why
- It violates core architecture principles

**Comment (no approval/rejection) if:**
- You're not the right reviewer (wrong domain expertise)
- You have questions but no blocking concerns
- You're doing a "rubber stamp" review after someone else approved

## Requesting Code Reviews

### Writing PR Descriptions

Use this template for every pull request:

```markdown
## What

Brief summary of the change (one sentence).

## Why

Context and motivation:
- What problem does this solve?
- What issue or ticket does it address?
- Why is this the right approach?

## How

Implementation details:
- Key architectural decisions
- Tradeoffs considered
- Alternatives rejected and why

## Testing

- How was this tested?
- What edge cases were covered?
- Manual testing steps if needed

## Screenshots/Demos (if UI change)

[Attach images or GIFs]

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or migration plan documented)
- [ ] Self-reviewed the diff
- [ ] Ran linter and type checker
```

### Self-Review First

Before requesting review:

1. **Read your own diff line by line** — you'll catch 40% of issues yourself
2. **Run the code locally** — don't send broken code for review
3. **Check for common mistakes:**
   - Console.log or debug statements left in
   - Commented-out code
   - Unused imports
   - Hardcoded values that should be config
   - TODOs without tickets
4. **Run automated checks:**
   - Linter
   - Type checker
   - Tests
   - Build process

### Keep PRs Small

**Size guidelines:**
- **Tiny (< 50 lines):** Perfect, instant review
- **Small (50-200 lines):** Ideal size, easy to review thoroughly
- **Medium (200-500 lines):** Acceptable, but consider splitting
- **Large (500-1000 lines):** Hard to review well, high risk of issues slipping through
- **Huge (> 1000 lines):** Almost impossible to review effectively—split into multiple PRs

**How to split large changes:**
1. Refactoring/prep work (separate PR)
2. Core functionality (main PR)
3. Tests (can be bundled or separate)
4. Documentation updates (often bundled)

If you must submit a large PR (e.g., generated code, major refactor):
- Explain why it can't be split
- Provide a "review guide" highlighting key sections
- Consider pair programming review instead of async

### Provide Context for Reviewers

Help reviewers by:
- Tagging the right people (`@frontend-team`, `@security`)
- Linking to related issues, PRs, or docs
- Highlighting risky or complex sections
- Noting time constraints ("needed for Friday release")
- Marking draft PRs clearly if not ready for review

### When to Request Re-Review

After making changes based on feedback:
- If you addressed all MUST-FIX items → request re-review
- If you only fixed NITS → don't bother re-requesting
- If you disagreed with feedback → add a comment explaining why before re-requesting
- If you made significant additional changes → request re-review

## Receiving Code Reviews

### Mindset Shift

**Code reviews critique code, not people.** Internalize these truths:

- You are not your code
- Every senior engineer gets critical reviews
- Questions are not accusations
- Feedback is free coaching from experienced peers
- Defensive responses waste everyone's time

### Responding to Feedback

#### When Feedback is Valid
- Thank the reviewer
- Make the change or explain why you won't
- Mark the comment as resolved after addressing it

```
✅ "Good catch! Fixed in 3a4f8d2."
✅ "Great point—I refactored this into three smaller functions."
```

#### When Feedback is Unclear
Ask for clarification before arguing or implementing:

```
✅ "Can you elaborate on what you mean by 'too complex'? Are you concerned about readability or performance?"
✅ "Could you sketch out what the refactored version would look like?"
```

#### When You Disagree
Disagree respectfully with reasoning:

```
✅ "I see your point about using a Map here, but we're iterating through all items anyway for rendering, so the O(1) lookup doesn't matter. The array keeps the ordering predictable."
```

If disagreement persists, escalate to:
1. Another team member for a third opinion
2. Pair programming session to discuss live
3. Team lead or architect for architectural questions

#### When Feedback is a Nitpick
You can:
- Fix it anyway (builds goodwill, takes 30 seconds)
- Defer to a follow-up issue (if it's valid but low priority)
- Politely push back (if it's purely subjective and inconsistent with project norms)

```
✅ "Good idea—I'll handle that in a follow-up. Created issue #1234."
✅ "Our style guide actually allows both patterns here, but I'm happy to change it if you feel strongly."
```

### Learning from Reviews

Every review is a learning opportunity:

- If you get the same feedback repeatedly → internalize it, update your personal checklist
- If a reviewer catches a bug you missed → add that scenario to your testing checklist
- If you disagree with a pattern → research it, understand the tradeoffs, propose an ADR if needed
- If feedback is confusing → schedule a pairing session to learn the reviewer's mental model

Track patterns in your own reviews:
- "I always forget to handle error states in UI components" → add to pre-submit checklist
- "I tend to over-engineer abstractions" → focus on YAGNI principle
- "My tests are often too implementation-focused" → study behavior-driven testing

## Automated Checks

Automate everything that doesn't require human judgment. This frees reviewers to focus on architecture, logic, and design.

### Essential Automated Gates

#### 1. Linting
Enforce code style automatically:

```bash
# Run in CI and pre-commit hooks
npm run lint       # or eslint, ruff, rubocop, etc.
```

**What to catch:**
- Formatting (spaces, indentation, line length)
- Unused variables
- Deprecated API usage
- Dangerous patterns (e.g., `eval()`, `dangerouslySetInnerHTML`)

#### 2. Type Checking
Prevent type errors before runtime:

```bash
# TypeScript
npm run type-check    # or tsc --noEmit

# Python
mypy src/

# Go (built-in)
go build ./...
```

#### 3. Test Coverage
Fail builds if coverage drops:

```yaml
# Example: GitHub Actions
- name: Run tests with coverage
  run: npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'
```

**Coverage thresholds:**
- **80%+ lines:** Good baseline
- **90%+ branches:** Strong coverage
- **100%:** Aspirational, not always practical

**What coverage doesn't catch:**
- Whether tests are meaningful
- Edge cases not exercised
- Integration issues

#### 4. Security Scanning
Catch vulnerabilities automatically:

```bash
# Dependency vulnerabilities
npm audit
pip-audit

# SAST (static analysis)
semgrep --config auto
bandit -r src/

# Secret scanning
gitleaks detect
trufflehog filesystem .
```

#### 5. Build Success
Ensure the code compiles and builds:

```bash
npm run build
cargo build --release
docker build -t myapp:test .
```

#### 6. Complexity Metrics
Flag overly complex code:

```bash
# Cyclomatic complexity
radon cc src/ --min B      # Python
eslint --rule 'complexity: ["error", 10]'  # JS/TS
```

**Thresholds:**
- Cyclomatic complexity > 10: Consider refactoring
- Function length > 50 lines: Likely doing too much
- File length > 500 lines: Possible single-responsibility violation

#### 7. Performance Regression Tests
Benchmark critical paths:

```javascript
// Example: Jest performance test
test('processes 10k records in < 500ms', async () => {
  const start = Date.now();
  await processRecords(largeDataset);
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(500);
});
```

### Pre-Commit Hooks

Use `husky` + `lint-staged` (JS/TS) or `pre-commit` (Python) to run checks before commits:

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
}
```

### CI Pipeline Structure

**Fast feedback loop (< 2 minutes):**
- Linting
- Type checking
- Unit tests

**Comprehensive checks (< 10 minutes):**
- Integration tests
- Security scans
- Build artifacts
- Deploy to staging

**Slow/optional (on-demand or nightly):**
- E2E tests
- Performance benchmarks
- Full security audit

## Review Patterns & Approaches

### Architecture Review vs Code Review

**Architecture review (before coding):**
- Focus: approach, design, technology choices
- Artifacts: design docs, diagrams, ADRs
- Attendees: architects, tech leads, senior engineers
- Outcome: approval to proceed or request for revision

**Code review (after coding):**
- Focus: implementation details, correctness, style
- Artifacts: pull request diff
- Attendees: any team member
- Outcome: approval to merge or request changes

**When to do both:**
- New features (> 500 lines)
- New services or modules
- Introduction of new frameworks or patterns
- Changes to core architecture

### Pair Programming as Review

**Live review benefits:**
- Instant feedback loop
- Shared context
- Learning opportunity for both parties
- Catches issues before commit

**When to pair instead of async review:**
- Complex or risky changes
- Knowledge transfer (onboarding)
- Persistent disagreements in async reviews
- Tight deadlines requiring fast iteration

**Format:**
- Driver writes code, navigator reviews in real-time
- Switch roles every 30-60 minutes
- Commit together with `Co-authored-by:` tags

### Async vs Synchronous Review

**Async (default):**
- Respects maker schedules (no interruptions)
- Reviewers can think deeply
- Documented discussion thread
- Scales to distributed teams

**Sync (video call, pairing):**
- Faster for complex reviews
- Reduces misunderstandings
- Builds relationships
- Better for high-stakes or architectural changes

### Rubber Duck vs Real Review

**Rubber duck (self-review):**
- Explain code line-by-line to an imaginary reviewer
- Catches obvious bugs and clarity issues
- Fast, no coordination needed

**Real review:**
- Catches issues you wouldn't see yourself
- Validates architectural choices
- Spreads knowledge across team
- Required for merge in most workflows

**Combine both:** Self-review first, then request human review.

## Common Issues to Catch

Train your eye to spot these recurring problems:

### 1. Security Holes

**SQL Injection:**
```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]);
```

**XSS (Cross-Site Scripting):**
```javascript
// ❌ Vulnerable
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;
// or use a sanitization library for rich text
```

**Hardcoded Secrets:**
```javascript
// ❌ Never commit secrets
const API_KEY = 'sk-abc123...';

// ✅ Use environment variables
const API_KEY = process.env.API_KEY;
```

**Missing Authentication/Authorization:**
```javascript
// ❌ No auth check
app.delete('/users/:id', async (req, res) => {
  await deleteUser(req.params.id);
});

// ✅ Check permissions
app.delete('/users/:id', requireAuth, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  await deleteUser(req.params.id);
});
```

### 2. N+1 Query Problems

```javascript
// ❌ N+1 queries (1 query for posts + N queries for authors)
const posts = await db.query('SELECT * FROM posts');
for (const post of posts) {
  post.author = await db.query('SELECT * FROM users WHERE id = $1', [post.author_id]);
}

// ✅ Single query with join or eager loading
const posts = await db.query(`
  SELECT posts.*, users.name as author_name
  FROM posts
  JOIN users ON posts.author_id = users.id
`);
```

### 3. Missing Error Handling

```javascript
// ❌ Unhandled promise rejection
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ Proper error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    throw error;  // or return default value, depending on context
  }
}
```

### 4. Inconsistent Naming

```javascript
// ❌ Mixed conventions
const user_id = 123;
const userName = 'Alice';
const UserEmail = 'alice@example.com';

// ✅ Consistent camelCase (for JS/TS)
const userId = 123;
const userName = 'Alice';
const userEmail = 'alice@example.com';
```

### 5. Dead Code

```javascript
// ❌ Unused imports, commented code
import { debounce } from 'lodash';  // never used
// const oldImplementation = () => { ... };

function processData(data) {
  // const temp = data.map(x => x * 2);  // old approach
  return data.filter(x => x > 0);
}

// ✅ Clean
function processData(data) {
  return data.filter(x => x > 0);
}
```

### 6. Magic Numbers

```javascript
// ❌ Magic numbers
if (user.age < 18) { ... }
setTimeout(checkStatus, 30000);

// ✅ Named constants
const LEGAL_AGE = 18;
const STATUS_CHECK_INTERVAL_MS = 30_000;

if (user.age < LEGAL_AGE) { ... }
setTimeout(checkStatus, STATUS_CHECK_INTERVAL_MS);
```

### 7. Poor Null/Undefined Handling

```javascript
// ❌ Assumes data exists
function getUserName(user) {
  return user.profile.name;  // crashes if profile is null
}

// ✅ Safe navigation
function getUserName(user) {
  return user?.profile?.name ?? 'Anonymous';
}
```

### 8. Overly Nested Logic

```javascript
// ❌ Deep nesting
function processOrder(order) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.isPaid) {
          // process order
        }
      }
    }
  }
}

// ✅ Early returns
function processOrder(order) {
  if (!order?.items?.length) return;
  if (!order.isPaid) return;

  // process order
}
```

### 9. Missing Input Validation

```javascript
// ❌ No validation
app.post('/users', async (req, res) => {
  const user = await createUser(req.body);
  res.json(user);
});

// ✅ Schema validation
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(120),
});

app.post('/users', async (req, res) => {
  const validated = CreateUserSchema.parse(req.body);
  const user = await createUser(validated);
  res.json(user);
});
```

### 10. Inefficient Algorithms

```javascript
// ❌ O(n²) lookup
function findDuplicates(arr) {
  const dupes = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) dupes.push(arr[i]);
    }
  }
  return dupes;
}

// ✅ O(n) with Set
function findDuplicates(arr) {
  const seen = new Set();
  const dupes = new Set();
  for (const item of arr) {
    if (seen.has(item)) dupes.add(item);
    seen.add(item);
  }
  return Array.from(dupes);
}
```

## AI-Assisted Code Review

### Using Claude Code for Reviews

Delegate to the reviewer agent when:
- You need a second opinion before submitting for human review
- You want to catch common issues quickly
- You're reviewing unfamiliar code and need guidance
- You're onboarding and learning review standards

**Command:**
```
/delegate reviewer — review the changes in src/auth.ts for security issues and best practices
```

**What AI review catches well:**
- Common security vulnerabilities (SQL injection, XSS)
- Style inconsistencies
- Missing error handling
- Dead code and unused imports
- Simple logic bugs
- Complexity metrics

**What AI review misses:**
- Business logic correctness (AI doesn't know your requirements)
- Architectural fit (AI doesn't know your system design)
- Team conventions not documented in code
- Subtle concurrency issues
- UX/design problems

### Automated Review Tools

**GitHub Copilot / CodeWhisperer:**
- Suggests code as you type
- Can catch common patterns

**Static Analysis (SAST):**
- SonarQube, CodeClimate, Snyk Code
- Automated quality and security checks

**PR Bots:**
- Danger.js — custom PR checks
- Renovate / Dependabot — dependency updates with auto-generated PRs
- CodeRabbit, Codacy — AI-powered review suggestions

### When Human Review Still Matters

**Always require human review for:**
1. **Security-critical code** (auth, payments, PII handling)
2. **Architecture changes** (new patterns, major refactors)
3. **Public API changes** (affects downstream consumers)
4. **Database migrations** (irreversible in production)
5. **Performance-critical paths** (hot loops, high-traffic endpoints)

**AI can assist but not replace:**
- Understanding business requirements
- Evaluating user experience
- Assessing team fit and maintainability
- Mentoring junior developers through reviews

### Combining AI and Human Review

**Workflow:**
1. **Self-review** (catch obvious issues yourself)
2. **AI review** (automated tools + Claude Code reviewer agent)
3. **Fix issues caught by AI** (security, style, complexity)
4. **Request human review** (architecture, logic, design)
5. **Iterate** based on human feedback

This layered approach ensures fast feedback on mechanical issues while preserving human judgment for complex decisions.

## Summary Checklist for Reviewers

Before approving a PR, confirm:

- [ ] Code does what it's supposed to do (correctness)
- [ ] Edge cases and errors are handled
- [ ] Tests are present and meaningful
- [ ] No security vulnerabilities (injection, XSS, exposed secrets)
- [ ] Performance is acceptable (no N+1 queries, unnecessary loops)
- [ ] Names are clear and consistent with project conventions
- [ ] Complexity is minimized (functions are short and focused)
- [ ] Documentation exists where needed
- [ ] No dead code or debug statements
- [ ] Architecture fits the existing system
- [ ] Backward compatibility is maintained (or breaking changes are documented)
- [ ] You understand what the code does and why

## Summary Checklist for Authors

Before requesting review:

- [ ] Self-reviewed the entire diff
- [ ] Ran linter, type checker, and tests locally
- [ ] Wrote a clear PR description (what, why, how, testing)
- [ ] PR is small (< 500 lines if possible)
- [ ] No console.log, commented code, or TODOs without tickets
- [ ] Tests cover new functionality and edge cases
- [ ] Documentation updated (README, API docs, etc.)
- [ ] Tagged the right reviewers
- [ ] Provided context for risky or complex sections

---

**Related Skills:** debugging-toolkit, tdd-workflow, security-first-development, performance-optimization, refactoring-safely

**References:**
- [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
- [Conventional Comments](https://conventionalcomments.org/)
- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)
