---
name: feedback-docx-writer
description: >
  Generate formatted Word documents containing structured grading feedback for students.
  Use this skill when scorer output is ready and needs to be transformed into a professional
  feedback deliverable. Takes rubric-scorer JSON output and produces a .docx file following
  the CasesIQ feedback template. Triggers include requests to generate feedback, create a
  feedback document, write the grading report, produce the Word file, format the feedback,
  or deliver results to the student. Also trigger when the user says "write the feedback doc",
  "generate the Word file", "create the student report", "format the grades as a document",
  or when rubric-scorer output is available and the next step is document generation.
---
# ©2026 Brad Scheller

# Feedback DOCX Writer

Transform rubric-scorer output into a professionally formatted Word document containing
structured grading feedback for students. This skill produces the final deliverable that
professors share with students.

## Required Inputs

1. **Scorer Output** — JSON output from `rubric-scorer` containing per-criterion scores,
   justifications, supporting quotes, detected issues, and totals
2. **Rubric Definition** — JSON rubric from `rubric-builder` (for criterion names, categories,
   and max points)
3. **Output Path** — Directory where the .docx file should be saved
4. **Student Name** — For the filename and document header
5. **Course Identifier** *(optional)* — Course code for the document header (e.g., "MGMT 6100")

If the scorer output or rubric definition is missing, ask the user before proceeding.

## Document Structure

The feedback document follows this exact structure. All section titles are formatted as
**Heading 3** (bold, larger font).

### Section 1: Summary Scoring List

Present as a formatted table with three columns:

| **Criteria** | **Grade** | **Points** |
|--------------|-----------|------------|
| Memo Format | [Grade Level] | [X]/2 |
| Memo Header | [Grade Level] | [X]/2 |
| Introduction/Key Issues | [Grade Level] | [X]/8 |
| Recommendations | [Grade Level] | [X]/8 |
| Decision Criteria | [Grade Level] | [X]/8 |
| Analysis | [Grade Level] | [X]/8 |
| Conclusion | [Grade Level] | [X]/8 |
| Guide Questions | [Grade Level] | [X]/4 |
| List of Issues and Questions | [Grade Level] | [X]/8 |
| List of Decision Criteria | [Grade Level] | [X]/8 |
| Decision Matrix | [Grade Level] | [X]/8 |
| Pros and Cons List | [Grade Level] | [X]/8 |
| SWOT Analysis | [Grade Level] | [X]/8 |
| PESTEL Analysis | [Grade Level] | [X]/4 |
| Five Forces Analysis | [Grade Level] | [X]/2 |
| VRIO Analysis | [Grade Level] | [X]/2 |
| CLV Analysis | Not Applicable | 2/2 |
| Writing Quality | [Grade Level] | [X]/2 |
| **Total** | | **[X]/100** |

**Important**: The table rows follow rubric order, not the order criteria appear in the
submission. If the rubric has fewer or more criteria than the standard 18, adjust the table
accordingly.

If global deductions were applied (cover page penalty, late penalty), add a row below the
total:

| **Deduction: Cover Page** | -20% | **-[X] pts** |
| **Adjusted Total** | | **[X]/100** |

### Section 2: Overall Assessment

Write 2-4 sentences of general evaluation. Tone MUST match the score level:

| Score Range | Permitted Vocabulary |
|-------------|---------------------|
| 90-100 | "excellent", "outstanding", "exceptional", "impressive" |
| 75-89 | "solid", "competent", "good", "well-structured", "effective" |
| 60-74 | "adequate", "developing", "shows potential", "a reasonable start" |
| 40-59 | "needs significant improvement", "incomplete", "substantial gaps" |
| 0-39 | "does not meet minimum requirements", "fundamental issues" |

**Vocabulary restrictions** (strictly enforced):
- NEVER use "excellent" if the score is below 90
- NEVER use "very good" or "promising" if the score is below 75
- NEVER use dismissive language regardless of score — maintain professional, constructive tone

Example for a 78/100:
> "This is a solid case analysis that demonstrates competent understanding of the strategic
> issues facing the company. The memo is well-organized and most analytical frameworks are
> present, though several areas would benefit from deeper analysis."

### Section 3: Strengths

List 4-6 key strengths as bullet points, following rubric criterion order (Format first,
then Content, then Frameworks, then Quality):

