---
name: teacher-notes-parser
description: >
  Parse teacher/teaching notes (TN) documents that accompany business case studies to extract
  structured pedagogical content for use in grading and course preparation. Use this skill when
  a professor uploads a teaching note PDF and needs it broken down into discussion questions,
  model answers, teaching objectives, analysis frameworks, and key issues. Teaching notes are
  instructor-only guides that define what "good" looks like for student analysis. Supports TNs
  from Harvard Business School Publishing (HBR), Ivey Publishing, Darden, NACRA, and other
  publishers. Triggers include requests to parse, extract, analyze, or structure a teaching
  note. Also trigger when the user says "parse these teaching notes", "extract TN content",
  "break down the teacher notes", "what does the teaching note say", or uploads a TN PDF and
  asks for structured extraction of discussion questions, model answers, or teaching objectives.
---
# ©2026 Brad Scheller

# Teacher Notes Parser

Extract structured pedagogical content from teaching note PDFs for use in the CasesIQ grading
pipeline and course preparation tools.

## Required Inputs

1. **Teaching Notes PDF** — the instructor-only teaching note document
2. **Companion Case Title** — optional, the title of the associated case study for cross-referencing
3. **Output Format** — optional, `json` (default) or `markdown`

If the teaching notes PDF is missing, ask the user before proceeding.

## Extraction Elements

| Element | Description | Typical Location |
|---------|-------------|------------------|
| Case Synopsis | Brief summary of the case | First section |
| Teaching Objectives | What students should learn | Early in the TN |
| Target Audience | Course level, prerequisites | Near objectives |
| Discussion Questions | Suggested questions with model answers | Central section |
| Analysis Framework | Recommended analytical approaches | Throughout |
| Key Issues | Main issues students should identify | Dedicated section or within analysis |
| Model Answers/Analysis | The expected "correct" analysis | Per question or as narrative |
| Board Plan | Suggested whiteboard layout for class | Often a diagram or bullet list |
| Assignment Questions | If different from discussion questions | Separate section |
| Epilogue | What actually happened after the case | End of TN |
| Recommended Readings | Additional references | End of TN |

---

## Parsing Workflow

### Step 1 — Extract Raw Text

Use `pdf-content-extractor` (or equivalent PDF-to-text tool) to extract all text from the
teaching notes PDF. Preserve page boundaries and any formatting cues (bold, numbered lists).

### Step 2 — Identify Standard TN Sections

Most teaching notes follow a predictable structure, though section names vary by publisher.
Scan for these section headings (case-insensitive, with common variants):

| Standard Section | Common Heading Variants |
|------------------|------------------------|
| Synopsis | "Case Synopsis", "Summary", "Case Summary", "Brief Description", "Overview" |
| Teaching Objectives | "Teaching Objectives", "Learning Objectives", "Pedagogical Objectives", "Educational Objectives", "Learning Goals" |
| Target Audience | "Target Audience", "Intended Audience", "Suggested Courses", "Course Positioning", "Suggested Use" |
| Discussion Questions | "Discussion Questions", "Suggested Questions", "Class Discussion", "Questions for Discussion", "Study Questions" |
| Analysis | "Analysis", "Case Analysis", "Detailed Analysis", "Teaching Analysis", "Analytical Framework" |
| Key Issues | "Key Issues", "Main Issues", "Issues for Discussion", "Core Issues", "Central Issues" |
| Board Plan | "Board Plan", "Blackboard Plan", "Whiteboard Plan", "Class Flow", "Discussion Flow" |
| Assignment Questions | "Assignment Questions", "Pre-Class Assignment", "Individual Assignment", "Homework Questions", "Written Assignment" |
| Epilogue | "Epilogue", "What Happened", "Post-Case Update", "Sequel", "Aftermath", "Update" |
| Readings | "Recommended Readings", "Suggested Readings", "References", "Additional Resources", "Bibliography" |

Mark sections as `"not_found"` if they do not appear in the document.

### Step 3 — Extract Discussion Questions

Discussion questions are the core of the teaching note. For each question:

1. Extract the full question text (preserve numbering: Q1, Q2, etc.).
2. Identify the model answer or suggested response that follows the question.
3. Determine if the question maps to a specific analytical framework (SWOT, PESTEL, etc.).
4. Note if the question has sub-parts (a, b, c).
5. Capture any suggested follow-up or probing questions.

**Heuristics for finding question boundaries:**
- Questions are typically numbered (1., 2., 3. or Q1, Q2, Q3).
- Model answers follow immediately after each question, or are grouped in a separate
  "Suggested Answers" section that mirrors the question numbering.
- Some TNs present questions inline within the analysis narrative — extract these too.

