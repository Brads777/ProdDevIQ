---
name: student-submission-parser
description: >
  Parse student case analysis submissions to extract their structure and content for grading.
  Use this skill when a student submission (PDF or DOCX) needs to be broken down into its
  component sections, exhibits identified by content keywords, and metadata extracted for
  the grading pipeline. This skill uses the same exhibit identification approach as the
  case-grader skill: exhibits are identified by CONTENT KEYWORDS, never by letter label,
  because students label exhibits differently. Triggers include requests to parse, extract,
  analyze, or structure a student submission. Also trigger when the user says "parse this
  submission", "extract student work", "break down this paper", "structure this memo",
  "prepare this for grading", or uploads a student document and asks for structured extraction
  before grading.
---
# ©2026 Brad Scheller

# Student Submission Parser

Extract structured content from student case analysis submissions for use in the CasesIQ
grading pipeline. Identifies memo sections, exhibits by content keywords, formatting issues,
and personal opinion markers.

## Required Inputs

1. **Student Submission** — the student's case analysis (PDF or DOCX)
2. **Expected Frameworks** — optional, list of frameworks the grading rubric expects
   (defaults to the full CasesIQ framework list if not provided)
3. **Output Format** — optional, `json` (default) or `markdown`

If the student submission is missing, ask the user before proceeding.

## Extraction Elements

| Element | Description | Grading Relevance |
|---------|-------------|-------------------|
| Memo Header | TO, FROM, DATE, RE fields | FROM field worth 2 points |
| Cover Page | Detect if present | Triggers 20% penalty |
| Introduction / Key Issues | Opening section identifying the case problem | 8 points |
| Recommendations | Student's proposed solutions | 8 points |
| Decision Criteria | Criteria used to evaluate alternatives | 8 points |
| Analysis | Main analytical body | 8 points |
| Conclusion | Summary and final thoughts | 8 points |
| Exhibits | Each identified by content keywords, mapped to framework | 2-8 points each |
| Personal Opinions | "I believe", "I think", "in my opinion" | Mandatory feedback trigger |
| Word Count | Total and per-section | Quality indicator |

---

## Parsing Workflow

### Step 1 — Extract Raw Text

Use `pdf-content-extractor` (for PDF) or `docx-content-extractor` (for DOCX) to extract all
text from the student submission. Preserve:

- Page boundaries
- Heading hierarchy (bold, font size changes)
- Table structures
- Line breaks and paragraph separations

### Step 2 — Detect Cover Page

Scan the first page for cover page indicators:

- Page contains only: student name, course name, date, professor name, and/or case title
- No substantive content (no TO/FROM memo header, no analysis text)
- Often includes a university logo or course number

If a cover page is detected:
- Set `cover_page_detected: true`
- Record this for the 20% penalty in grading
- Begin substantive parsing from page 2

### Step 3 — Extract Memo Header

Scan the first substantive page for memo header fields. Common formats:

```
TO:     Professor [Name]
FROM:   [Student Name(s)]
DATE:   [Date]
RE:     [Case Title] Analysis
```

Variants to detect:
- "TO:" / "To:" / "TO :" / "Memorandum To:"
- "FROM:" / "From:" / "FROM :" / "Memorandum From:"
- "DATE:" / "Date:" / "DATE :"
- "RE:" / "Re:" / "SUBJECT:" / "Subject:" / "REGARDING:"

For each field, extract:
- **TO**: Recipient name and title
- **FROM**: Student name(s) — critical for grading (2 points). For group submissions,
  capture all names listed.
- **DATE**: Date as written
- **RE**: Subject line (usually contains the case name)

If no memo header is found, set `memo_format: false` and note the absence.

### Step 4 — Identify Body Sections

After the memo header, identify the main body sections. Students typically use one of
these structures:

**Standard structure:**
1. Introduction / Key Issues
2. Recommendations
3. Decision Criteria (sometimes before Recommendations)
4. Analysis
5. Conclusion

