---
name: testing-master
description: >
  Comprehensive testing guide covering TDD, unit testing, integration testing,
  E2E with Playwright, and testing patterns across JavaScript, Python, and Bash.
  Consolidates 15 testing skills into one definitive reference.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Testing Master

## When to Use This Skill

Use when:
- User asks "write tests" or "add tests"
- User mentions TDD, test-driven development
- User asks to "fix failing tests"
- Code is complete but lacks test coverage
- You're about to implement a feature
- User asks about testing strategy or patterns
- Debugging flaky tests
- Setting up test infrastructure

## Testing Pyramid

```
        /\
       /  \  E2E (5-10%)
      /____\
     /      \ Integration (20-30%)
    /________\
   /          \ Unit (60-75%)
  /____________\
```

**Unit tests:** Fast, focused, test single functions/components in isolation
**Integration tests:** Test interaction between modules, services, or APIs
**E2E tests:** Test full user workflows through the UI (slowest, most brittle)

**Ratio:** Write many unit tests, some integration tests, few E2E tests.

**Why:** Unit tests are fast, deterministic, and easy to debug. E2E tests are slow, flaky, and hard to maintain. The pyramid keeps test suites fast while providing confidence.

## Test-Driven Development (TDD)

### Red-Green-Refactor Cycle

```
RED    → Write failing test FIRST (proves test works)
GREEN  → Write minimal code to pass (no more)
REFACTOR → Clean up while keeping tests green
```

**Critical:** Code written before test = delete it and start over with TDD.

**Why order matters:**
1. **RED proves test works** - If you never saw it fail, you don't know it tests the right thing
2. **GREEN prevents over-engineering** - Write only code needed to pass
3. **REFACTOR is safe** - Tests catch regressions

### TDD Workflow

```bash
# 1. RED - Write failing test
npm test -- user.test.ts  # Watch it fail

# 2. GREEN - Minimal implementation
# Write just enough code to pass

# 3. Verify GREEN
npm test -- user.test.ts  # Watch it pass

# 4. REFACTOR - Clean up
# Improve code structure while tests stay green

# 5. Commit
git add . && git commit -m "feat: add user validation with TDD"
```

### London vs Chicago School

**Chicago (Classicist):**
- Test behavior, not implementation
- Minimal mocking (only external dependencies)
- Tests verify real object interactions

**London (Mockist):**
- Test each class in isolation
- Mock all collaborators
- Faster tests, more brittle

**Recommendation:** Start with Chicago (less mocking). Add mocks only when needed for speed or to isolate external systems.

### When TDD Makes Sense

**Yes:**
- Business logic (calculations, validation, rules)
- Algorithms (sorting, parsing, transformation)
- APIs (endpoints, handlers)
- Utilities (formatters, validators)
- Bug fixes (write test reproducing bug first)

**No:**
- UI layout/styling (use visual regression instead)
- One-off scripts
- Prototypes/spikes (but add tests before merging)

## Unit Testing Patterns

### AAA Pattern (Arrange-Act-Assert)

```typescript
test('calculates total price with tax', () => {
  // ARRANGE - Set up test data
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ];
  const taxRate = 0.08;

  // ACT - Execute the behavior
  const total = calculateTotal(items, taxRate);

  // ASSERT - Verify the result
  expect(total).toBe(270); // (200 + 50) * 1.08
});
```

### Test Naming Conventions

```typescript
// Pattern: test('does X when Y', () => {})
test('returns empty array when no items provided', () => {});
test('throws error when price is negative', () => {});
test('rounds to two decimal places', () => {});

// Or: describe/it BDD style
describe('calculateTotal', () => {
  it('applies tax correctly', () => {});
  it('handles empty cart', () => {});
});
```

### Mocking Strategies

**When to mock:**
- External APIs (HTTP, databases)
- Slow operations (file I/O, network)
- Non-deterministic behavior (Date.now(), Math.random())

**When NOT to mock:**
- Pure functions in your codebase
- Simple objects/data structures
- Logic you're testing

