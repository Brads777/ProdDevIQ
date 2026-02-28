---
name: rubric-scorer
description: >
  Score parsed student content against a rubric definition with per-criterion grades,
  justifications, and supporting quotes. Use this skill when you need to evaluate, score,
  or assess a student submission against a defined rubric. This is the algorithmic scoring
  engine used by case-grader and batch-grader-orchestrator. Triggers include requests to
  score a submission, evaluate against a rubric, generate criterion-level grades, produce
  a scorecard, calculate a grade, or compare student work to rubric standards. Also trigger
  when the user says "score this paper", "how does this submission measure up", "grade each
  criterion", "run the scorer", or provides both a parsed submission and a rubric and asks
  for evaluation.
---
# ©2026 Brad Scheller

# Rubric Scorer

Score parsed student submissions against a rubric definition. Produces per-criterion grades
with justifications and supporting quotes. This is the core scoring engine consumed by
`case-grader`, `batch-grader-orchestrator`, and any skill that needs algorithmic rubric-based
evaluation.

## Required Inputs

1. **Parsed Student Submission** — Structured output from `student-submission-parser`
   containing identified sections, exhibits, and extracted text
2. **Rubric Definition** — JSON rubric from `rubric-builder` (or the case-grader default)
3. **Teacher Notes Context** — Structured output from `teacher-notes-parser` with case
   issues, expected insights, and key discussion points
4. **Case Context** — Structured output from `case-study-parser` with case facts, exhibits,
   and background data

If any required input is missing, ask the user before proceeding.

## Scoring Workflow

### Step 1: Load and Validate Inputs

1. Parse the rubric JSON and extract all criteria, point values, and rating levels
2. Verify the parsed submission contains identifiable sections
3. Load teacher notes for expected-answer calibration
4. Load case context for factual accuracy checks
5. If the rubric references criteria not found in the submission structure, note them
   as candidates for "No Attempt"

### Step 2: Map Submission Sections to Rubric Criteria

For each rubric criterion, determine which submission section(s) to evaluate:

| Criterion Type | Section Mapping |
|---------------|-----------------|
| Format criteria (Memo Format, Header) | Submission metadata, document structure |
| Content criteria (Intro, Recommendations, etc.) | Named sections in submission body |
| Framework criteria (SWOT, PESTEL, etc.) | Exhibits identified by **content keywords** |
| Quality criteria (Writing Quality) | Entire submission text |

**CRITICAL**: Identify exhibits by content keywords, never by letter label. Use the
`detection_keywords` array from the rubric definition to match exhibit content. See the
Exhibit Identification procedure below.

### Step 3: Exhibit Identification by Content Keywords

This procedure is inherited from the `case-grader` skill and is mandatory for all
framework-type criteria:

1. Extract all text from the submission
2. Locate every heading or label containing "exhibit", "appendix", "attachment" (case-insensitive)
3. For each exhibit found, read the title AND the first 200 words of body content
4. Match against the `detection_keywords` from the rubric to determine which framework it represents
5. An exhibit may match multiple frameworks — score each matched framework independently
6. If a framework appears in body text without an explicit exhibit label, still grade it
7. If no match is found for a framework, score it as "No Attempt" (0 points)

**Common pitfalls to avoid:**
- Extra exhibits (e.g., "Industry Overview") that do not map to any criterion — ignore them
- Combined exhibits containing multiple frameworks — score each framework separately
- Missing labels — credit frameworks embedded in the Analysis section or appendix
- Non-standard labels ("Appendix 1", "Supporting Analysis") — scan for keyword content

### Step 4: Evaluate Each Criterion

For every criterion in the rubric, produce a score using this procedure:

#### 4a. Format Criteria

- **Memo Format** (binary or near-binary): Check that the submission follows memo structure
  (TO/FROM/DATE/RE header, body sections, professional formatting). Award full points if
  structure is present, partial if partially present, zero if absent.
- **Memo Header (FROM)**: Binary 2-point check. The memo header MUST include a FROM field.
  Award 2/2 if present, 0/2 if absent.

#### 4b. Content Criteria

For each content criterion (Introduction, Recommendations, Decision Criteria, Analysis,
Conclusion):

1. Locate the corresponding section in the parsed submission
2. Compare content against teacher notes for:
   - **Relevance**: Does the section address the case's key issues?
   - **Depth**: Does it go beyond surface-level observations?
   - **Analytical quality**: Does it demonstrate critical thinking?
   - **Completeness**: Are all expected sub-topics covered?