**Section detection heuristics:**

| Section | Detection Patterns |
|---------|--------------------|
| Introduction | "Introduction", "Key Issues", "Problem Statement", "Executive Summary", "Background", "Issue Identification" |
| Recommendations | "Recommendations", "Proposed Solutions", "Action Plan", "Strategic Recommendations" |
| Decision Criteria | "Decision Criteria", "Evaluation Criteria", "Criteria", "Framework for Evaluation" |
| Analysis | "Analysis", "Discussion", "Evaluation", "Assessment", "Supporting Analysis" |
| Conclusion | "Conclusion", "Summary", "Final Thoughts", "Closing", "In Conclusion" |

For each section:
- Extract the full text content
- Calculate word count
- Note the page(s) it spans
- Flag if the section appears to be missing

**Important**: Some students do not use explicit section headings. In that case, use content
analysis to infer section boundaries:
- The first substantive paragraph after the memo header is the Introduction.
- Paragraphs with action verbs and directives ("The company should...", "We recommend...")
  indicate Recommendations.
- The final paragraph(s) before exhibits is the Conclusion.

### Step 5 — Identify Exhibits by Content Keywords (CRITICAL)

**NEVER identify exhibits by their letter label.** Students assign letters arbitrarily.
Use content keywords to determine what framework each exhibit represents.

#### Keyword Matching Table

| Framework | Match Keywords (title OR body, case-insensitive) | Rubric Points |
|-----------|--------------------------------------------------|---------------|
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

#### Exhibit Identification Procedure

1. Extract all text from the submission.
2. Locate every heading or label that contains "exhibit", "appendix", "attachment", or
   "supporting analysis" (case-insensitive).
3. For each exhibit found, read the title AND the first 200 words of body content.
4. Match against the keyword table above to determine which framework it represents.
5. An exhibit may match multiple frameworks (e.g., "Additional Analysis" containing both
   Five Forces and VRIO). Map each matched framework independently.
6. If a framework appears in the body text without an explicit exhibit label, still
   identify it — students sometimes embed frameworks in the Analysis section directly.
7. If no match is found for a given framework, mark it as `"not_found"`.

For each identified exhibit, extract:
- Student's label (e.g., "Exhibit A", "Appendix 1")
- Student's title (e.g., "SWOT Analysis of Acme Corp")
- Matched framework(s) from the keyword table
- Full content (text, table data, bullet lists)
- Page number(s)
- Quality indicators: Is it complete? Does it have sufficient detail?

### Step 6 — Detect Personal Opinions

Scan the Introduction, Analysis, and Conclusion sections (NOT exhibits or recommendations)
for personal opinion markers:

| Marker Pattern | Detection Strings |
|----------------|-------------------|
| First person belief | "I believe", "I think", "I feel", "in my opinion", "in my view" |
| First person plural belief | "we believe", "we think", "we feel", "in our opinion" |
| Personal judgment | "I would argue", "I contend", "personally", "from my perspective" |

For each detection:
- Record the exact sentence containing the marker
- Record the section where it appears
- Record the page number

**Important**: Only flag opinions in Introduction, Analysis, or Conclusion. Personal language
in Recommendations is acceptable (e.g., "We recommend...").

### Step 7 — Calculate Word Counts

Calculate:
- **Total word count**: All text in the submission (excluding headers, page numbers, exhibit
  labels)
- **Per-section word count**: Introduction, Recommendations, Decision Criteria, Analysis,
  Conclusion
- **Exhibit word count**: Total across all exhibits
- **Body-to-exhibit ratio**: Percentage of words in body vs. exhibits

### Step 8 — Generate Structured Output

Assemble all extracted elements into the requested output format (JSON or markdown).

---

## Output Format

### JSON Output