**The Iron Laws:**
1. **NEVER test mock behavior** (test real behavior or don't mock)
2. **NEVER add test-only methods to production code**
3. **NEVER mock without understanding dependencies**

### JavaScript/TypeScript (Vitest)

```typescript
// Basic test
import { describe, it, expect } from 'vitest';
import { sum } from './math';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(sum(-5, 3)).toBe(-2);
  });
});

// Mocking external dependencies
import { vi } from 'vitest';
import { fetchUser } from './api';

vi.mock('./api', () => ({
  fetchUser: vi.fn()
}));

test('handles API response', async () => {
  // Mock only the external HTTP call
  fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });

  const user = await getUserProfile(1);

  expect(user.name).toBe('Alice');
  expect(fetchUser).toHaveBeenCalledWith(1);
});

// Testing async code
test('waits for promise', async () => {
  const result = await asyncOperation();
  expect(result).toBe('done');
});

// Testing errors
test('throws on invalid input', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});
```

### Python (pytest)

```python
# Basic test
def test_sum():
    assert sum([1, 2, 3]) == 6

def test_empty_list():
    assert sum([]) == 0

# Parametrized tests (multiple inputs)
import pytest

@pytest.mark.parametrize("input,expected", [
    ([1, 2, 3], 6),
    ([10, 20], 30),
    ([], 0),
    ([-5, 5], 0),
])
def test_sum_variations(input, expected):
    assert sum(input) == expected

# Fixtures (reusable test data)
@pytest.fixture
def sample_user():
    return User(id=1, name="Alice", email="alice@example.com")

def test_user_email(sample_user):
    assert sample_user.email == "alice@example.com"

def test_user_display_name(sample_user):
    assert sample_user.display_name() == "Alice"

# Mocking external calls
from unittest.mock import Mock, patch

def test_api_call():
    with patch('myapp.api.requests.get') as mock_get:
        mock_get.return_value.json.return_value = {'status': 'ok'}

        result = fetch_status()

        assert result == 'ok'
        mock_get.assert_called_once()

# Testing exceptions
def test_invalid_user():
    with pytest.raises(ValueError, match="Invalid email"):
        User(id=1, name="Bob", email="invalid")

# Async tests
import pytest

@pytest.mark.asyncio
async def test_async_fetch():
    result = await fetch_data()
    assert result['status'] == 'success'
```

## Integration Testing

### API Testing

```typescript
// Testing Express endpoints
import request from 'supertest';
import { app } from './app';

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Alice',
      email: 'alice@example.com'
    });
  });

  it('rejects duplicate email', async () => {
    await createUser({ email: 'alice@example.com' });

    await request(app)
      .post('/api/users')
      .send({ name: 'Bob', email: 'alice@example.com' })
      .expect(409);
  });
});
```

### Database Testing

```python
# Pytest with database transactions
import pytest
from sqlalchemy import create_engine
from myapp.models import User, Base

@pytest.fixture(scope='function')
def db_session():
    # Create in-memory SQLite for tests
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    yield session

    session.rollback()
    session.close()

def test_create_user(db_session):
    user = User(name="Alice", email="alice@example.com")
    db_session.add(user)
    db_session.commit()

    found = db_session.query(User).filter_by(email="alice@example.com").first()
    assert found.name == "Alice"

def test_unique_email_constraint(db_session):
    db_session.add(User(name="Alice", email="test@example.com"))
    db_session.commit()

    db_session.add(User(name="Bob", email="test@example.com"))

    with pytest.raises(IntegrityError):
        db_session.commit()
```

### Service-to-Service Testing

```typescript
// Testing microservice interactions
describe('Order Service -> Payment Service', () => {
  let paymentServiceMock: MockServer;

  beforeEach(() => {
    // Start mock HTTP server
    paymentServiceMock = createMockServer(3001);
  });

  afterEach(() => {
    paymentServiceMock.close();
  });

  it('processes payment and updates order status', async () => {
    // Mock payment service response
    paymentServiceMock.post('/charge', (req, res) => {
      res.json({ status: 'success', transactionId: 'txn_123' });
    });

    const order = await createOrder({ total: 100 });
    await processOrderPayment(order.id);

    const updated = await getOrder(order.id);
    expect(updated.status).toBe('paid');
    expect(updated.transactionId).toBe('txn_123');
  });
});
```

## E2E Testing with Playwright

### Setup and Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2, // Retry flaky tests
  workers: 4, // Parallel workers

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
});
```

### Page Object Model

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('[data-testid="login-submit"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// e2e/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
});
```

### Selectors Best Practices

**Priority order (most to least stable):**

1. **data-testid** (best - explicit test hooks)
   ```typescript
   page.locator('[data-testid="submit-button"]')
   ```

2. **Role + accessible name** (good - semantic)
   ```typescript
   page.getByRole('button', { name: 'Submit' })
   page.getByRole('textbox', { name: 'Email' })
   ```