3. Check for criterion-specific issues:
   - **Introduction**: Flag if it contains background information (teacher notes context),
     recommendations, or personal opinions
   - **Recommendations**: Flag if it contains rationale/justification (belongs in Analysis)
     or suggests "further study"
   - **Analysis**: Check for logical flow between decision criteria and recommendations
   - **Conclusion**: Check that it synthesizes rather than repeats

#### 4c. Framework Criteria

For each framework criterion:

1. Identify the exhibit using content keyword matching (Step 3)
2. Evaluate **presence**: Is the framework included at all?
3. Evaluate **completeness**: Does it cover all expected components?
   - SWOT: All four quadrants populated with case-specific items
   - PESTEL: At least 4 of 6 factors addressed with case relevance
   - Five Forces: At least 3 of 5 forces discussed
   - VRIO: Resources evaluated across all four dimensions
   - Decision Matrix: Criteria weighted, alternatives scored, totals computed
   - Pros/Cons: At least 3 items per side with case-specific detail
4. Evaluate **quality**: Are items case-specific (not generic)?
5. Evaluate **integration**: Are framework findings referenced in the Analysis section?

#### 4d. Quality Criteria

- **Writing Quality**: Evaluate grammar, clarity, professional tone, sentence structure,
  and absence of personal opinions across the entire submission

#### 4e. Special Criterion: CLV Analysis

Grade CLV as **"Not Applicable"** with full points (2/2) UNLESS the case specifically
involves customer segment selection or customer valuation decisions. Check the case context
and teacher notes for customer valuation themes before deciding.

### Step 5: Assign Grade Levels

For each criterion, map the evaluation to a grade level:

| Grade Level | Percentage | Points Awarded | When to Assign |
|-------------|------------|----------------|----------------|
| Exceeds Expectations | 100% | criterion.points * 1.0 | Exceptional depth, insight, and completeness. Goes beyond what was asked. |
| Meets Expectations | 80% | criterion.points * 0.8 | Satisfactory work that addresses the criterion adequately. |
| Attempt Made | 60% | criterion.points * 0.6 | Partial completion — present but lacks depth or accuracy. |
| Below Expectations | 40% | criterion.points * 0.4 | Significant gaps, superficial treatment, major errors. |
| No Attempt | 0% | 0 | Missing entirely from the submission. |

For criteria with custom rating levels (from rubric-builder), use the rubric's percentage
values instead of the defaults above.

Round fractional points to one decimal place (e.g., 8 * 0.6 = 4.8).

### Step 6: Apply Global Rules

After scoring all criteria:

1. **Cover Page Penalty**: If a cover page is detected, deduct 20% from the total score
   (or the percentage specified in `global_rules.cover_page_penalty`).
2. **Personal Opinion Check**: Scan Introduction, Analysis, and Conclusion for "I believe",
   "I think", "in my opinion". If found, record the exact sentence for feedback but do NOT
   automatically deduct points — the content criterion score should already reflect the issue.
3. **Not-Applicable Criteria**: Set listed criteria to full points with "Not Applicable" grade.
4. **Late Submission Penalty**: If configured and applicable, deduct after all other scoring.

### Step 7: Compute Totals

1. Sum all criterion point values to produce `raw_total`
2. Apply any global deductions (cover page, late penalty) to produce `adjusted_total`
3. Compute `percentage` = adjusted_total / rubric.total_points * 100
4. Round percentage to one decimal place

## Output Format

### Scores JSON

```json
{
  "student_name": "Jane Smith",
  "submission_file": "smith-jane-case-analysis.docx",
  "rubric_name": "MGMT 6100 Case Analysis Rubric",
  "rubric_version": "1.0",
  "scored_at": "2026-02-18T14:30:00Z",
  "criteria_scores": [
    {
      "criterion_id": "memo-format",
      "criterion_name": "Memo Format",
      "category": "Format",
      "max_points": 2,
      "points_awarded": 2.0,
      "grade_level": "Exceeds Expectations",
      "justification": "The submission follows proper memo format with TO, FROM, DATE, and RE fields, followed by well-organized body sections.",
      "supporting_quotes": [
        "TO: Senior Management Team"
      ]
    },
    {
      "criterion_id": "intro-key-issues",
      "criterion_name": "Introduction / Key Issues",
      "category": "Content",
      "max_points": 8,
      "points_awarded": 6.4,
      "grade_level": "Meets Expectations",
      "justification": "The introduction identifies the primary strategic dilemma and two of the three key issues from the teacher notes. However, the third issue regarding market expansion timing is not mentioned.",
      "supporting_quotes": [
        "The central challenge facing Acme Corp is whether to pursue vertical integration or maintain its current outsourcing model.",
        "Key considerations include cost structure implications and supply chain reliability."
      ]
    },
    {
      "criterion_id": "clv-analysis",
      "criterion_name": "CLV Analysis",
      "category": "Frameworks",
      "max_points": 2,
      "points_awarded": 2.0,
      "grade_level": "Not Applicable",
      "justification": "This case does not involve customer segment selection or customer valuation decisions. Full points awarded per CLV grading rules.",
      "supporting_quotes": []
    }
  ],
  "global_deductions": [
    {
      "rule": "cover_page_penalty",
      "applied": false,
      "deduction_points": 0,
      "note": "No cover page detected"
    }
  ],
  "detected_issues": [
    {
      "issue_type": "personal_opinion",
      "location": "Introduction, paragraph 2",
      "exact_quote": "I believe the company should focus on innovation.",
      "mandatory_feedback": "Do not refer to yourself or your opinion. Management wants recommendations based on facts and logic, not your belief."
    }
  ],
  "raw_total": 82.4,
  "adjusted_total": 82.4,
  "percentage": 82.4,
  "total_possible": 100
}
```

