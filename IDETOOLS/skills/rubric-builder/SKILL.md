---
name: rubric-builder
description: >
  Build and customize grading rubrics with weighted criteria and configurable rating levels.
  Use this skill when a professor needs to create, clone, modify, import, or export a grading
  rubric for any assignment type. Triggers include requests to create a rubric, build a rubric,
  customize grading criteria, set up a scoring framework, define point distributions, configure
  rating levels, clone or adapt an existing rubric, import rubric from CSV/JSON, or export a
  rubric for use by other grading skills. Also trigger when the user says "set up grading
  criteria", "define the rubric", "modify the rubric weights", "add a criterion", or "how should
  this assignment be graded".
---
# ©2026 Brad Scheller

# Rubric Builder

Create, customize, validate, and export grading rubrics with weighted criteria and configurable
rating levels. Rubrics produced by this skill are consumed by `rubric-scorer`, `case-grader`,
and `batch-grader-orchestrator`.

## Required Inputs

1. **Rubric Type** — One of: `case-analysis`, `executive-summary`, `discussion-post`,
   `presentation`, `quiz`, or `custom`
2. **Assignment Context** — Brief description of what students are submitting
3. **Total Points** — Target point total (default: 100)
4. **Base Rubric** *(optional)* — Existing rubric to clone/modify (JSON file or skill default)
5. **CSV/JSON Import** *(optional)* — External rubric definition to import

If the rubric type is not specified, ask the user before proceeding. If no base rubric is
provided, offer the standard default for the chosen type.

## Rubric Structure

Every rubric produced by this skill follows this schema:

```json
{
  "rubric_name": "string",
  "rubric_type": "case-analysis | executive-summary | discussion-post | presentation | quiz | custom",
  "version": "1.0",
  "total_points": 100,
  "created_by": "string",
  "created_at": "ISO-8601 timestamp",
  "rating_levels": [
    { "name": "Exceeds Expectations", "percentage": 100 },
    { "name": "Meets Expectations", "percentage": 80 },
    { "name": "Attempt Made", "percentage": 60 },
    { "name": "Below Expectations", "percentage": 40 },
    { "name": "No Attempt", "percentage": 0 }
  ],
  "categories": [
    {
      "name": "Category Name",
      "criteria": [
        {
          "id": "unique-slug",
          "name": "Criterion Name",
          "points": 8,
          "description": "What this criterion evaluates",
          "rating_descriptions": {
            "Exceeds Expectations": "Criterion-specific description of exceptional work",
            "Meets Expectations": "Criterion-specific description of satisfactory work",
            "Attempt Made": "Criterion-specific description of partial work",
            "Below Expectations": "Criterion-specific description of insufficient work",
            "No Attempt": "Missing entirely"
          },
          "detection_keywords": ["keyword1", "keyword2"],
          "special_rules": "optional — any criterion-specific scoring rules"
        }
      ]
    }
  ],
  "global_rules": {
    "cover_page_penalty": { "enabled": true, "deduction_percent": 20 },
    "personal_opinion_check": { "enabled": true, "sections": ["introduction", "analysis", "conclusion"] },
    "not_applicable_criteria": ["clv-analysis"]
  }
}
```

## Default Rubrics

### Case Analysis (Standard — 18 Criteria, 100 Points)

This is the default rubric used by the `case-grader` skill:

| Category | Criterion | ID | Points |
|----------|-----------|-----|--------|
| Format | Memo Format | `memo-format` | 2 |
| Format | Memo Header (FROM) | `memo-header-from` | 2 |
| Content | Introduction / Key Issues | `intro-key-issues` | 8 |
| Content | Recommendations | `recommendations` | 8 |
| Content | Decision Criteria | `decision-criteria` | 8 |
| Content | Analysis | `analysis` | 8 |
| Content | Conclusion | `conclusion` | 8 |
| Frameworks | Guide Questions | `guide-questions` | 4 |
| Frameworks | List of Issues and Questions | `issues-questions-list` | 8 |
| Frameworks | List of Decision Criteria | `decision-criteria-list` | 8 |
| Frameworks | Decision Matrix | `decision-matrix` | 8 |
| Frameworks | Pros and Cons List | `pros-cons-list` | 8 |
| Frameworks | SWOT Analysis | `swot-analysis` | 8 |
| Frameworks | PESTEL Analysis | `pestel-analysis` | 4 |
| Frameworks | Five Forces Analysis | `five-forces` | 2 |
| Frameworks | VRIO Analysis | `vrio-analysis` | 2 |
| Frameworks | CLV Analysis | `clv-analysis` | 2 |
| Quality | Writing Quality | `writing-quality` | 2 |

Each framework criterion includes `detection_keywords` matching the keyword table defined in
the `case-grader` skill (e.g., SWOT uses `["swot", "strengths, weaknesses",
"strengths and weaknesses"]`).

### Other Default Rubric Types

When the user selects a non-case-analysis type, generate a sensible default:

- **Executive Summary**: 5-8 criteria covering brevity, key findings, recommendations, clarity,
  formatting (50-100 points)
- **Discussion Post**: 3-5 criteria covering argument quality, evidence, engagement with peers,
  writing quality (20-50 points)
- **Presentation**: 6-10 criteria covering content, organization, visual design, delivery,
  Q&A handling, time management (100 points)
