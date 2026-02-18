# Multi-Hypothesis Debugging

## Pattern Name

Competing Theories — multiple agents investigate different hypotheses about a bug simultaneously.

## When to Use

- A bug has no obvious cause and could stem from multiple systems
- Single-threaded debugging is slow because each hypothesis takes significant investigation time
- You want to avoid anchoring bias: a single agent latches onto the first plausible theory and stops looking
- Production issues where speed of diagnosis matters
- Intermittent or hard-to-reproduce bugs

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Defines hypotheses, spawns investigators, synthesizes findings, decides root cause | Delegate mode | None (does not edit) |
| **investigator-1** | Tests hypothesis 1 | Read + limited write | Owns: `debug-report-1.md`, any scratch/test files |
| **investigator-2** | Tests hypothesis 2 | Read + limited write | Owns: `debug-report-2.md`, any scratch/test files |
| **investigator-3** | Tests hypothesis 3 | Read + limited write | Owns: `debug-report-3.md`, any scratch/test files |
| **fixer** (optional) | Implements the fix once root cause is identified | Full access | Owns: source files for the fix |

## Task Dependency Graph

```
Task 1: Investigate hypothesis A       (investigator-1)
Task 2: Investigate hypothesis B       (investigator-2)      ← all parallel
Task 3: Investigate hypothesis C       (investigator-3)

Task 4: Synthesize findings            (lead, blocked by 1+2+3)
    ↓
Task 5: Implement fix                  (fixer, blocked by 4)
```

## Example Prompt

```
Create a team called "debug-[BUG-NAME]" to investigate [BUG DESCRIPTION].

The bug manifests as: [SYMPTOMS — error message, behavior, affected users].
It started: [WHEN — after deploy X, since date Y, intermittently].

Hypotheses to investigate:
1. [HYPOTHESIS A — e.g., "Race condition in the session middleware"]
2. [HYPOTHESIS B — e.g., "Database connection pool exhaustion under load"]
3. [HYPOTHESIS C — e.g., "Stale cache returning expired auth tokens"]

Team:
- "investigator-1": Investigate hypothesis 1. Look at [RELEVANT FILES/LOGS]. Write findings to debug-report-1.md. Include: evidence for/against, reproduction steps if found, confidence level (high/medium/low).
- "investigator-2": Investigate hypothesis 2. Look at [RELEVANT FILES/LOGS]. Write findings to debug-report-2.md. Same format.
- "investigator-3": Investigate hypothesis 3. Look at [RELEVANT FILES/LOGS]. Write findings to debug-report-3.md. Same format.

Investigators: message each other if you find evidence relevant to another hypothesis. Challenge each other's conclusions.

After all investigations complete, I'll synthesize findings and identify the root cause.
```

## File Ownership Plan

- Each investigator owns ONLY their report file and any scratch/test files they create
- Investigators MAY READ any source file but MUST NOT edit production code
- If investigators need to add debug logging, they create their own test scripts
- The fixer (spawned later) owns the source files for the actual fix

## What to Watch For

- **Anchoring**: Require confidence levels and evidence for/against in every report — don't let weak evidence become "the answer."
- **Premature convergence**: Wait for ALL investigators to complete before synthesizing. Don't pick the first plausible theory.
- **Scope expansion**: If an investigator finds a different bug, report it separately — don't chase it.

## Customization

- **Scale**: 2 investigators for simple bugs, 4–5 for complex system-level issues
- **Adversarial mode**: After initial reports, have investigators read each other's and write rebuttals