### Score Summary Table (Human-Readable)

Also produce a formatted summary for display:

```
SCORING SUMMARY: Jane Smith
Rubric: MGMT 6100 Case Analysis Rubric

| Criterion                    | Grade                  | Points   |
|------------------------------|------------------------|----------|
| Memo Format                  | Exceeds Expectations   | 2.0/2    |
| Memo Header (FROM)           | Exceeds Expectations   | 2.0/2    |
| Introduction / Key Issues    | Meets Expectations     | 6.4/8    |
| Recommendations              | Attempt Made           | 4.8/8    |
| ...                          | ...                    | ...      |
| TOTAL                        |                        | 82.4/100 |

Deductions: None
Final Score: 82.4/100 (82.4%)
```

## Critical Scoring Rules

These rules are inherited from the `case-grader` skill and MUST be followed:

1. **Personal Opinions**: Only flag if Introduction, Analysis, or Conclusion contains
   "I believe," "I think," or "in my opinion." Quote the exact sentence. Do NOT flag
   opinions in the Recommendations section (recommendations inherently contain judgment).

2. **FROM Line**: Worth 2 points. Binary check — present or absent. No partial credit.

3. **CLV Analysis**: Grade as "Not Applicable" with full points (2/2) unless the case
   specifically involves customer segment selection or customer valuation decisions.
   Check case context and teacher notes before deciding.

4. **Cover Page**: Deduct 20% from total score if present. A cover page signals the
   student does not understand that analysis memos are internal documents.

5. **Exhibit Identification**: ALWAYS by content keywords, NEVER by letter label.
   A student's "Exhibit C" might be SWOT while another student's "Exhibit C" is PESTEL.

## Edge Cases

- **Missing sections**: If a content section (e.g., Conclusion) is absent, score as
  "No Attempt" (0 points). Do not infer content from other sections.
- **Combined sections**: If a student merges Introduction and Key Issues into one section,
  evaluate the combined content against the criterion.
- **Extra sections**: Sections not mapped to any criterion (e.g., "Executive Summary" in
  addition to Introduction) — ignore for scoring purposes.
- **Extremely short submissions**: If the entire submission is under 200 words, flag as
  potentially incomplete. Score each criterion independently; most will be "No Attempt."
- **Non-English submissions**: Flag for manual review. Do not attempt to score.
- **Criterion with 0 max points**: Skip during scoring (informational criterion only).
- **Custom rating levels**: If the rubric has non-standard levels (e.g., 5 levels with
  different percentages), use the rubric's percentage values, not the defaults.
- **Rounding conflicts**: If criterion scores do not sum to the raw total due to rounding,
  use the sum of rounded criterion scores as the authoritative total.

## Integration with Other CasesIQ Skills

| Skill | Relationship |
|-------|-------------|
| `rubric-builder` | **Upstream provider** — produces the rubric JSON this skill consumes |
| `student-submission-parser` | **Upstream provider** — produces the parsed submission structure |
| `teacher-notes-parser` | **Upstream provider** — produces case insights for scoring calibration |
| `case-study-parser` | **Upstream provider** — produces case facts for accuracy checks |
| `case-grader` | **Orchestrator** — calls this skill as the scoring step in end-to-end grading |
| `feedback-docx-writer` | **Downstream consumer** — reads this skill's output to generate feedback documents |
| `batch-grader-orchestrator` | **Orchestrator** — calls this skill once per student in a batch |
