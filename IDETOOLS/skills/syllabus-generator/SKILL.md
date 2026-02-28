---
name: syllabus-generator
description: >
  Generate a complete, professionally formatted course syllabus from a structured roadmap
  definition. Use this skill when a professor needs to create, build, draft, or produce a
  syllabus for their course. The roadmap is the output of an interactive process where the
  professor selected topics, learning objectives, and modules. This skill takes that structured
  roadmap plus course metadata and produces a fully formatted syllabus document with all
  standard sections including course header, instructor info, description, learning objectives,
  required materials, grading policy, week-by-week schedule, assignment descriptions, and
  institutional policies. Triggers include requests to "generate a syllabus", "create a
  syllabus", "build my syllabus", "draft the course syllabus", "produce a syllabus from my
  roadmap", "turn this roadmap into a syllabus", or any request that involves converting
  course planning data into a formatted syllabus document. Also triggers when a user uploads
  a roadmap or course outline and asks for it to be formatted as a syllabus.
---
# ©2026 Brad Scheller

# Syllabus Generator

Generate a complete, professionally formatted course syllabus from a structured roadmap
definition and course metadata. Produces publication-ready output in Markdown, DOCX, or HTML.

## Required Inputs

1. **Course Metadata** — name, code, section, semester, year, meeting times, location
2. **Instructor Information** — name, title, email, office hours, office location
3. **Roadmap** — ordered list of weekly modules with topics and learning objectives (output of the course-planning workflow)
4. **Grading Breakdown** — category weights with descriptions (e.g., participation 10%, cases 30%, quizzes 20%, final project 25%, attendance 15%)
5. **Required Materials** — textbooks, case packets, software, access codes (optional — prompt if missing)
6. **Institutional Policies** — academic integrity, disability services, attendance boilerplate (optional — use defaults if not provided)
7. **Case Assignments** — per-week case assignments from the case-grader skill output (optional)

If any of inputs 1-4 are missing, ask the user before proceeding. For inputs 5-7, proceed with sensible defaults and flag what was assumed.

## Syllabus Generation Workflow

### Step 1: Validate Inputs

1. Confirm all required metadata fields are present.
2. Verify the roadmap has a consistent structure: each module needs at minimum a topic and at least one learning objective.
3. Check that grading weights sum to exactly 100%. If they do not, halt and ask the user to correct.
4. Validate that the number of roadmap weeks matches the expected semester length. If mismatched, warn the user.

### Step 2: Generate Course Description

1. Read all learning objectives and module topics from the roadmap.
2. Synthesize a 2-3 paragraph course description that:
   - Opens with the subject area and its importance
   - Describes the pedagogical approach (case-based, lecture, seminar, etc.)
   - Summarizes what students will be able to do upon completion
3. Keep the tone professional and institution-appropriate. Avoid marketing language.

### Step 3: Format Learning Objectives