- [Strength from highest-scoring criteria]
- [Strength from second-highest criteria]
- [Continue in rubric order, selecting criteria scored Meets or Exceeds]
- [At minimum 4 strengths; if fewer than 4 criteria scored well, highlight partial strengths]

Each bullet should be 1-2 sentences with specific reference to what the student did well.
Avoid generic praise — cite specific content from the submission.

Example:
> - The memo format is professionally structured with a complete TO/FROM/DATE/RE header,
>   demonstrating understanding of business communication conventions.
> - The SWOT analysis is thorough, identifying four specific strengths and three relevant
>   weaknesses tied directly to the case data in Exhibits 2 and 4.

### Section 4: Areas for Improvement

List specific areas following rubric order, incorporating mandatory feedback phrases where
triggered. Each bullet should include:
1. What criterion is affected
2. What specifically is missing or weak
3. The mandatory feedback phrase (verbatim) if a trigger was detected

#### Mandatory Feedback Triggers

These phrases MUST be used **verbatim** when the corresponding issue is detected in the
scorer output's `detected_issues` array:

| Issue Type | Exact Feedback Text |
|------------|-------------------|
| `personal_opinion` | "Do not refer to yourself or your opinion. Management wants recommendations based on facts and logic, not your belief." |
| `background_in_intro` | "You are writing to management; they already know the background information." |
| `cover_page` | "Analysis memos typically stay inside an organization and do not require a cover page." |
| `recommendations_in_intro` | "Do not include your recommendations in the Introduction section." |
| `rationale_in_recommendations` | "Recommendations need to be clear, concise, and actionable. Your supporting arguments go in the Analysis section." |
| `further_study` | "Management wants actionable recommendations now! The Exhibits provide enough logical arguments." |
| `missing_frameworks` | "Include analytical frameworks, especially [LIST MISSING]." — Replace `[LIST MISSING]` with the comma-separated names of frameworks scored as "No Attempt" |
| `weak_exhibits` | "Exhibits are critical to your analysis and should be fleshed out." |

