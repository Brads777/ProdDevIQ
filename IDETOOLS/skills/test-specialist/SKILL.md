---
name: test-specialist
description: This skill provides systematic testing methodologies and debugging techniques for any programming language. Use it for writing test cases, fixing bugs, analyzing code for potential issues, or improving test coverage. Supports unit tests, integration tests, end-to-end tests, debugging runtime errors, logic bugs, performance issues, security vulnerabilities, and systematic code analysis across JavaScript/TypeScript, Python, Go, Rust, Java, and more.
---
# ©2026 Brad Scheller

# Test Specialist

## Overview

Apply systematic testing methodologies and debugging techniques to software projects in any language. This skill provides comprehensive testing strategies, bug analysis frameworks, and automated tools for identifying coverage gaps and untested code.

## Core Capabilities

### 1. Writing Test Cases

Write comprehensive tests covering unit, integration, and end-to-end scenarios.

#### Universal Testing Principles

**AAA Pattern (Arrange-Act-Assert):**
Structure all tests with clear phases:
1. **Arrange**: Set up test data and preconditions
2. **Act**: Execute the code being tested
3. **Assert**: Verify the expected outcome

**Key principles:**
- Test one behavior per test
- Cover happy path, edge cases, and error conditions
- Use descriptive test names that explain the scenario
- Keep tests independent and isolated
- Tests should be deterministic (same result every run)

---

#### Language-Specific Examples

**JavaScript/TypeScript (Jest/Vitest):**
```typescript
describe('ExpenseCalculator', () => {
  describe('calculateTotal', () => {
    test('sums expense amounts correctly', () => {
      // Arrange
      const expenses = [
        { amount: 100, category: 'food' },
        { amount: 50, category: 'transport' }
      ];
      // Act
      const total = calculateTotal(expenses);
      // Assert
      expect(total).toBe(150);
    });

    test('handles empty expense list', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });
});
```

**Python (pytest):**
```python
import pytest
from calculator import calculate_total

class TestExpenseCalculator:
    def test_sums_expense_amounts_correctly(self):
        # Arrange
        expenses = [
            {"amount": 100, "category": "food"},
            {"amount": 50, "category": "transport"}
        ]
        # Act
        total = calculate_total(expenses)
        # Assert
        assert total == 150

    def test_handles_empty_expense_list(self):
        assert calculate_total([]) == 0

    @pytest.mark.parametrize("amounts,expected", [
        ([10, 20, 30], 60),
        ([0, 0, 0], 0),
        ([-10, 20], 10),
    ])
    def test_various_inputs(self, amounts, expected):
        expenses = [{"amount": a, "category": "test"} for a in amounts]
        assert calculate_total(expenses) == expected
```

**Go (testing package):**
```go
func TestCalculateTotal(t *testing.T) {
    tests := []struct {
        name     string
        expenses []Expense
        want     float64
    }{
        {
            name: "sums expense amounts correctly",
            expenses: []Expense{
                {Amount: 100, Category: "food"},
                {Amount: 50, Category: "transport"},
            },
            want: 150,
        },
        {
            name:     "handles empty expense list",
            expenses: []Expense{},
            want:     0,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := CalculateTotal(tt.expenses)
            if got != tt.want {
                t.Errorf("CalculateTotal() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

**Rust (built-in tests):**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_total_sums_correctly() {
        let expenses = vec![
            Expense { amount: 100.0, category: "food".to_string() },
            Expense { amount: 50.0, category: "transport".to_string() },
        ];
        assert_eq!(calculate_total(&expenses), 150.0);
    }

    #[test]
    fn test_calculate_total_empty_list() {
        let expenses: Vec<Expense> = vec![];
        assert_eq!(calculate_total(&expenses), 0.0);
    }
}
```

**Java (JUnit 5):**
```java
@DisplayName("Expense Calculator Tests")
class ExpenseCalculatorTest {

    @Test
    @DisplayName("sums expense amounts correctly")
    void sumsExpenseAmountsCorrectly() {
        // Arrange
        List<Expense> expenses = List.of(
            new Expense(100, "food"),
            new Expense(50, "transport")
        );
        // Act
        double total = ExpenseCalculator.calculateTotal(expenses);
        // Assert
        assertEquals(150.0, total);
    }

    @ParameterizedTest
    @CsvSource({
        "100,50,150",
        "0,0,0",
        "-10,20,10"
    })
    void testVariousInputs(int a, int b, int expected) {
        List<Expense> expenses = List.of(
            new Expense(a, "test"),
            new Expense(b, "test")
        );
        assertEquals(expected, ExpenseCalculator.calculateTotal(expenses));
    }
}
```

