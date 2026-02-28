---
name: case-study-parser
description: >
  Parse business case study documents (PDF) to extract structured academic elements for teaching
  and grading. Use this skill when a professor uploads a case study PDF and needs it broken down
  into structured components: metadata, protagonist, organization, timeline, central problem,
  stakeholders, alternatives, exhibits, and key quotes. Supports cases from Harvard Business
  School Publishing (HBR), Ivey Publishing, Darden, NACRA, and other publishers. Triggers
  include requests to parse, extract, analyze, break down, or structure a case study document.
  Also trigger when the user says "parse this case", "extract case elements", "break down this
  case study", "structure this case", or uploads a case PDF and asks for structured extraction
  of its content.
---
# ©2026 Brad Scheller

# Case Study Parser

Extract structured academic content from business case study PDFs for use in the CasesIQ
teaching and grading pipeline.

## Required Inputs

1. **Case Study PDF** — the original case study document from a recognized publisher
2. **Publisher Hint** — optional, the publisher name if known (HBR, Ivey, Darden, NACRA, etc.)
3. **Output Format** — optional, `json` (default) or `markdown`

If the case PDF is missing, ask the user before proceeding.

## Extraction Elements

| Element | Description | Location Hint |
|---------|-------------|---------------|
| Metadata | Title, author(s), publisher, date, case number, page count | First page header/footer |
| Protagonist | Name, role/title, organization | First 1-2 paragraphs |
| Organization | Company name, industry, size, geography | Opening section |
| Timeline | Key dates and events in chronological order | Throughout |
| Central Problem | The core decision or challenge the protagonist faces | Often stated in opening or after setup |
| Stakeholders | Key people mentioned with roles and interests | Throughout |
| Alternatives | Possible courses of action (explicit or implied) | Middle-to-end sections |
| Data/Exhibits | Tables, charts, financial data embedded in the case | Appendices and inline |
| Industry Context | Market conditions, competitive landscape | Background sections |
| Key Quotes | Important dialogue or statements by characters | Throughout |

---

## Parsing Workflow

### Step 1 — Extract Raw Text

Use `pdf-content-extractor` (or equivalent PDF-to-text tool) to extract all text from the case
PDF. Preserve page boundaries so metadata can be located on page one.

### Step 2 — Identify Case Metadata

Scan the first page for structured metadata fields:

- **Title**: Usually the largest or boldest text on page one.
- **Author(s)**: Typically listed below the title, sometimes with institutional affiliations.
- **Publisher**: Identify from logo text, footer, or copyright line. Common patterns:
  - HBR: "Harvard Business School" or "HBS Case"
  - Ivey: "Ivey Publishing" or "Richard Ivey School of Business"
  - Darden: "Darden Business Publishing" or "University of Virginia"
  - NACRA: "North American Case Research Association"
- **Publication Date**: Usually near the author line or in the footer.
- **Case Number**: Alphanumeric identifier (e.g., `9-123-456` for HBR, `9B21A001` for Ivey).
- **Page Count**: Total pages from PDF metadata or page extraction.

### Step 3 — Identify the Protagonist

Read the first two paragraphs of the case body (after metadata). The protagonist is typically:

- The first named individual introduced.
- Described with a title/role and organizational affiliation.
- Often presented in a scene (e.g., "Sarah Chen, VP of Marketing at Acme Corp, stared at the
  quarterly report...").

Extract:
- Full name
- Title / role
- Organization
- Relationship to the central problem

### Step 4 — Extract the Central Problem

The central problem is the decision or challenge the protagonist must resolve. Look for:

- Explicit problem statements: "The question was...", "She needed to decide...",
  "The board expected a recommendation by..."
- Implicit framing: tension between two options, a deadline, conflicting stakeholder interests.
- Often appears in the first page after protagonist introduction, or is restated near the end
  of the case narrative before exhibits.

Extract as a single clear sentence or short paragraph.

### Step 5 — Map Stakeholders

Scan the entire document for named individuals and their roles. For each stakeholder, extract:

- Name
- Title / role
- Organization (if different from protagonist's)
- Relationship to the central problem (supporter, opponent, decision-maker, affected party)
- Key positions or interests mentioned

Exclude minor mentions (e.g., a secretary mentioned once in passing).

### Step 6 — Build Timeline

Extract all dates, time references, and sequenced events:

- Explicit dates: "In March 2019...", "By Q4 2020..."
- Relative dates: "Three months later...", "The previous year..."
- Key milestones: founding dates, product launches, market events, deadlines

Sort chronologically and note which events are historical context vs. the present-tense
decision window.

### Step 7 — Identify Alternatives

Extract the courses of action available to the protagonist:

- **Explicitly stated**: "Option A was to...", "The alternatives included..."
- **Implied**: Different stakeholders advocating different paths, or the narrative presenting
  trade-offs between approaches.
- Include the status quo / "do nothing" option if it is a viable alternative.

For each alternative, note:
- Brief description
- Who advocates for it (if mentioned)
- Key trade-offs or risks mentioned

### Step 8 — Extract Embedded Exhibits

Locate tables, charts, and financial data within the case:

- Scan for "Exhibit", "Table", "Figure", "Appendix" labels.
- For each exhibit, extract:
  - Label and title
  - Type (table, chart, financial statement, map, org chart, etc.)
  - A text representation of the data (for tables, extract rows/columns)
  - Page number where it appears
- Note if exhibits are inline or in a separate appendix section.

### Step 9 — Extract Industry Context

Identify sections discussing:

- Market size, growth rates, trends
- Competitive landscape (named competitors, market shares)
- Regulatory environment
- Technology changes
- Macroeconomic factors

Summarize in 2-5 bullet points.

### Step 10 — Extract Key Quotes

Identify dialogue or attributed statements that:

- Reveal character motivations or positions
- State the problem or a key insight
- Represent conflicting viewpoints

For each quote, capture:
- The exact text (in quotation marks)
- The speaker
- Page number or paragraph context

### Step 11 — Generate Structured Output

Assemble all extracted elements into the requested output format (JSON or markdown).

---

## Output Format

### JSON Output

```json
{
  "metadata": {
    "title": "Acme Corporation: The Growth Decision",
    "authors": ["Jane Smith", "John Doe"],
    "publisher": "Harvard Business School Publishing",
    "publication_date": "2023-01-15",
    "case_number": "9-123-456",
    "page_count": 18
  },
  "protagonist": {
    "name": "Sarah Chen",
    "role": "VP of Marketing",
    "organization": "Acme Corporation",
    "relationship_to_problem": "Must recommend growth strategy to the board"
  },
  "organization": {
    "name": "Acme Corporation",
    "industry": "Consumer Electronics",
    "size": "$2.3B annual revenue, 5,000 employees",
    "geography": "Headquartered in Boston, MA; operations in US and Europe"
  },
  "central_problem": "Sarah Chen must recommend whether Acme should expand into the Asian market through acquisition or organic growth, with a board presentation deadline in 6 weeks.",
  "timeline": [
    {"date": "2015", "event": "Acme founded in Boston"},
    {"date": "2020-Q3", "event": "Revenue crosses $1B"},
    {"date": "2023-01", "event": "Board requests Asia expansion recommendation"}
  ],
  "stakeholders": [
    {
      "name": "Sarah Chen",
      "role": "VP of Marketing",
      "interest": "Advocates for organic growth based on brand-building experience"
    },
    {
      "name": "David Park",
      "role": "CFO",
      "interest": "Prefers acquisition for faster market entry and financial modeling"
    }
  ],
  "alternatives": [
    {
      "description": "Acquire a local Asian competitor",
      "advocate": "David Park (CFO)",
      "trade_offs": "Faster entry but integration risk and $500M price tag"
    },
    {
      "description": "Organic growth through new regional offices",
      "advocate": "Sarah Chen (VP Marketing)",
      "trade_offs": "Lower cost but 3-5 year timeline to meaningful revenue"
    },
    {
      "description": "Joint venture with established Asian partner",
      "advocate": "Board member suggestion",
      "trade_offs": "Shared risk but shared control and profits"
    }
  ],
  "exhibits": [
    {
      "label": "Exhibit 1",
      "title": "Acme Financial Summary 2018-2022",
      "type": "financial_table",
      "page": 14
    }
  ],
  "industry_context": [
    "Global consumer electronics market growing at 4.2% CAGR",
    "Asian market represents 40% of global demand",
    "Three major competitors already established in Asia"
  ],
  "key_quotes": [
    {
      "text": "We can't afford to wait three years while our competitors eat our lunch.",
      "speaker": "David Park",
      "context": "During executive committee meeting, page 6"
    }
  ]
}
```

### Markdown Output

When `markdown` is selected, produce an equivalent document with H2 headings for each element
and bullet lists for items within each section.

---

## Edge Cases

- **Multiple protagonists**: Some cases feature co-founders or a team making a joint decision.
  List all protagonists and note the primary decision-maker if one is identifiable.
- **Third person vs. first person**: Most cases are third person. Rare first-person cases
  (e.g., "I walked into the boardroom...") should still extract the narrator as protagonist.
- **Extensive appendices**: Cases with 10+ pages of exhibits may have exhibits that are
  purely reference data (industry reports, full financial statements). Extract metadata for
  all exhibits but only detail-parse those referenced in the case narrative.
- **Different publisher formats**: HBR cases typically have a two-column first page with
  metadata in a sidebar. Ivey cases use a header block. Darden uses a different footer format.
  Adapt metadata extraction heuristics to the detected publisher.
- **Teaching cases vs. research cases**: Teaching cases are designed for classroom discussion
  and always have a decision point. Research cases may be more descriptive. Flag if no clear
  decision point is found.
- **Non-English cases**: If the case is not in English, note the language in metadata and
  proceed with extraction. Output should still be in English (translate key quotes).
- **Redacted or partial PDFs**: If the PDF is missing pages or has redacted sections, note
  the gaps in the output and mark affected elements as `"incomplete"`.

---

## Integration with Other CasesIQ Skills

- **pdf-content-extractor**: Called in Step 1 to convert the case PDF to raw text.
- **teacher-notes-parser**: The structured case output from this skill is used alongside
  teacher notes to establish the "correct" analysis for grading.
- **case-grader**: The extracted central problem, alternatives, and stakeholders inform
  what the grader should expect in student submissions.
- **student-submission-parser**: The exhibit types and alternatives extracted here help
  validate whether student submissions address the right issues.