When a personal opinion is detected, also quote the exact sentence:
> - **Introduction**: Do not refer to yourself or your opinion. Management wants
>   recommendations based on facts and logic, not your belief. (Found: "I believe the
>   company should focus on innovation.")

### Section 5: Recommendations for Your Career

Write 1-2 sentences connecting the feedback to real-world professional impact. Focus on
the most impactful improvement area.

Tailor to the score level:
- **High scorers (85+)**: Focus on refinement — "Strengthening your exhibit depth will
  make your analyses even more persuasive in consulting engagements."
- **Mid scorers (60-84)**: Focus on core skills — "Developing your analytical framework
  usage will significantly improve your ability to present structured recommendations
  to senior management."
- **Low scorers (below 60)**: Focus on fundamentals — "Mastering the memo format and
  including required analytical frameworks are foundational skills that every management
  consultant must demonstrate."

## Document Formatting

### Typography and Layout

- **Font**: Calibri 11pt for body text
- **Headings**: Calibri 14pt bold for Heading 3 section titles
- **Table**: Bordered, header row with gray background (#D9D9D9), alternating row shading
- **Margins**: 1 inch all sides (standard Word defaults)
- **Line spacing**: 1.15
- **Page header** *(optional)*: Course code and student name

### Filename Convention

`{student-last-name}-{student-first-name}-feedback.docx`

Examples:
- `smith-jane-feedback.docx`
- `garcia-rodriguez-maria-feedback.docx`

Sanitize filenames: replace spaces with hyphens, remove special characters, lowercase.

## Workflow

### Step 1: Load Scorer Output

Parse the scorer JSON and extract:
- `criteria_scores` array (for the summary table)
- `detected_issues` array (for mandatory feedback triggers)
- `global_deductions` array (for penalty rows)
- `raw_total`, `adjusted_total`, `percentage` (for totals)
- `student_name` (for header and filename)

### Step 2: Generate Summary Table

Build the scoring table from `criteria_scores`, ordered by rubric category sequence
(Format, Content, Frameworks, Quality). Insert the total row. Add deduction rows if
applicable.

### Step 3: Compose Overall Assessment

Using the `percentage` value, select the appropriate vocabulary tier and write 2-4
sentences. Reference the strongest and weakest areas by name.

### Step 4: Compile Strengths

Select criteria with grade levels of "Meets Expectations" or "Exceeds Expectations".
Order by rubric category. Write 1-2 sentence bullets using the `justification` and
`supporting_quotes` from the scorer output.

### Step 5: Compile Areas for Improvement

Select criteria with grade levels of "Attempt Made", "Below Expectations", or "No Attempt".
Order by rubric category. For each, write a bullet combining:
- The criterion name and what is lacking (from `justification`)
- Any applicable mandatory feedback phrase (from `detected_issues`)
- Exact quotes when relevant (from `supporting_quotes`)

### Step 6: Write Career Recommendations

Based on the percentage and the most impactful weakness, compose 1-2 career-focused sentences.

### Step 7: Assemble and Save Document

Use the `docx-generator` skill (or python-docx library) to:
1. Create a new Word document
2. Add each section with proper heading formatting
3. Insert the summary table with formatting
4. Save to the specified output path with the correct filename

### Step 8: Run Pre-Delivery Checklist

Before finalizing, verify EVERY item:

- [ ] Total points in the summary table sum correctly to the displayed total
- [ ] FROM line criterion is present and scored (2 points, binary)
- [ ] CLV marked "Not Applicable" with 2/2 (unless case involves customer valuation)
- [ ] Exhibits identified by content keywords, not letter labels — no feedback references
      "Exhibit A" or "Exhibit B" by letter
- [ ] Personal opinions only flagged where explicitly stated ("I believe," "I think,"
      "in my opinion") — not inferred
- [ ] Exact sentences quoted when flagging personal opinion issues
- [ ] ALL mandatory feedback phrases used verbatim where triggered (check each issue type)
- [ ] Tone matches score level (vocabulary restrictions enforced)
- [ ] No "excellent" if below 90
- [ ] No "very good" or "promising" if below 75
- [ ] Cover page penalty applied if detected (20% deduction reflected in adjusted total)
- [ ] All section titles formatted as Heading 3
- [ ] Document saved as .docx to the specified output path
- [ ] Filename follows convention: `{last-name}-{first-name}-feedback.docx`

If any checklist item fails, fix the issue before saving the document.

## Output

- **Primary**: `.docx` file saved to the specified output path
- **Secondary**: Confirmation message with file path and score summary

```
Feedback generated: /path/to/output/smith-jane-feedback.docx
Score: 82.4/100 (82.4%)
Sections: Summary Table, Overall Assessment, 5 Strengths, 4 Areas for Improvement, Career Recommendations
```

## Edge Cases

- **Perfect score (100/100)**: Areas for Improvement section should contain 1-2 minor
  refinement suggestions rather than being empty. Career Recommendations should focus
  on advanced professional development.
- **Zero score (0/100)**: Strengths section should acknowledge submission was received.
  Areas for Improvement should prioritize the most fundamental issues first.
- **No detected issues**: Omit mandatory feedback phrases entirely — do not include
  placeholder text.
- **Many detected issues (5+)**: Group related issues together. Do not overwhelm with
  a wall of mandatory feedback — present the most critical first.
- **Non-standard rubric (not 18 criteria)**: Adjust the summary table to match the actual
  rubric. Do not hardcode the 18-criterion layout.
- **Missing scorer fields**: If a criterion in the rubric has no corresponding score in
  the scorer output, flag it as an error and ask the user rather than guessing.
- **Very long justifications**: Truncate supporting quotes to 100 words maximum per criterion
  in the feedback document. Full text remains in the scorer JSON.
- **Student names with special characters**: Sanitize for filename (replace accented characters,
  remove apostrophes, etc.) but preserve original in document header.
- **Multiple deductions stacking**: Apply each deduction sequentially and show each on its
  own row in the summary table.

## Integration with Other CasesIQ Skills

| Skill | Relationship |
|-------|-------------|
| `rubric-scorer` | **Upstream provider** — produces the scores JSON this skill consumes |
| `rubric-builder` | **Upstream provider** — produces the rubric definition for criterion names and structure |
| `case-grader` | **Orchestrator** — calls this skill as the final step in end-to-end grading |
| `batch-grader-orchestrator` | **Orchestrator** — calls this skill once per student in a batch |
| `docx-generator` | **Utility dependency** — used for Word document creation and formatting |
| `student-submission-parser` | **No direct dependency** — but parsed content informs quote selection |