```json
{
  "submission_metadata": {
    "file_name": "JohnDoe_AcmeCase_Analysis.pdf",
    "file_type": "pdf",
    "total_pages": 12,
    "total_word_count": 3847
  },
  "cover_page": {
    "detected": false,
    "penalty_applicable": false
  },
  "memo_header": {
    "memo_format_detected": true,
    "to": "Professor Williams",
    "from": "John Doe",
    "from_present": true,
    "date": "February 15, 2026",
    "re": "Acme Corporation Case Analysis"
  },
  "sections": {
    "introduction": {
      "detected": true,
      "heading_used": "Introduction and Key Issues",
      "content": "Acme Corporation faces a critical decision regarding international expansion...",
      "word_count": 412,
      "pages": [1, 2]
    },
    "recommendations": {
      "detected": true,
      "heading_used": "Recommendations",
      "content": "We recommend that Acme pursue a joint venture strategy...",
      "word_count": 385,
      "pages": [2, 3]
    },
    "decision_criteria": {
      "detected": true,
      "heading_used": "Criteria for Evaluation",
      "content": "The following criteria were used to evaluate alternatives...",
      "word_count": 290,
      "pages": [3]
    },
    "analysis": {
      "detected": true,
      "heading_used": "Analysis",
      "content": "An examination of the three strategic alternatives reveals...",
      "word_count": 1105,
      "pages": [3, 4, 5]
    },
    "conclusion": {
      "detected": true,
      "heading_used": "Conclusion",
      "content": "In summary, the joint venture approach best meets Acme's strategic objectives...",
      "word_count": 245,
      "pages": [5, 6]
    }
  },
  "exhibits": [
    {
      "student_label": "Exhibit A",
      "student_title": "Guide Questions",
      "matched_framework": "Guide Questions",
      "matched_keywords": ["guide questions"],
      "content_summary": "Six questions addressing Acme's strategic position...",
      "page": 7,
      "quality_notes": "Complete, addresses all assigned questions"
    },
    {
      "student_label": "Exhibit B",
      "student_title": "Key Issues and Questions",
      "matched_framework": "List of Issues and Questions",
      "matched_keywords": ["key issues"],
      "content_summary": "Identifies 5 key issues with supporting questions...",
      "page": 8,
      "quality_notes": "Good depth, connects issues to case facts"
    },
    {
      "student_label": "Exhibit C",
      "student_title": "Weighted Decision Criteria",
      "matched_framework": "List of Decision Criteria",
      "matched_keywords": ["decision criteria", "weighted criteria"],
      "content_summary": "7 criteria with percentage weights totaling 100%...",
      "page": 9,
      "quality_notes": "Weights are logical, criteria are relevant"
    },
    {
      "student_label": "Exhibit D",
      "student_title": "Alternative Scoring Matrix",
      "matched_framework": "Decision Matrix",
      "matched_keywords": ["scoring matrix", "alternative scoring"],
      "content_summary": "3x7 matrix scoring each alternative against criteria...",
      "page": 10,
      "quality_notes": "Scores align with analysis section arguments"
    },
    {
      "student_label": "Exhibit E",
      "student_title": "Pros and Cons of Each Alternative",
      "matched_framework": "Pros and Cons List",
      "matched_keywords": ["pros and cons"],
      "content_summary": "Three-column layout with pros and cons per alternative...",
      "page": 11,
      "quality_notes": "Thorough, 4-5 items per alternative"
    },
    {
      "student_label": "Exhibit F",
      "student_title": "SWOT Analysis",
      "matched_framework": "SWOT Analysis",
      "matched_keywords": ["swot"],
      "content_summary": "Four-quadrant SWOT with 3-4 items per quadrant...",
      "page": 11,
      "quality_notes": "Relevant to case context, properly categorized"
    },
    {
      "student_label": "Exhibit G",
      "student_title": "Additional Analysis",
      "matched_framework": ["PESTEL Analysis", "Five Forces Analysis"],
      "matched_keywords": ["pestel", "five forces"],
      "content_summary": "Combined exhibit with PESTEL table and Five Forces summary...",
      "page": 12,
      "quality_notes": "PESTEL is detailed; Five Forces is brief"
    }
  ],
  "unmatched_exhibits": [
    {
      "student_label": "Exhibit H",
      "student_title": "Industry Overview Map",
      "matched_framework": null,
      "content_summary": "Geographic map of Asian markets with revenue data",
      "note": "Does not map to any rubric framework — informational only"
    }
  ],
  "missing_frameworks": ["VRIO Analysis", "CLV Analysis"],
  "personal_opinions": [
    {
      "text": "I believe that the acquisition strategy is too risky for a company of Acme's size.",
      "section": "analysis",
      "page": 4,
      "marker": "I believe"
    }
  ],
  "word_counts": {
    "total": 3847,
    "introduction": 412,
    "recommendations": 385,
    "decision_criteria": 290,
    "analysis": 1105,
    "conclusion": 245,
    "exhibits": 1410,
    "body_to_exhibit_ratio": "63:37"
  }
}
```

