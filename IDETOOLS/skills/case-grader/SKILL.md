---
name: case-grader
description: >
  Grade student case analysis submissions using a standardized rubric with structured feedback.
  Use this skill when a professor needs to evaluate, score, or provide feedback on student case
  study submissions. Requires the grading rubric, case PDF, teacher notes, and optionally a best
  practice example. Triggers include requests to grade, evaluate, assess, score, or provide
  feedback on case analysis submissions. Also trigger when the user says "grade this paper",
  "evaluate this submission", "score this case study", or uploads a student document and asks
  for assessment against the course rubric.
---

# Case Grader

Evaluate student case analysis submissions against standardized criteria and produce structured
feedback as a Word document.

## Required Inputs

1. **Grading Rubric** — CASE_ANALYSIS_GRADING_FRAMEWORK.docx or equivalent
2. **Case PDF** — the original case study
3. **Teacher Notes PDF** — instructor guidance and key insights
4. **Student Submission** — the work to grade (PDF or DOCX)
5. **Best Practice Example** — optional, for comparison and calibration

If any required input is missing, ask the user before proceeding.

## Grading Workflow

1. **Load rubric** — read grading framework for criteria and point values.
2. **Review case context** — understand case issues from teacher notes.
3. **Scan submission structure** — identify all sections and exhibits (see Exhibit Identification below).
4. **Evaluate each criterion** — score against rubric using the point distribution table.
5. **Generate feedback** — produce structured output per `references/feedback-template.md`.
6. **Deliver as DOCX** — save to `/mnt/user-data/outputs/` and present to user.

---

## Point Distribution (100 points)

| Category | Criterion | Points |
|----------|-----------|--------|
| Format | Memo Format | 2 |
| Format | Memo Header (must include FROM) | 2 |
| Content | Introduction / Key Issues | 8 |
| Content | Recommendations | 8 |
| Content | Decision Criteria | 8 |
| Content | Analysis | 8 |
| Content | Conclusion | 8 |
| Frameworks | Guide Questions | 4 |
| Frameworks | List of Issues and Questions | 8 |
| Frameworks | List of Decision Criteria | 8 |
| Frameworks | Decision Matrix | 8 |
| Frameworks | Pros and Cons List | 8 |
| Frameworks | SWOT Analysis | 8 |
| Frameworks | PESTEL Analysis | 4 |
| Frameworks | Five Forces Analysis | 2 |
| Frameworks | VRIO Analysis | 2 |
| Frameworks | CLV Analysis | 2 |
| Quality | Writing Quality | 2 |

## Grade Levels

| Grade | Percentage | Description |
|-------|------------|-------------|
| Exceeds Expectations | 100% | Exceptional work |
| Meets Expectations | 80% | Satisfactory |
| Attempt Made | 60% | Partial completion |
| Below Expectations | 40% | Significant gaps |
| No Attempt | 0% | Missing entirely |

---

## Exhibit Identification (CRITICAL — Bug Fix)

Students label their exhibits with letters (Exhibit A, Exhibit B, etc.), but the specific letter
assigned to each exhibit can vary between submissions. Some students insert additional exhibits,
reorder them, or use different labeling schemes. **Never rely on letter designation to identify
an exhibit's type.**

Instead, identify each exhibit by scanning for **content keywords** in the exhibit title and body.
Use the following lookup table:

| Framework to Grade | Match Keywords (title OR body) | Points |
|--------------------|-------------------------------|--------|
| Guide Questions | "guide questions", "guiding questions", "case questions" | 4 |
| List of Issues and Questions | "key issues", "issues and questions", "central problem" | 8 |
| List of Decision Criteria | "decision criteria", "criteria and weights", "weighted criteria" | 8 |
| Decision Matrix | "decision matrix", "scoring matrix", "weighted score", "alternative scoring" | 8 |
| Pros and Cons List | "pros and cons", "advantages and disadvantages", "pros/cons" | 8 |
| SWOT Analysis | "swot", "strengths, weaknesses", "strengths and weaknesses" | 8 |
| PESTEL Analysis | "pestel", "pestle", "pest analysis", "political, economic" | 4 |
| Five Forces Analysis | "five forces", "porter", "competitive rivalry", "threat of new entrants" | 2 |
| VRIO Analysis | "vrio", "value, rarity", "valuable, rare" | 2 |
| CLV Analysis | "clv", "customer lifetime value", "lifetime value" | 2 |

### Identification Procedure

1. Extract all text from the submission.
2. Locate every heading or label that contains "exhibit" (case-insensitive).
3. For each exhibit found, read the title AND the first 200 words of body content.
4. Match against the keyword table above to determine which framework it represents.
5. An exhibit may match multiple frameworks (e.g., "Additional Analysis" containing both
   Five Forces and VRIO). Score each matched framework independently.
6. If a framework appears in the body text without an explicit exhibit label, still grade it —
   students sometimes embed frameworks in the Analysis section or an appendix.
7. If no match is found for a given framework, score it as "No Attempt" (0 points).

### Common Edge Cases

- **Extra exhibits**: A student might include an "Exhibit C: Industry Overview" that doesn't
  map to any rubric criterion. Ignore it for scoring purposes — do not let it shift the
  identification of subsequent exhibits.
- **Combined exhibits**: A single exhibit titled "Additional Analysis" may contain PESTEL,
  Five Forces, and VRIO together. Score each framework separately based on its content quality.
- **Missing exhibit labels**: If a student includes a SWOT table in the Analysis section
  without labeling it as an exhibit, still credit it.
- **Non-standard labeling**: "Appendix 1", "Attachment A", "Supporting Analysis" should all
  be scanned for framework content just like exhibits.

---

## Critical Evaluation Rules

**Personal Opinions:** Only flag if Introduction, Analysis, or Conclusion contains "I believe,"
"I think," or "in my opinion." Quote the exact sentence in feedback.

**FROM Line:** Worth 2 points. Check that the memo header includes a FROM field.

**CLV Analysis:** Grade as "Not Applicable" with 2/2 points unless the case specifically
involves customer segment selection or customer valuation decisions.

**Cover Page:** Deduct 20% from total score if present. A cover page signals the student
doesn't understand that analysis memos are internal documents.

---

## Mandatory Feedback Triggers

When these issues are detected, include the corresponding feedback verbatim:

| Issue | Required Feedback |
|-------|-------------------|
| Personal opinions | "Do not refer to yourself or your opinion. Management wants recommendations based on facts and logic, not your belief." |
| Background in intro | "You are writing to management; they already know the background information." |
| Cover page used | "Analysis memos typically stay inside an organization and do not require a cover page." |
| Recommendations in intro | "Do not include your recommendations in the Introduction section." |
| Rationale in recommendations | "Recommendations need to be clear, concise, and actionable. Your supporting arguments go in the Analysis section." |
| Further study recommended | "Management wants actionable recommendations now! The Exhibits provide enough logical arguments." |
| Missing frameworks | "Include analytical frameworks, especially [LIST MISSING]." |
| Weak exhibits | "Exhibits are critical to your analysis and should be fleshed out." |

---

## Vocabulary Restrictions

- Never describe work as "excellent" if grade is below 90.
- Never describe work as "very good" or "promising" if grade is below 75.
- Match tone to the actual score — be encouraging but honest.

---

## Output Format

Read `references/feedback-template.md` for the exact output structure before generating feedback.
