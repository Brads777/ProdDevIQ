# Output Patterns

Use these patterns when skills need to produce consistent, high-quality output.

## Contents

1. [Template Pattern](#template-pattern)
2. [Examples Pattern](#examples-pattern)
3. [Progressive Disclosure in Output](#progressive-disclosure-in-output)
4. [Quality Checklist Pattern](#quality-checklist-pattern)

---

## Template Pattern

Provide templates for output format. Match strictness to need.

**Strict template** (API responses, data formats, compliance docs):

```markdown
## Report Structure

ALWAYS use this exact template:

# [Analysis Title]

## Executive Summary
[One-paragraph overview of key findings]

## Key Findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```

**Flexible template** (creative output, varied contexts):

```markdown
## Report Structure

Sensible default format - adapt as needed:

# [Analysis Title]

## Executive Summary
[Overview]

## Key Findings
[Adapt sections based on what you discover]

## Recommendations
[Tailor to the specific context]
```

## Examples Pattern

For skills where output quality depends on seeing examples, provide input/output pairs. Examples help Claude understand desired style and detail level more clearly than descriptions alone.

```markdown
## Commit Message Format

Generate commit messages following these examples:

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware

**Example 2:**
Input: Fixed bug where dates displayed incorrectly in reports
Output:
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation

Follow this style: type(scope): brief description, then detailed explanation.
```

**When to use examples vs. templates:**
- Templates: When structure must be consistent across all outputs
- Examples: When style/tone matters but structure can vary
- Both: When you need consistent structure AND specific style

## Progressive Disclosure in Output

For skills that produce different output types, organize instructions so Claude only processes relevant sections.

**Per-variant output specs:**

```markdown
## Output Formats

### JSON API Response
- Always include `status`, `data`, and `timestamp` fields
- Wrap errors in `error` object with `code` and `message`

### Markdown Report
- Use H2 for major sections, H3 for subsections
- Include table of contents for reports over 3 sections

### CSV Export
- UTF-8 encoding, comma-delimited
- Header row required
- Quote fields containing commas
```

Claude reads only the relevant format section based on the user's request.

## Quality Checklist Pattern

For skills where output must meet specific standards before delivery.

```markdown
## Before Finalizing

Verify all items before presenting output:

### Content Quality
- [ ] All requested sections present
- [ ] Data values validated against source
- [ ] No placeholder text remaining

### Formatting
- [ ] Consistent heading hierarchy
- [ ] Code blocks have language tags
- [ ] Links are functional

### Completeness
- [ ] Addresses all user requirements
- [ ] Edge cases handled
- [ ] Error states documented
```

**Advanced:** For critical validations, bundle a script (`scripts/validate_output.py`) rather than relying on language instructions. Code is deterministic; language interpretation isn't.