### Step 4 — Extract Model Answers per Question

For each discussion question identified in Step 3:

1. Extract the full model answer text.
2. Identify key points the answer covers (bullet these out even if the original is prose).
3. Note any quantitative components (calculations, financial analysis, specific numbers).
4. Identify which analytical frameworks are applied in the answer.
5. Flag any "must mention" items — facts or insights that a strong answer should include.

If model answers are presented as a continuous narrative rather than per-question, map
paragraphs to questions by topic alignment.

### Step 5 — Identify Recommended Frameworks

Scan the entire TN for mentions of analytical frameworks:

| Framework | Detection Keywords |
|-----------|--------------------|
| SWOT Analysis | "swot", "strengths, weaknesses, opportunities, threats" |
| PESTEL Analysis | "pestel", "pestle", "pest", "political, economic, social, technological" |
| Five Forces | "five forces", "porter's forces", "competitive rivalry", "bargaining power" |
| VRIO | "vrio", "valuable, rare, inimitable", "resource-based view" |
| CLV | "customer lifetime value", "clv", "customer valuation" |
| BCG Matrix | "bcg", "growth-share matrix", "stars, cash cows" |
| Value Chain | "value chain", "porter's value chain", "primary activities" |
| Decision Matrix | "decision matrix", "weighted criteria", "scoring matrix" |
| Financial Analysis | "npv", "irr", "dcf", "break-even", "roi", "pro forma" |
| Stakeholder Analysis | "stakeholder analysis", "stakeholder mapping", "power-interest" |

For each detected framework, note:
- Where it appears (which question or section)
- Whether it is required or suggested
- Any specific guidance on how to apply it to this case

### Step 6 — Extract Key Issues List

The key issues section defines what students should identify as the critical problems or
decisions in the case. Extract as a numbered list with:

- Issue statement (one sentence)
- Brief explanation of why it matters
- Connection to discussion questions (if noted)

If there is no explicit "Key Issues" section, synthesize from the discussion questions and
model answers — each major question typically maps to one key issue.

### Step 7 — Extract Additional Sections

- **Board Plan**: Extract as a structured outline (headings, sub-points, timing estimates
  if provided). If presented as an image or diagram, describe its structure textually.
- **Assignment Questions**: Extract separately from discussion questions. Note if they are
  meant for pre-class preparation or post-class reflection.
- **Epilogue**: Extract the full text. Note the actual outcome and any lessons learned.
- **Recommended Readings**: Extract as a reference list (author, title, publication, year).
- **Target Audience**: Extract course names, levels (MBA, undergraduate, executive ed),
  and any prerequisite knowledge mentioned.

### Step 8 — Generate Structured Output

Assemble all extracted elements into the requested output format (JSON or markdown).

---

## Output Format

### JSON Output

