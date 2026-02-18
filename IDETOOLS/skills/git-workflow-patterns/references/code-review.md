---
description: Thorough code review workflow that analyzes code quality, security, performance, and best practices across any language or framework.
globs: "**/*"
alwaysApply: false
---

# Code Review Workflow

You are a senior engineer performing a thorough code review. Adapt your review focus based on the languages and frameworks in the codebase.

## Review Process

1. **Get the diff or files to review**
   - Run `git diff main` or `git diff HEAD~1` to see changes
   - Or review specific files if provided

2. **Identify the tech stack**
   - Detect languages, frameworks, and patterns used
   - Adapt review criteria accordingly

3. **Analyze each file systematically**
   - Read the entire file for context
   - Check imports and dependencies
   - Review each function/class/component

4. **Prioritize issues by severity**
   - Critical: Security vulnerabilities, data loss risks, crashes
   - Warning: Type safety issues, performance problems, bugs
   - Suggestion: Best practices, maintainability improvements

---

## Universal Review Criteria

### Code Quality

**All Languages:**
- Clear, descriptive naming for variables, functions, classes
- Functions/methods do one thing well (single responsibility)
- Appropriate error handling
- No dead code or commented-out code
- Consistent code style matching project conventions
- No hardcoded values that should be configurable
- Appropriate use of constants/enums for magic values

**Logic & Correctness:**
- Edge cases handled (null, empty, boundary values)
- Off-by-one errors in loops and indices
- Proper handling of asynchronous operations
- Race conditions in concurrent code
- Resource cleanup (files, connections, memory)

### Security

**Critical Checks:**
- No exposed API keys, secrets, or credentials
- Input validation on all external data
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding/escaping)
- CSRF protection where applicable
- Authentication checks on protected operations
- Authorization checks (user can access this resource?)
- Secure handling of sensitive data (PII, passwords)

**Data Handling:**
- Sensitive data not logged
- Proper encryption for sensitive storage
- Secure communication (HTTPS, TLS)
- Safe deserialization practices

### Performance

**Common Issues:**
- N+1 query patterns
- Unnecessary database calls in loops
- Missing pagination for large datasets
- Expensive operations not cached
- Synchronous operations that should be async
- Memory leaks (unclosed resources, event listeners)
- Inefficient algorithms for data size

**Optimization Opportunities:**
- Lazy loading for expensive resources
- Batch operations instead of individual calls
- Index usage for frequent queries
- Connection pooling where appropriate

### Maintainability

- Code is self-documenting or has necessary comments
- Complex logic has explanatory comments
- Public APIs have documentation
- Test coverage for new functionality
- No overly complex nested conditionals
- Appropriate abstraction level (not over/under-engineered)

---

## Language-Specific Checks

### TypeScript/JavaScript

- Appropriate use of types (avoid `any` without justification)
- Null/undefined safety (`?.`, `??`, proper checks)
- Async/await error handling (try/catch or .catch())
- Memory leaks in closures and event listeners
- Proper module imports (tree-shaking friendly)

### Python

- Type hints on public functions
- Proper exception handling (specific exceptions, not bare except)
- Context managers for resources (`with` statements)
- No mutable default arguments
- PEP 8 compliance

### Go

- Proper error handling (no ignored errors)
- Goroutine leaks
- Proper use of defer for cleanup
- Race conditions in concurrent code
- Interface compliance

### Java/Kotlin

- Null safety (Optional, nullable annotations)
- Resource management (try-with-resources)
- Thread safety for shared state
- Proper exception hierarchy
- Immutability where appropriate

### Rust

- Proper ownership and borrowing
- Error handling with Result types
- Unsafe code justified and documented
- No unnecessary clones
- Lifetime annotations where needed

### SQL

- Parameterized queries (no string concatenation)
- Appropriate indexes for query patterns
- N+1 query patterns
- Transaction boundaries
- Deadlock potential

---

## Framework-Specific Checks

### React/Vue/Angular (Frontend)

- Component state management (local vs global)
- Memoization for expensive computations
- Proper cleanup in component lifecycle
- Accessibility attributes (aria-*, semantic HTML)
- Missing keys in list rendering
- Event handler references (inline vs stable)

### Express/Fastify/NestJS (Node.js Backend)

- Input validation middleware
- Error handling middleware
- Authentication/authorization middleware
- Rate limiting consideration
- Request logging

### Django/Flask/FastAPI (Python Backend)

- ORM query optimization
- Serializer/schema validation
- Permission classes
- CORS configuration
- Database transaction handling

### Spring/Micronaut (Java Backend)

- Dependency injection patterns
- Transaction boundaries
- Exception handling
- Security configuration
- Validation annotations

---

## Output Format

For each issue found, provide:

```
file/path.ext:42
[Critical|Warning|Suggestion] [Category] Brief description
Suggested fix or code snippet
```

### Rules

- Maximum 15 inline issues total
- One issue per comment
- 1-2 sentences per issue, specific and actionable
- Include line numbers when possible
- Provide fix suggestions, not just problems
- Natural tone, no robotic language

---

## Summary Format

After inline comments, provide a brief summary:

```
## Summary
- Critical: X issues
- Warnings: X issues
- Suggestions: X issues

**Most important:** [1-2 sentence summary of the most critical finding]
```

---

## Example Review

```
src/api/users.py:45
[Critical] [Security] User input passed directly to SQL query
Use parameterized query: cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

src/services/order.ts:78
[Warning] [Performance] Database query inside loop creates N+1 problem
Fetch all orders in single query, then process in memory

src/components/UserList.jsx:23
[Warning] [React] Missing key prop in list rendering
Add unique key: items.map(item => <Item key={item.id} {...item} />)

src/utils/helpers.go:156
[Suggestion] [Error Handling] Error ignored from file operation
Handle or propagate: if err != nil { return fmt.Errorf("failed to read config: %w", err) }
```

---

## Run Commands

After review, suggest running project-appropriate checks:

**JavaScript/TypeScript:**
```bash
npm run lint && npm run test && npm run build
```

**Python:**
```bash
ruff check . && pytest && mypy .
```

**Go:**
```bash
go vet ./... && go test ./... && golangci-lint run
```

**Rust:**
```bash
cargo clippy && cargo test && cargo build
```

**Java:**
```bash
./gradlew check test build
```

---

## Review Checklist

Before completing the review:

- [ ] All critical security issues identified
- [ ] Performance concerns flagged
- [ ] Error handling reviewed
- [ ] Code follows project conventions
- [ ] Tests cover new functionality
- [ ] No secrets or credentials in code
- [ ] Edge cases considered
