# Adversarial Agent Pattern

Use this pattern when you need high-accuracy output for research, implementation, or any task where a single agent tends to hallucinate or miss issues.

---

## Pattern: Executor + Verifier

Two agents work in sequence, then iterate:

1. **Executor Agent** — performs the task (research, implementation, writing, etc.)
2. **Verifier Agent** — critically analyzes the executor's output for errors, inaccuracies, or gaps

The verifier is blocked until the executor produces a first draft. They then communicate back and forth until the output meets quality standards.

---

## Research Task Prompt

```
Set up two parallel agents for this research task:

TASK: [Describe the research task here]

AGENT 1 — Researcher:
- Conduct the research using available sources
- Produce a structured first draft with citations
- Respond to fact-checker feedback and correct errors

AGENT 2 — Fact-Checker:
- Wait for the researcher's first draft
- Verify every claim against the provided sources
- Flag inaccuracies, unsupported claims, or missing context
- Send corrections back to the researcher
- Repeat until all findings are verified

Both agents must communicate with each other. The fact-checker should not just approve — it should actively challenge the research. The task is complete only when both agents agree the output is accurate.
```

---

## Development Task Prompt

```
Set up two parallel agents for this implementation task:

TASK: [Describe the feature to implement]
PLAN: [Reference docs/architecture.md and docs/features.json]

AGENT 1 — Implementer:
- Implement the feature according to the plan
- Write clean, type-safe code following project conventions
- Respond to reviewer feedback and fix issues

AGENT 2 — Reviewer:
- Wait for the implementer's first pass
- Review the implementation against the plan in docs/
- Check for: correctness, edge cases, security, performance
- Flag issues and send them back to the implementer
- Verify fixes in subsequent rounds

The task is complete only when the reviewer approves the implementation.
```