```json
{
  "companion_case": {
    "title": "Acme Corporation: The Growth Decision",
    "case_number": "9-123-456",
    "publisher": "Harvard Business School Publishing"
  },
  "synopsis": "Acme Corporation's VP of Marketing must recommend whether to expand into Asia through acquisition, organic growth, or a joint venture. The case explores international expansion strategy, financial analysis, and organizational readiness.",
  "teaching_objectives": [
    "Evaluate international market entry strategies",
    "Apply financial analysis frameworks (NPV, scenario analysis) to strategic decisions",
    "Assess organizational readiness for expansion",
    "Practice stakeholder management in strategic decision-making"
  ],
  "target_audience": {
    "level": "MBA, second-year elective",
    "courses": ["International Business", "Corporate Strategy", "Marketing Strategy"],
    "prerequisites": "Basic financial analysis, introductory strategy course"
  },
  "discussion_questions": [
    {
      "number": 1,
      "text": "What are the key factors Acme should consider when evaluating international expansion?",
      "sub_parts": [],
      "mapped_framework": "PESTEL Analysis",
      "model_answer": {
        "full_text": "Students should identify political stability, economic growth rates, regulatory environment, cultural differences, and competitive landscape in potential Asian markets...",
        "key_points": [
          "Political and regulatory environment in target markets",
          "Economic growth projections for Asian consumer electronics",
          "Cultural adaptation requirements for Acme's products",
          "Existing competitive landscape and barriers to entry"
        ],
        "quantitative_components": [],
        "must_mention": ["regulatory risk in China", "growth rate differential vs. US market"]
      },
      "follow_up_questions": ["How would your analysis change if the target market were Europe instead of Asia?"]
    },
    {
      "number": 2,
      "text": "Evaluate each of the three strategic alternatives available to Sarah Chen.",
      "sub_parts": [
        "a) What are the pros and cons of acquisition?",
        "b) What are the pros and cons of organic growth?",
        "c) What are the pros and cons of a joint venture?"
      ],
      "mapped_framework": "Decision Matrix",
      "model_answer": {
        "full_text": "...",
        "key_points": ["..."],
        "quantitative_components": ["NPV analysis of acquisition at $500M", "Organic growth 5-year projection"],
        "must_mention": ["integration risk for acquisition", "time-to-market advantage"]
      },
      "follow_up_questions": []
    }
  ],
  "key_issues": [
    {
      "issue": "International market entry strategy selection",
      "explanation": "Acme must choose between acquisition, organic growth, or JV — each with fundamentally different risk/return profiles",
      "related_questions": [1, 2]
    },
    {
      "issue": "Organizational readiness for international operations",
      "explanation": "Acme has no prior international experience; execution capability is uncertain",
      "related_questions": [3]
    }
  ],
  "recommended_frameworks": [
    {
      "name": "PESTEL Analysis",
      "usage": "Evaluate macro environment of target Asian markets",
      "required": true,
      "appears_in": "Question 1"
    },
    {
      "name": "Decision Matrix",
      "usage": "Compare the three strategic alternatives on weighted criteria",
      "required": true,
      "appears_in": "Question 2"
    }
  ],
  "board_plan": {
    "structure": [
      "Opening (5 min): Cold call — What is Sarah's core dilemma?",
      "Key Issues (15 min): Build issues list on board",
      "Alternative Analysis (25 min): Three-column comparison",
      "Recommendation (10 min): Vote and defend",
      "Epilogue (5 min): Reveal what actually happened"
    ],
    "timing": "60 minutes total"
  },
  "assignment_questions": [],
  "epilogue": "Acme ultimately pursued a joint venture with TechAsia Ltd., which proved successful in the first two years with $150M in Asian revenue by 2025. However, tensions over product localization decisions led to a renegotiation of the JV terms in late 2025.",
  "recommended_readings": [
    {
      "author": "Ghemawat, P.",
      "title": "Distance Still Matters: The Hard Reality of Global Expansion",
      "publication": "Harvard Business Review",
      "year": 2001
    }
  ]
}
```

### Markdown Output

When `markdown` is selected, produce an equivalent document with H2 headings for each element,
numbered lists for questions, and nested bullet points for model answers and key points.

---

## Edge Cases

- **Very brief TNs (2-3 pages)**: Some teaching notes, particularly from smaller publishers
  or older cases, provide minimal guidance. Extract what is available and mark missing sections
  as `"not_found"`. Do not fabricate content.
- **Extensive TNs (30+ pages)**: Some TNs include full quantitative solutions, multiple
  teaching plans for different course contexts, or extensive supplementary materials. Parse
  all content but clearly label which teaching plan variant each element belongs to.
- **Quantitative solutions**: TNs for finance or accounting cases may include spreadsheet
  models, DCF calculations, or financial statement analysis. Extract the key assumptions,
  formulas, and results. Note specific numbers that represent "correct" answers.
- **Q&A format vs. narrative essays**: Some TNs present model answers as direct responses
  under each question. Others embed answers within a flowing analytical essay. For narrative
  formats, use topic alignment to map paragraphs to the questions they address.
- **Publisher format differences**:
  - **HBR**: Typically well-structured with clear section headings and numbered questions.
  - **Ivey**: Often includes a "Case Map" or visual teaching flow diagram.
  - **Darden**: May include multiple "Teaching Plan" variants (60-min, 90-min).
  - **NACRA**: Formatting varies widely as these are often author-submitted.
- **Multiple teaching plans**: Some TNs provide both a lecture-based and discussion-based
  plan. Extract both and label them distinctly.
- **Confidentiality warnings**: TNs always contain confidentiality notices ("For instructor
  use only"). Note but do not include these in the structured output.
- **TNs without clear discussion questions**: Rare but possible. In this case, extract the
  analysis sections and synthesize implied questions from the key issues discussed.

---

## Integration with Other CasesIQ Skills

- **pdf-content-extractor**: Called in Step 1 to convert the TN PDF to raw text.
- **case-study-parser**: The companion case should be parsed first. The TN parser uses the
  case's central problem and alternatives to validate that extracted discussion questions
  and model answers align with the case content.
- **case-grader**: This is the primary consumer of teacher-notes-parser output. The grader
  uses extracted discussion questions, model answers, key issues, and recommended frameworks
  to establish the scoring baseline. The model answers define what "Exceeds Expectations"
  looks like for each rubric criterion.
- **student-submission-parser**: The frameworks recommended in the TN tell the submission
  parser which exhibit types to expect in student work.