---

### 2. Integration Testing

Test how components work together, including database, API, and service interactions.

**Key concerns:**
- Database state management (setup/teardown)
- External service mocking
- Transaction handling
- Test isolation

**JavaScript (Supertest):**
```typescript
describe('Expense API', () => {
  beforeEach(async () => {
    await database.clear();
    await seedTestData();
  });

  test('POST /expenses creates expense', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .send({ amount: 50, category: 'food' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      amount: 50
    });
  });
});
```

**Python (pytest with fixtures):**
```python
@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db_session(app):
    with app.app_context():
        db.create_all()
        yield db.session
        db.drop_all()

def test_create_expense(client, db_session):
    response = client.post('/api/expenses', json={
        'amount': 50,
        'category': 'food'
    })
    assert response.status_code == 201
    assert response.json['amount'] == 50
```

**Go (httptest):**
```go
func TestCreateExpense(t *testing.T) {
    router := setupTestRouter()

    body := `{"amount": 50, "category": "food"}`
    req := httptest.NewRequest("POST", "/api/expenses", strings.NewReader(body))
    req.Header.Set("Content-Type", "application/json")

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    if w.Code != http.StatusCreated {
        t.Errorf("expected status 201, got %d", w.Code)
    }
}
```

---

### 3. End-to-End Testing

Test complete user workflows using browser automation tools.

**Playwright (JavaScript/TypeScript):**
```typescript
test('user can add expense', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-expense-btn"]');
  await page.fill('[data-testid="amount"]', '50.00');
  await page.selectOption('[data-testid="category"]', 'food');
  await page.click('[data-testid="submit"]');

  await expect(page.locator('[data-testid="expense-item"]'))
    .toContainText('$50.00');
});
```

**Selenium (Python):**
```python
def test_user_can_add_expense(driver):
    driver.get("http://localhost:3000")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="add-expense-btn"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="amount"]').send_keys("50.00")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="submit"]').click()

    expense_item = driver.find_element(By.CSS_SELECTOR, '[data-testid="expense-item"]')
    assert "$50.00" in expense_item.text
```

---

### 4. Systematic Bug Analysis

Apply structured debugging methodology to identify and fix issues.

#### Five-Step Analysis Process

1. **Reproduction**: Reliably reproduce the bug
   - Document exact steps to trigger
   - Identify required environment/state
   - Note expected vs actual behavior

2. **Isolation**: Narrow down the problem
   - Binary search through code path
   - Create minimal reproduction case
   - Remove unrelated dependencies

3. **Root Cause Analysis**: Determine underlying cause
   - Trace execution flow
   - Check assumptions and preconditions
   - Review recent changes (`git blame`)

4. **Fix Implementation**: Implement solution
   - Write failing test first (TDD)
   - Implement the fix
   - Verify test passes

5. **Validation**: Ensure completeness
   - Run full test suite
   - Test edge cases
   - Verify no regressions

#### Common Bug Patterns

**Race Conditions:**
```typescript
test('handles concurrent updates correctly', async () => {
  const promises = Array.from({ length: 100 }, () => incrementCounter());
  await Promise.all(promises);
  expect(getCounter()).toBe(100);
});
```

**Null/Undefined Errors:**
```python
@pytest.mark.parametrize("invalid_input", [None, "", 0, False, []])
def test_handles_invalid_input(invalid_input):
    with pytest.raises(ValueError):
        process_expense(invalid_input)
```

**Off-by-One Errors:**
```go
func TestPaginationBoundaries(t *testing.T) {
    items := make([]int, 25)

    // Test last page with partial items
    result := paginate(items, 3, 10)
    if len(result) != 5 {
        t.Errorf("expected 5 items on last page, got %d", len(result))
    }
}
```

---

### 5. Test Coverage Analysis

Use automated tools to identify gaps in test coverage.

#### Finding Untested Code

Run the provided script to identify source files without tests:

```bash
python3 scripts/find_untested_code.py src
```

The script will:
- Scan source directory for all code files
- Identify which files lack corresponding test files
- Categorize untested files by type
- Prioritize files that need testing most