3. **Text content** (ok for unique text)
   ```typescript
   page.getByText('Sign up')
   ```

4. **CSS classes** (avoid - implementation detail)
   ```typescript
   page.locator('.btn-primary') // ❌ Breaks when styling changes
   ```

### Handling Async/Waiting

```typescript
// ✅ GOOD: Auto-waiting (Playwright waits automatically)
await page.click('[data-testid="submit"]');
await expect(page.locator('.success-message')).toBeVisible();

// ✅ GOOD: Wait for specific condition
await page.waitForSelector('[data-testid="results"]');
await page.waitForURL('/dashboard');
await page.waitForLoadState('networkidle');

// ❌ BAD: Fixed delays (flaky)
await page.click('[data-testid="submit"]');
await page.waitForTimeout(1000); // Don't do this
```

### Screenshot and Video on Failure

```typescript
// Auto-configured in playwright.config.ts
// No code needed - screenshots/videos saved automatically on failure

// Manual screenshot for debugging
await page.screenshot({ path: 'debug.png', fullPage: true });

// Visual comparison
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100
});
```

### CI Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Testing Anti-Patterns (What NOT to Do)

### 1. Testing Mock Behavior

```typescript
// ❌ BAD: Testing that the mock exists
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
});

// ✅ GOOD: Test real component or don't mock it
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
```

**Ask:** "Am I testing real component behavior or just mock existence?"

### 2. Testing Implementation Details

```typescript
// ❌ BAD: Testing internal state
test('counter increments', () => {
  const counter = new Counter();
  counter.increment();
  expect(counter._internalCount).toBe(1); // Private implementation
});

// ✅ GOOD: Test public behavior
test('counter increments', () => {
  const counter = new Counter();
  counter.increment();
  expect(counter.getValue()).toBe(1);
});
```

### 3. Over-Mocking

```typescript
// ❌ BAD: Mocking everything
vi.mock('./UserService');
vi.mock('./EmailService');
vi.mock('./Logger');
vi.mock('./Database');

// ✅ GOOD: Mock only external/slow dependencies
vi.mock('./api'); // External HTTP
// Use real services for business logic
```

### 4. Flaky Tests

**Common causes:**
- Fixed timeouts: `await sleep(1000)`
- Race conditions: accessing DOM before ready
- Test interdependence: tests share state
- Non-deterministic data: `Date.now()`, `Math.random()`

**Fixes:**
```typescript
// ❌ BAD: Fixed timeout
await click(button);
await sleep(1000);
expect(result).toBeVisible();

// ✅ GOOD: Wait for condition
await click(button);
await waitFor(() => expect(result).toBeVisible());

// ❌ BAD: Non-deterministic
const id = Math.random();

// ✅ GOOD: Controlled randomness
const id = faker.seed(123).datatype.uuid();
```

### 5. Slow Test Suites

**Causes:**
- Too many E2E tests (use unit tests instead)
- Not running in parallel
- Starting real servers for every test
- No test database cleanup

**Fixes:**
- Move logic to unit tests (10,000x faster)
- Use `vitest --threads` or `pytest -n auto`
- Use in-memory databases for tests
- Clean up with transactions, not full database resets

### 6. Testing Private Methods

```python
# ❌ BAD: Testing private implementation
def test_internal_calculation():
    calc = Calculator()
    result = calc._internal_sum([1, 2, 3])  # Private method
    assert result == 6

# ✅ GOOD: Test through public interface
def test_calculate_total():
    calc = Calculator()
    result = calc.calculate_total([1, 2, 3])
    assert result == 6
```

**Rule:** If a private method needs testing, it probably should be a separate public function.

## JavaScript/TypeScript Testing (Vitest, Jest)

