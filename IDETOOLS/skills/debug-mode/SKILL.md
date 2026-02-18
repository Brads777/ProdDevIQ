---
name: debug-mode
description: This skill should be used when debugging errors, bugs, or unexpected behavior in code. Instead of guessing at fixes, it follows an evidence-based approach - generating hypotheses, instrumenting code with logging, collecting runtime data during reproduction, analyzing actual behavior, and making targeted fixes based on evidence. Use this skill when the user reports a bug, error, or unexpected behavior they want to diagnose systematically.
---
# ©2026 Brad Scheller

# Debug Mode

A systematic, evidence-based debugging workflow that diagnoses bugs through data collection rather than guesswork.

## When to Use

Activate Debug Mode when:
- User reports an error, bug, or unexpected behavior
- A fix attempt has already failed and the root cause is unclear
- The bug is intermittent or hard to reproduce
- User explicitly requests debugging help

## Core Philosophy

**Never guess. Always measure.**

Traditional debugging often involves:
1. See error → 2. Guess cause → 3. Try fix → 4. Repeat

Debug Mode instead follows:
1. See error → 2. Generate hypotheses → 3. Instrument code → 4. Collect data → 5. Analyze evidence → 6. Fix with confidence

## Debug Mode Workflow

### Phase 1: Understand the Bug

Gather essential information before forming hypotheses:

1. **Error description**: What error message or unexpected behavior occurs?
2. **Expected vs actual**: What should happen vs what does happen?
3. **Reproduction steps**: How can the bug be triggered?
4. **Recent changes**: What changed before the bug appeared?
5. **Environment**: OS, runtime version, dependencies

Ask the user for any missing information. Do not proceed until the bug can be described clearly.

### Phase 2: Generate Hypotheses

Based on the error and context, generate 3-5 ranked hypotheses about potential root causes:

```
## Hypotheses (ranked by likelihood)

1. **[Most likely]** Description of hypothesis
   - Evidence for: ...
   - Evidence against: ...
   - How to verify: ...

2. **[Likely]** Description of hypothesis
   - Evidence for: ...
   - Evidence against: ...
   - How to verify: ...

3. **[Possible]** Description of hypothesis
   ...
```

Each hypothesis must include what evidence would confirm or refute it.

### Phase 3: Instrument the Code

Add strategic logging to collect evidence. Use the instrumentation script for automatic injection or add logging manually.

#### Automatic Instrumentation

Run the bundled instrumentation script to inject logging:

```bash
python3 <skill-path>/scripts/instrument.py <target-file> [--functions func1,func2] [--lines 10,20,30]
```

The script creates a `.debug_backup` of the original file and injects:
- Function entry/exit logging with arguments and return values
- Variable state logging at specified lines
- Exception context logging in try/catch blocks

#### Manual Instrumentation

For targeted logging, refer to `references/logging_patterns.md` for language-specific patterns. Key logging points:

1. **Function boundaries**: Log entry with arguments, exit with return value
2. **Decision points**: Log condition values at if/switch statements
3. **Loop iterations**: Log iteration count and key variables
4. **External calls**: Log inputs/outputs of API calls, DB queries, file operations
5. **State changes**: Log before/after values when mutating state

#### Logging Format

Use structured logging with this format for easy parsing:

```
[DEBUG:<session-id>] <timestamp> | <location> | <event-type> | <data>
```

Example:
```
[DEBUG:abc123] 2024-01-15T10:30:45 | processOrder:42 | ENTRY | args={"orderId": 123}
[DEBUG:abc123] 2024-01-15T10:30:45 | processOrder:45 | STATE | inventory={"sku1": 5}
[DEBUG:abc123] 2024-01-15T10:30:46 | processOrder:67 | EXIT | return={"success": true}
```

### Phase 4: Reproduce and Collect Data

Ask the user to reproduce the bug with instrumented code:

```
## Reproduction Instructions

1. The code has been instrumented with debug logging
2. Run the following to reproduce the bug:
   [specific command or steps]
3. Share the output/logs that appear

Please paste the complete output including any debug logs.
```

Wait for the user to provide the collected logs before proceeding.

### Phase 5: Analyze the Evidence

Parse and analyze the collected logs to identify the root cause:

```bash
python3 <skill-path>/scripts/analyze_logs.py <log-file-or-paste>
```

Or analyze manually by:

1. **Trace the execution path**: Follow the sequence of logged events
2. **Identify divergence**: Find where actual behavior differs from expected
3. **Check hypothesis evidence**: Which hypotheses are supported/refuted by the data?
4. **Locate the root cause**: Pinpoint the exact line/condition causing the bug

Present findings clearly:

```
## Analysis Results

### Execution Trace
[Summary of what the logs show happened]

### Key Finding
[The specific point where behavior diverged from expected]

### Root Cause
[Precise identification of the bug cause with evidence]

### Hypothesis Validation
- Hypothesis 1: [Confirmed/Refuted] - [Evidence]
- Hypothesis 2: [Confirmed/Refuted] - [Evidence]
```

### Phase 6: Fix with Confidence

Only after identifying the root cause with evidence, propose a targeted fix:

1. **Explain the fix**: Why this change addresses the root cause
2. **Show the change**: Minimal diff that fixes the issue
3. **Verify approach**: How to confirm the fix works

After applying the fix, ask the user to verify:

```
## Verification Steps

1. The fix has been applied to [file:line]
2. Run the same reproduction steps
3. Confirm the expected behavior now occurs
4. [Optional] Run the test suite to check for regressions
```

### Phase 7: Cleanup

After the bug is fixed and verified:

1. Remove debug logging statements (or use `instrument.py --restore`)
2. Consider adding a regression test for the bug
3. Document the root cause if it could affect other code

## Quick Reference

| Phase | Action | Output |
|-------|--------|--------|
| 1. Understand | Gather bug details | Clear problem statement |
| 2. Hypothesize | Generate ranked theories | 3-5 testable hypotheses |
| 3. Instrument | Add strategic logging | Instrumented code |
| 4. Reproduce | User triggers bug | Collected log data |
| 5. Analyze | Parse and interpret logs | Root cause identification |
| 6. Fix | Apply targeted change | Verified fix |
| 7. Cleanup | Remove instrumentation | Clean codebase |

## Bundled Resources

- `scripts/instrument.py` - Automatic code instrumentation for logging injection
- `scripts/analyze_logs.py` - Log parsing and analysis utilities
- `references/logging_patterns.md` - Language-specific logging patterns and examples