#### Coverage Commands by Language

**JavaScript/TypeScript:**
```bash
npm test -- --coverage
# or
vitest run --coverage
```

**Python:**
```bash
pytest --cov=src --cov-report=html
# or
coverage run -m pytest && coverage html
```

**Go:**
```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**Rust:**
```bash
cargo tarpaulin --out Html
# or with llvm-cov
cargo llvm-cov --html
```

**Java:**
```bash
./gradlew jacocoTestReport
# or
mvn jacoco:report
```

#### Coverage Targets

| Code Type | Target Coverage |
|-----------|-----------------|
| Critical paths | 90%+ |
| Business logic | 85%+ |
| API endpoints | 80%+ |
| UI components | 75%+ |
| Utilities | 70%+ |

---

### 6. Test Code Quality

Ensure tests remain valuable and maintainable.

#### Best Practices

**DRY - Extract common setup:**
```typescript
function createTestExpense(overrides = {}) {
  return {
    amount: 50,
    category: 'food',
    date: new Date('2024-01-01'),
    ...overrides
  };
}
```

**Clear test data:**
```python
# Bad: Magic numbers
assert calculate_discount(100, 0.15) == 85

# Good: Named constants
ORIGINAL_PRICE = 100
DISCOUNT_RATE = 0.15
EXPECTED_PRICE = 85
assert calculate_discount(ORIGINAL_PRICE, DISCOUNT_RATE) == EXPECTED_PRICE
```

**Independent tests:**
```go
// Bad: Tests share state
var sharedCounter int

// Good: Each test creates its own state
func TestCounter(t *testing.T) {
    counter := NewCounter()
    counter.Increment()
    if counter.Value() != 1 {
        t.Error("expected 1")
    }
}
```

---

## Testing Frameworks by Language

| Language | Unit Testing | Integration | E2E |
|----------|--------------|-------------|-----|
| JavaScript/TypeScript | Jest, Vitest, Mocha | Supertest, MSW | Playwright, Cypress |
| Python | pytest, unittest | pytest-django, FastAPI TestClient | Selenium, Playwright |
| Go | testing (built-in) | httptest | Chromedp |
| Rust | built-in #[test] | actix-test, tower-test | - |
| Java | JUnit 5, TestNG | Spring Test, MockMvc | Selenium |
| C# | xUnit, NUnit | WebApplicationFactory | Playwright |

---

## Running Tests

**JavaScript/TypeScript:**
```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
npm test -- MyTest.test.ts  # Specific file
```

**Python:**
```bash
pytest                      # Run all tests
pytest -v                   # Verbose
pytest --cov=src            # With coverage
pytest test_file.py         # Specific file
pytest -k "test_name"       # By name pattern
```

**Go:**
```bash
go test ./...               # All packages
go test -v ./...            # Verbose
go test -cover ./...        # With coverage
go test -run TestName       # Specific test
```

**Rust:**
```bash
cargo test                  # All tests
cargo test -- --nocapture   # Show output
cargo test test_name        # Specific test
```

**Java:**
```bash
./gradlew test              # Gradle
mvn test                    # Maven
./gradlew test --tests MyTest  # Specific test
```

---

## Reference Documentation

For detailed patterns and techniques, refer to:

- `references/testing_patterns.md` - Comprehensive testing patterns, best practices, and code examples
- `references/bug_analysis.md` - In-depth bug analysis framework, common bug patterns, and debugging techniques

---

## Scripts

### analyze_coverage.py

Analyze coverage reports to identify gaps:

```bash
python3 scripts/analyze_coverage.py [coverage-file]
```

### find_untested_code.py

Find source files without corresponding test files:

```bash
python3 scripts/find_untested_code.py [src-dir] [--pattern test|spec]
```

---

## Best Practices Summary

1. **Write tests first** (TDD) when adding new features
2. **Test behavior, not implementation** - tests should survive refactoring
3. **Keep tests independent** - no shared state between tests
4. **Use descriptive names** - test names should explain the scenario
5. **Cover edge cases** - null, empty, boundary values, error conditions
6. **Mock external dependencies** - tests should be fast and reliable
7. **Maintain high coverage** - 80%+ for critical code
8. **Fix failing tests immediately** - never commit broken tests
9. **Refactor tests** - apply same quality standards as production code
10. **Use tools** - automate coverage analysis and gap identification