### Markdown Output

When `markdown` is selected, produce an equivalent document with H2 headings for each element,
tables for exhibits and word counts, and blockquotes for flagged personal opinion sentences.

---

## Edge Cases

- **PDF vs. DOCX submissions**: Both formats must be supported. DOCX preserves heading styles
  and table structures more reliably. PDF requires text extraction that may lose formatting.
  Attempt both extraction paths if the first yields poor structure.
- **No memo format**: Some students submit essays instead of memos. Set `memo_format_detected:
  false`, skip memo header extraction, and proceed with section identification using content
  heuristics.
- **Exhibits embedded in body**: Some students include frameworks (e.g., a SWOT table) within
  the Analysis section rather than as separate exhibits. Still identify and map these using
  the keyword table. Note `"embedded_in_body": true` for these items.
- **Group submissions with multiple FROM names**: Extract all names from the FROM field.
  Common formats: "John Doe, Jane Smith, and Bob Lee" or "Team 3: J. Doe, J. Smith, B. Lee".
- **Very short submissions (1-2 pages)**: Likely missing multiple sections and exhibits.
  Extract what is present, mark missing elements, and note the overall brevity for the grader.
- **Very long submissions (20+ pages)**: May contain excessive detail or redundant exhibits.
  Parse completely but note the length as a quality data point.
- **Non-standard exhibit labeling**: "Appendix 1", "Attachment A", "Supporting Analysis",
  "Figure 1", or no label at all. Scan all of these using the same keyword matching approach.
- **Combined exhibits**: A single exhibit titled "Additional Analysis" may contain multiple
  frameworks (e.g., PESTEL + Five Forces + VRIO). Map each framework independently and note
  they share a single exhibit container.
- **Missing section headings**: If the student writes in continuous prose without headings,
  use content analysis to infer boundaries. Look for transition phrases ("Turning to our
  recommendations...", "In conclusion...") and structural cues (bullet lists for
  recommendations, tables for exhibits).
- **Scanned PDFs**: If the PDF is a scan (image-based), note that OCR extraction may
  introduce errors. Flag `"ocr_extracted": true` and warn about potential accuracy issues.
- **Non-English submissions**: If the submission is not in English, note the language and
  attempt extraction. Keyword matching should be adapted or the user should provide
  translated keyword equivalents.

---

## Integration with Other CasesIQ Skills

- **pdf-content-extractor**: Called in Step 1 to convert PDF submissions to raw text.
- **case-study-parser**: The parsed case provides context for what the submission should
  address — the central problem, alternatives, and stakeholders. If the student's identified
  issues do not align with the case's central problem, this is a quality signal.
- **teacher-notes-parser**: The parsed teaching notes define which frameworks should appear
  in student work. The `expected_frameworks` input can be auto-populated from the TN parser's
  `recommended_frameworks` output.
- **case-grader**: This is the primary consumer of student-submission-parser output. The
  grader receives the structured submission data and scores each element against the rubric.
  The parser's exhibit mapping, personal opinion flags, cover page detection, and FROM field
  check directly feed into grading criteria.