- **Quiz**: Auto-scored criteria — typically 1 criterion per question with binary correct/incorrect

Present the default, then allow the user to modify before finalizing.

## Workflow

### Step 1: Determine Starting Point

Ask the user which approach:
- **A) Start from default** — Load the standard rubric for the chosen type
- **B) Clone and modify** — Load an existing rubric, then edit
- **C) Build from scratch** — Empty rubric, add criteria one at a time
- **D) Import** — Load from CSV or JSON file

### Step 2: Define or Edit Categories and Criteria

For each criterion, collect:
1. **Name** — Human-readable criterion name
2. **Category** — Group it belongs to (Format, Content, Frameworks, Quality, etc.)
3. **Points** — Maximum points for this criterion
4. **Description** — What the criterion evaluates
5. **Rating-level descriptions** — Per-level descriptions (can auto-generate if user skips)
6. **Detection keywords** *(frameworks only)* — Keywords for automated exhibit identification
7. **Special rules** *(optional)* — Binary scoring, N/A default, etc.

### Step 3: Weight Validation

After all criteria are defined:
1. Sum all criterion points
2. Compare to the target `total_points`
3. If mismatch, present two options:
   - **Adjust target** — Change `total_points` to match the sum
   - **Rebalance weights** — Proportionally scale all criteria to hit the target
4. Confirm no criterion has 0 points (unless intentionally disabled)
5. Confirm no category is empty

### Step 4: Rating Level Configuration

Default rating levels are:
| Level | Percentage |
|-------|------------|
| Exceeds Expectations | 100% |
| Meets Expectations | 80% |
| Attempt Made | 60% |
| Below Expectations | 40% |
| No Attempt | 0% |

Allow the user to:
- Rename levels (e.g., "Outstanding" instead of "Exceeds Expectations")
- Change percentages (e.g., Meets = 85% instead of 80%)
- Add or remove levels (minimum 3, maximum 7)
- Customize per-criterion descriptions for each level

### Step 5: Global Rules

Configure assignment-wide rules:
- **Cover page penalty**: Enable/disable, set deduction percentage (default: 20%)
- **Personal opinion check**: Enable/disable, specify which sections to scan
- **Not-applicable criteria**: List criteria that default to full marks (e.g., CLV for most cases)
- **Late submission penalty**: Enable/disable, set deduction per day/hour
- **Minimum word count**: Enable/disable, set threshold

### Step 6: Validate and Export

Run the completeness checklist:
- [ ] Every criterion has a name and description
- [ ] Every criterion has a point value > 0 (or is explicitly disabled)
- [ ] All criteria points sum to `total_points`
- [ ] Every criterion has rating-level descriptions (auto-generated acceptable)
- [ ] Framework criteria have `detection_keywords` populated
- [ ] At least one category exists
- [ ] No duplicate criterion IDs
- [ ] Global rules are configured

Export the rubric as JSON to the specified path.

## Import Formats

### CSV Import

Expected columns: `category, criterion_name, points, description`

```csv
Format,Memo Format,2,Check that submission follows memo format
Format,Memo Header (FROM),2,Check FROM field in memo header
Content,Introduction / Key Issues,8,Evaluate introduction and key issue identification
```

Optional additional columns: `detection_keywords, special_rules`

### JSON Import

Accept any JSON that includes at minimum an array of criteria with `name` and `points`.
Map to the full schema, filling defaults for missing fields.

## Output Format

### Primary Output: Rubric JSON

Save to the specified path (default: same directory as assignment files).

```json
{
  "rubric_name": "MGMT 6100 Case Analysis Rubric",
  "rubric_type": "case-analysis",
  "version": "1.0",
  "total_points": 100,
  "created_by": "Professor Name",
  "created_at": "2026-02-18T10:00:00Z",
  "rating_levels": [ ... ],
  "categories": [ ... ],
  "global_rules": { ... }
}
```

### Secondary Output: Human-Readable Summary

Print a formatted summary table showing all criteria, categories, and point values so the
professor can visually confirm the rubric before it is used for grading.

## Edge Cases

- **Zero-point criteria**: Warn the user. Allow if intentional (e.g., informational criteria
  that appear in feedback but do not affect score).
- **Very large rubrics (30+ criteria)**: Warn that grading time will increase. Suggest grouping
  or trimming.
- **Non-integer points**: Allow decimal points (e.g., 2.5) but warn that rounding may occur
  in final scores.
- **Duplicate criterion names**: Reject — each name must be unique within the rubric.
- **Missing detection keywords on framework criteria**: Warn that automated exhibit
  identification will not work for those criteria.
- **Import with extra columns**: Ignore unknown columns, warn the user.
- **Import with missing required fields**: Reject the row, report which rows failed.

## Integration with Other CasesIQ Skills

| Skill | Relationship |
|-------|-------------|
| `rubric-scorer` | **Downstream consumer** — reads the rubric JSON to score submissions |
| `case-grader` | **Downstream consumer** — uses rubric for end-to-end grading |
| `batch-grader-orchestrator` | **Downstream consumer** — passes rubric to scorer for each submission |
| `feedback-docx-writer` | **Indirect consumer** — uses rubric criteria names and points for the summary table |
| `student-submission-parser` | **No direct dependency** — but rubric detection keywords guide exhibit identification |
| `teacher-notes-parser` | **No direct dependency** — but rubric criteria inform which case insights matter |