### Setup with Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // For React/DOM testing
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.config.ts', '**/dist/**', '**/test/**'],
    },
  },
});
```

### Component Testing (React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import { LoginForm } from './LoginForm';

test('submits form with email and password', async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  // Find elements by role (accessible)
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  // Interact with form
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  // Verify callback
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});

test('shows validation error for invalid email', async () => {
  render(<LoginForm onSubmit={vi.fn()} />);

  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /submit/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

### Snapshot Testing (Use Sparingly)

```typescript
// Only for stable UI components
test('renders header correctly', () => {
  const { container } = render(<Header title="Dashboard" />);
  expect(container.firstChild).toMatchSnapshot();
});

// ❌ BAD: Snapshots for everything (brittle, meaningless diffs)
// ✅ GOOD: Snapshots for complex, stable structures (error messages, configs)
```

### Coverage Configuration

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Coverage targets:**
- Critical business logic: 90-100%
- API routes: 80-90%
- Utilities: 80-90%
- UI components: 60-70% (focus on behavior, not coverage)

**Don't chase 100% coverage** - focus on testing critical paths and edge cases.

## Python Testing (pytest)

### Fixtures and conftest.py

```python
# conftest.py - shared fixtures
import pytest
from myapp import create_app, db

@pytest.fixture(scope='session')
def app():
    """Create app instance for testing."""
    app = create_app('testing')
    return app

@pytest.fixture(scope='function')
def client(app):
    """Test client for API requests."""
    return app.test_client()

@pytest.fixture(scope='function')
def db_session(app):
    """Database session with rollback."""
    with app.app_context():
        db.create_all()
        yield db.session
        db.session.rollback()
        db.drop_all()

# test_users.py - use fixtures
def test_create_user(client, db_session):
    response = client.post('/api/users', json={
        'name': 'Alice',
        'email': 'alice@example.com'
    })

    assert response.status_code == 201
    assert response.json['email'] == 'alice@example.com'
```

### Parametrize Decorator

```python
@pytest.mark.parametrize("input,expected", [
    ("", False),
    ("a", False),
    ("ab", False),
    ("abc", True),
    ("hello@example.com", True),
    ("@example.com", False),
    ("hello@", False),
])
def test_email_validation(input, expected):
    assert is_valid_email(input) == expected
```

### Async Testing

```python
import pytest
import asyncio

@pytest.mark.asyncio
async def test_async_fetch():
    result = await fetch_user_data(123)
    assert result['id'] == 123

@pytest.mark.asyncio
async def test_concurrent_requests():
    results = await asyncio.gather(
        fetch_user_data(1),
        fetch_user_data(2),
        fetch_user_data(3),
    )
    assert len(results) == 3
```

### Coverage with pytest-cov

```bash
# Install
pip install pytest-cov

# Run with coverage
pytest --cov=myapp --cov-report=html

# Open coverage report
open htmlcov/index.html
```

## Bash/Shell Testing (bats)

### bats-core Setup

```bash
# Install bats-core
git clone https://github.com/bats-core/bats-core.git
cd bats-core
./install.sh /usr/local

# Install helper libraries
git clone https://github.com/bats-core/bats-support.git test/test_helper/bats-support
git clone https://github.com/bats-core/bats-assert.git test/test_helper/bats-assert
```

### Testing CLI Tools

```bash
# test/cli.bats
#!/usr/bin/env bats

load 'test_helper/bats-support/load'
load 'test_helper/bats-assert/load'

setup() {
  # Runs before each test
  export TEST_DIR="$(mktemp -d)"
  export PATH="$PWD/bin:$PATH"
}

teardown() {
  # Runs after each test
  rm -rf "$TEST_DIR"
}

@test "cli exits with 0 on success" {
  run mycli --version
  assert_success
  assert_output --partial "1.0.0"
}

@test "cli shows help when no arguments" {
  run mycli
  assert_failure
  assert_output --partial "Usage:"
}

@test "cli processes file correctly" {
  echo "test data" > "$TEST_DIR/input.txt"

  run mycli process "$TEST_DIR/input.txt"

  assert_success
  assert_output "Processed 1 lines"
  assert [ -f "$TEST_DIR/input.txt.processed" ]
}

@test "cli handles missing file" {
  run mycli process /nonexistent/file.txt

  assert_failure
  assert_output --partial "File not found"
}
```

### Mocking Commands

```bash
@test "script uses correct git commands" {
  # Create mock git command
  git() {
    echo "git $*" >> "$TEST_DIR/git-calls.log"
    return 0
  }
  export -f git

  run ./deploy.sh

  assert_success
  assert [ -f "$TEST_DIR/git-calls.log" ]

  run cat "$TEST_DIR/git-calls.log"
  assert_line --partial "git pull origin main"
  assert_line --partial "git push origin main"
}
```

## Testing with Claude Code Subagents

### Using /delegate tdd for Test-First Development

```markdown
# In Claude Code conversation
User: I need to add user validation logic

You: Let me delegate to the TDD specialist to implement this test-first.

/delegate tdd Implement user email validation:
- Required field
- Must be valid email format
- Must be unique in database
- Returns validation errors

Source files:
- src/models/User.ts
- src/validators/

Follow strict TDD: RED-GREEN-REFACTOR cycle.
```

**TDD agent will:**
1. Write failing test first (RED)
2. Run test to verify failure
3. Implement minimal code (GREEN)
4. Run test to verify pass
5. Refactor while keeping tests green

### Parallel Test Execution via Task Agents

```typescript
// Run multiple test suites in parallel via subagents
const testSuites = [
  { name: 'unit', path: './tests/unit' },
  { name: 'integration', path: './tests/integration' },
  { name: 'e2e', path: './tests/e2e' },
];

// Delegate each suite to separate agent
testSuites.forEach(suite => {
  // Task tool creates isolated agent
  // Each runs tests in parallel
  // Aggregate results at end
});
```

### Test Fixing Workflow

```markdown
User: Tests are failing after my changes

You: Let me analyze the failures and delegate fixes.

1. Read test output (identify which tests failed)
2. /delegate debugger Investigate test failures in:
   - tests/user.test.ts (3 failures)
   - tests/api.test.ts (1 failure)

3. For each failure:
   - Understand what changed
   - Fix test or fix code
   - Re-run to verify

4. Report results to user
```

## QA Planning

### Test Plan Template

```markdown
# Test Plan: [Feature Name]

## Scope
**In scope:**
- User authentication flow
- Password reset
- Session management

**Out of scope:**
- OAuth providers (future phase)

## Test Strategy

### Unit Tests (70%)
- Auth service logic
- Token generation/validation
- Password hashing

### Integration Tests (20%)
- API endpoints
- Database operations
- Email sending

### E2E Tests (10%)
- Login flow
- Logout flow
- Password reset flow

## Test Environment
- Local: SQLite in-memory
- CI: PostgreSQL 15
- Staging: Production-like setup

## Entry Criteria
- Feature implementation complete
- Code review passed
- Test data prepared

## Exit Criteria
- All tests passing
- Coverage > 80% for critical paths
- No high-severity bugs

## Risks
- Email delivery (mock in tests, verify in staging)
- Session concurrency (load testing needed)
```

### Risk-Based Testing Prioritization

**High Priority (test first):**
- Payment processing
- User authentication
- Data loss scenarios
- Security vulnerabilities

**Medium Priority:**
- Form validation
- Navigation flows
- Error handling

**Low Priority:**
- UI styling
- Non-critical features
- Nice-to-have functionality

**Formula:** `Priority = (Impact × Likelihood) / Cost`

### Regression Test Strategy

```markdown
## Regression Test Suite

### Smoke Tests (5 min)
Run before every commit:
- App starts
- Login works
- Core feature works

### Sanity Tests (15 min)
Run before every PR merge:
- All critical paths
- Recent bug fixes
- Integration points

### Full Regression (1 hour)
Run nightly:
- All unit tests
- All integration tests
- Selected E2E tests

### Release Regression (4 hours)
Run before release:
- Full test suite
- E2E on all browsers
- Performance benchmarks
```

## Quick Reference: Test Selection Guide

| Scenario | Test Type | Why |
|----------|-----------|-----|
| Pure function (no I/O) | Unit | Fast, deterministic |
| Business logic | Unit | Core behavior, needs speed |
| API endpoint | Integration | Tests request/response cycle |
| Database query | Integration | Tests real SQL execution |
| User workflow | E2E | Tests full stack + UI |
| Bug fix | Unit (regression) | Prevent re-occurrence |
| External API | Integration (mocked) | Control responses, test edge cases |
| UI component | Unit (RTL) | Test behavior, not styling |
| Shell script | Bats | Test CLI behavior |

## Red Flags

**STOP if you're doing any of these:**
- Testing mock behavior instead of real behavior
- Adding test-only methods to production classes
- Mocking without understanding dependencies
- Writing code before tests (delete and restart with TDD)
- Chasing 100% coverage instead of testing critical paths
- Using fixed `sleep()` timeouts
- Testing private methods
- Snapshots for everything
- Writing tests after claiming "implementation complete"

## The Bottom Line

**Test-first development catches bugs before they exist.**

**RED-GREEN-REFACTOR is the cycle** - if you didn't watch the test fail, you don't know it works.

**Mock minimally** - only external/slow dependencies, not your own logic.

**Test behavior, not implementation** - users care what it does, not how.

**Fast feedback wins** - unit tests should run in milliseconds, full suite in seconds.

**If you wrote code before tests: delete it and start over with TDD.**
