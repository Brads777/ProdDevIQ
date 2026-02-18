# Reverse Prompting — Failure Prediction Audit

Use this prompt after implementation and testing are complete, but before deployment.
It pushes the agent to find issues that standard testing misses.

---

## Prompt

```
Review the entire implementation of this project and identify areas where the app could fail. Do NOT limit yourself to what tests already cover.

Approach this from multiple angles:

1. **Security vulnerabilities**
   - Input validation gaps
   - Authentication/authorization edge cases
   - Data exposure risks
   - Injection vectors (SQL, XSS, command injection)

2. **Race conditions and concurrency**
   - Simultaneous user actions
   - API call ordering assumptions
   - State management conflicts

3. **Error handling gaps**
   - Unhandled promise rejections
   - Network failure scenarios
   - Timeout handling
   - Graceful degradation when dependencies are unavailable

4. **Data integrity**
   - Edge cases in data transformations
   - Boundary values (empty strings, zero, null, max int)
   - Unicode and special character handling
   - Time zone and locale issues

5. **Performance under stress**
   - Large dataset handling
   - Memory leaks in long-running processes
   - N+1 query patterns
   - Missing pagination or rate limiting

6. **User experience gaps**
   - Loading states
   - Error feedback to users
   - Accessibility issues
   - Mobile/responsive edge cases

For each issue found:
- Describe the failure scenario
- Rate severity: critical / high / medium / low
- Suggest a specific fix
- Indicate which file(s) are affected

Output as a structured list sorted by severity (critical first).
```

---

## When to Use

- After all features pass their acceptance criteria
- After all user stories are implemented and tested
- Before merging to main / deploying to production
- As part of a PR review process