1. Extract all learning objectives from the roadmap.
2. Deduplicate and consolidate overlapping objectives.
3. Number sequentially as LO1, LO2, LO3, etc.
4. Ensure each objective uses a measurable verb (Bloom's taxonomy): Analyze, Evaluate, Apply, Create, etc.
5. If any objective uses vague verbs ("understand", "know", "learn about"), rewrite it with a measurable verb and flag the change for professor review.

### Step 4: Build the Course Schedule Table

1. If a `course-schedule-builder` date grid is available, merge the roadmap content onto the date grid.
2. If no date grid is provided, generate a generic week-number schedule (Week 1, Week 2, etc.) without specific dates.
3. For each week, populate:
   - **Week number** (and dates if available)
   - **Topic** from the roadmap module
   - **Readings** — textbook chapters, case names, or supplementary materials
   - **Assignments Due** — any deliverables due that week
4. Mark holidays, breaks, and exam periods if date grid is available.
5. Include a final exam row or final project due date.

The course schedule table is the most critical section of the syllabus. Format:

| Week | Dates | Topic | Readings | Assignments Due |
|------|-------|-------|----------|-----------------|
| 1 | Jan 13-17 | Introduction to Strategic Management | Ch. 1-2 | -- |
| 2 | Jan 20-24 | Industry Analysis | Ch. 3, Case: Southwest Airlines | Discussion 1 |
| 3 | Jan 27-31 | Competitive Advantage | Ch. 4-5, Case: Costco | Quiz 1, Case Brief 1 |
| ... | ... | ... | ... | ... |
| 15 | Apr 28-May 2 | Course Review & Presentations | -- | Final Project Due |
| 16 | May 5-9 | Final Exam Week | -- | Final Exam |

### Step 5: Compose Grading Policy

1. Build a grading breakdown table from the provided weights:

| Category | Weight | Description |
|----------|--------|-------------|
| Case Analyses | 30% | 5 case write-ups, each graded per the case analysis rubric |
| Quizzes | 20% | Weekly quizzes on readings and case material |
| Participation | 10% | In-class discussion quality and frequency |
| Final Project | 25% | Capstone case analysis and presentation |
| Attendance | 15% | Physical presence and punctuality |

2. Include a grading scale (A/A-/B+/B/B-/C+/C/C-/D/F with corresponding percentages).
3. If the professor did not provide a grading scale, use the standard scale:
   - A: 93-100, A-: 90-92, B+: 87-89, B: 83-86, B-: 80-82
   - C+: 77-79, C: 73-76, C-: 70-72, D: 60-69, F: below 60

### Step 6: Generate Assignment Descriptions

1. For each unique assignment type in the grading breakdown, write a 3-5 sentence description including:
   - What the assignment involves
   - How it will be evaluated
   - Approximate length or time expectation
   - Reference to the relevant rubric (if available)
2. Cross-reference with case-grader rubric if case analyses are included.

### Step 7: Add Policies

1. **Late Work Policy** — default: 10% per day deduction, max 3 days late, then zero. Customize if professor specifies.
2. **Attendance Policy** — default: more than 3 unexcused absences results in a grade reduction. Customize as needed.
3. **Academic Integrity** — use institutional boilerplate if provided; otherwise use a standard academic honesty statement.
4. **Disability Accommodations** — use institutional boilerplate if provided; otherwise use ADA-compliant standard language.
5. **Technology Policy** — laptop/phone usage expectations during class.

### Step 8: Assemble and Format

1. Combine all sections in the standard order (see Output Format below).
2. Apply consistent heading levels: H1 for course title, H2 for major sections, H3 for subsections.
3. Verify internal consistency: any assignment mentioned in the schedule also appears in the grading breakdown and assignment descriptions.
4. Run a final check for placeholder text or missing values (e.g., "TBD", "TODO").

---

## Output Format

The final syllabus follows this structure:

```
# [COURSE CODE] — [COURSE NAME]
## [Semester Year] | [Meeting Days] [Time] | [Location]

## Instructor Information
- **Instructor:** [Name], [Title]
- **Email:** [Email]
- **Office:** [Location]
- **Office Hours:** [Days/Times]

## Course Description
[2-3 paragraphs]

## Learning Objectives
Upon successful completion of this course, students will be able to:
1. LO1: [Objective]
2. LO2: [Objective]
...

## Required Materials
- [Textbook title, author, edition, ISBN]
- [Case packet or course pack info]
- [Software or access codes]

## Grading Policy
[Breakdown table + grading scale]

## Course Schedule
[Week-by-week table]

## Assignment Descriptions
[Description for each assignment type]

## Course Policies
### Late Work
### Attendance
### Academic Integrity
### Disability Accommodations
### Technology Policy

## University Policies
[Institutional boilerplate]
```

## Output Delivery

- **Markdown** — default output, suitable for CasesIQ canvas editor preview
- **DOCX** — generated via the docx-generator skill when requested; preserves table formatting
- **HTML** — for direct LMS posting; includes inline CSS for consistent rendering

---

## Edge Cases

- **Accelerated courses (8 weeks):** Compress the schedule. Modules may need to be combined. Warn the professor if the roadmap has more modules than available weeks.
- **Summer terms:** Shorter semesters (5-6 or 10-12 weeks) with different holiday calendars. Adjust schedule density accordingly.
- **Courses with labs/recitations:** Add a secondary meeting time row. Lab topics may differ from lecture topics.
- **Cross-listed courses (graduate/undergraduate):** Include a section noting additional requirements for graduate students (longer papers, additional readings, higher grading expectations).
- **Online vs. in-person vs. hybrid:** Adjust meeting time/location fields. Online courses replace "Location" with "Zoom link / LMS module." Hybrid courses list both.
- **No textbook:** Replace Required Materials with "All materials provided via the course LMS" and ensure weekly readings reference specific documents or links.
- **Variable scheduling:** Some courses skip weeks or have irregular patterns. The schedule builder date grid handles this, but validate that no weeks are accidentally dropped.
- **Missing roadmap weeks:** If the roadmap has fewer modules than semester weeks, insert "TBD" weeks and flag them for the professor.
- **Multiple sections:** Same course taught at different times. Reuse the same syllabus body but adjust section number, meeting times, and location.

---

## Integration with Other CasesIQ Skills

| Skill | Integration Point |
|-------|-------------------|
| **course-schedule-builder** | Consumes the date grid JSON to populate the Dates column in the course schedule table. Without it, the syllabus uses generic week numbers. |
| **case-grader** | References the grading rubric for case analysis assignment descriptions. Links the rubric in the Assignment Descriptions section. |
| **quiz-generator** | Quiz schedule and point values feed into the grading breakdown and course schedule (quiz due dates). |
| **docx-generator** | Converts the Markdown syllabus to a formatted DOCX file with proper tables, headers, and page breaks. |
| **roadmap-builder** | Upstream dependency. The roadmap is the primary input to this skill. If no roadmap exists, redirect the user to the roadmap builder first. |
