---
name: batch-grader-orchestrator
description: >
  Orchestrate grading multiple student submissions in sequence through the full CasesIQ
  grading pipeline. Use this skill when a professor needs to grade an entire class of
  submissions at once. Parses shared case context once, then runs the scoring and feedback
  pipeline for each student sequentially. Produces individual feedback documents, a class
  summary report, and a lessons-to-all document. Triggers include requests to grade a batch,
  grade the whole class, process all submissions, run batch grading, grade multiple papers,
  or produce class-wide results. Also trigger when the user says "grade all of these",
  "run the grading pipeline for the class", "process the submission folder", "grade everything
  in this directory", or uploads multiple student files and asks for evaluation.
---
# ©2026 Brad Scheller

# Batch Grader Orchestrator

Orchestrate the full CasesIQ grading pipeline for an entire class of student submissions.
Parses shared context once, grades each submission sequentially, produces individual feedback
documents, and generates class-level summary reports.

## Required Inputs

1. **Student Submissions** — List of file paths to student work (PDF or DOCX), OR a
   directory path containing all submission files
2. **Rubric Definition** — JSON rubric from `rubric-builder` (or path to rubric file)
3. **Case PDF** — The original case study document
4. **Teacher Notes** — Instructor guidance document (PDF or DOCX)
5. **Output Directory** — Where to save all generated files
6. **Best Practice Example** *(optional)* — A high-quality submission for calibration
7. **Course Identifier** *(optional)* — Course code for report headers (e.g., "MGMT 6100")
8. **Assignment Name** *(optional)* — For report titles (e.g., "Case Analysis 3: Acme Corp")

If any required input is missing, ask the user before proceeding. If a directory is provided
for submissions, scan it for all `.pdf` and `.docx` files (excluding the case PDF, teacher
notes, and rubric if they are in the same directory).

## Orchestration Workflow

### Phase 1: Input Validation

Before grading begins, validate every input:

1. **Verify all files exist and are readable**
   - Check each submission file path
   - Check rubric file, case PDF, and teacher notes
   - Report any missing files immediately — do not proceed with partial inputs
2. **Identify submissions**
   - If a directory was provided, list all PDF/DOCX files
   - Exclude known non-submission files (case PDF, teacher notes, rubric, best practice)
   - Extract student names from filenames (expected format: `lastname-firstname-*.*`)
   - If names cannot be parsed from filenames, use the filename as-is
3. **Validate rubric**
   - Parse the rubric JSON and confirm it is well-formed
   - Verify total points sum correctly
4. **Report validation results**
   ```
   BATCH GRADING VALIDATION
   ========================
   Rubric: MGMT 6100 Case Analysis Rubric (100 pts, 18 criteria)
   Case: acme-corp-case.pdf (readable)
   Teacher Notes: acme-corp-teacher-notes.pdf (readable)
   Submissions Found: 25
   Best Practice: smith-jane-case-analysis.docx (optional, loaded)
   Output Directory: /path/to/output/ (writable)

   Ready to proceed? [Y/N]
   ```

### Phase 2: Parse Shared Context (Once)

These parsing steps are shared across ALL submissions and run only once:

1. **Run `case-study-parser`** on the case PDF
   - Extract case facts, exhibits, background data, and key entities
   - Store as shared context object
2. **Run `teacher-notes-parser`** on the teacher notes
   - Extract key issues, expected insights, discussion points, and grading guidance
   - Store as shared context object
3. **Load best practice example** *(if provided)*
   - Parse with `student-submission-parser` for calibration reference
   - Use as a scoring anchor (what "Exceeds Expectations" looks like)

Report completion:
```
Shared context parsed successfully.
- Case context: 15 key facts, 8 exhibits, 4 entities identified
- Teacher notes: 6 key issues, 12 expected insights loaded
- Best practice: loaded for calibration
```

### Phase 3: Sequential Grading Pipeline

Process each submission one at a time. Sequential processing is mandatory to maintain
consistent scoring calibration across students.

For each submission (indexed as `i` of `N`):

#### Step 3a: Parse Submission
Run `student-submission-parser` to extract:
- Document structure (sections, headings, exhibits)
- Student name and metadata
- Full text content per section
- Exhibit identification (by content keywords)

#### Step 3b: Score Submission
Run `rubric-scorer` with:
- Parsed submission (from Step 3a)
- Rubric definition (from Phase 1)
- Teacher notes context (from Phase 2)
- Case context (from Phase 2)

Produces: Per-criterion scores, justifications, detected issues, totals.

#### Step 3c: Generate Feedback Document
Run `feedback-docx-writer` with:
- Scorer output (from Step 3b)
- Rubric definition (from Phase 1)
- Output path (output directory)
- Student name (from Step 3a)

Produces: `.docx` feedback file saved immediately to disk.

#### Step 3d: Log Result
Record the grading result for class-level reporting:
```json
{
  "student_name": "Jane Smith",
  "submission_file": "smith-jane-case-analysis.docx",
  "feedback_file": "smith-jane-feedback.docx",
  "raw_total": 82.4,
  "adjusted_total": 82.4,
  "percentage": 82.4,
  "grade_level_summary": "Meets Expectations",
  "issues_detected": ["personal_opinion"],
  "graded_at": "2026-02-18T14:30:00Z",
  "status": "success"
}
```

#### Step 3e: Report Progress
After each submission, print:
```
Graded 5/25: Jane Smith — 82.4/100 (Meets Expectations)
  Feedback: smith-jane-feedback.docx
  Estimated remaining: ~12 minutes (avg 36s/submission)
```

Update the time estimate after each submission based on the running average.

#### Step 3f: Handle Failures
If any step fails for a submission:
1. Log the error with full details (file path, step that failed, error message)
2. Record the submission as `"status": "error"` in the manifest
3. Print a warning: `WARNING: Failed to grade smith-john-case-analysis.docx — file appears corrupted. Skipping.`
4. Continue with the next submission — do NOT abort the batch

### Phase 4: Generate Class Summary Report

After all submissions are graded, produce a class-level summary document (.docx):

#### 4a. Score Distribution

Create a score distribution section:

| Range | Count | Students |
|-------|-------|----------|
| 90-100 (Exceeds) | 3 | Smith J., Park S., Chen L. |
| 75-89 (Meets) | 12 | Garcia M., Johnson R., ... |
| 60-74 (Attempt) | 7 | Williams T., Brown A., ... |
| 40-59 (Below) | 2 | Davis K., Wilson P. |
| 0-39 (No Attempt) | 1 | Taylor M. |

Include:
- Mean score, median score, standard deviation
- Highest and lowest scores (anonymized or named, per professor preference)

#### 4b. Per-Criterion Class Averages

| Criterion | Class Average | % at Meets or Above |
|-----------|---------------|---------------------|
| Memo Format | 1.8/2 (90%) | 92% |
| Introduction / Key Issues | 5.6/8 (70%) | 64% |
| SWOT Analysis | 6.2/8 (78%) | 76% |
| ... | ... | ... |

Highlight criteria where less than 50% of students scored "Meets Expectations" or above —
these indicate areas needing class-wide instruction.

#### 4c. Common Strengths and Weaknesses

Aggregate from individual feedback:
- **Top 3 class strengths**: Most commonly high-scoring criteria
- **Top 3 class weaknesses**: Most commonly low-scoring criteria
- **Most common issues**: Frequency count of detected issues across all submissions

#### 4d. Students Needing Attention

List students scoring below 60% with their primary weakness areas:
```
STUDENTS NEEDING ATTENTION (below 60%):
- Taylor, Michael — 38/100 — Missing: Analysis, all Framework exhibits
- Davis, Karen — 52/100 — Missing: Decision Matrix, PESTEL, Five Forces
```

Save as: `class-summary-{assignment-slug}.docx`

### Phase 5: Generate Lessons to All Document

Produce a class-wide feedback document (.docx) that can be shared with all students. This
document contains NO individual scores or names.

Structure:
1. **Assignment Overview** — Brief recap of the case and expectations
2. **Class Performance Summary** — Aggregate statistics (mean, distribution) without names
3. **Common Mistakes** — Top 5-8 issues seen across submissions, with anonymized examples
   and the correct approach. Use mandatory feedback phrases where applicable.
4. **Good Practices Observed** — Top 3-5 things the best submissions did well, with
   anonymized examples
5. **Tips for Next Assignment** — 3-5 actionable recommendations based on class-wide patterns

Save as: `lessons-to-all-{assignment-slug}.docx`

### Phase 6: Generate Grading Manifest

Produce a JSON manifest listing all graded submissions:

```json
{
  "batch_id": "uuid",
  "assignment_name": "Case Analysis 3: Acme Corp",
  "course": "MGMT 6100",
  "rubric_name": "MGMT 6100 Case Analysis Rubric",
  "graded_at": "2026-02-18T15:45:00Z",
  "total_submissions": 25,
  "successful": 24,
  "failed": 1,
  "statistics": {
    "mean": 74.2,
    "median": 76.0,
    "std_dev": 12.8,
    "min": 38.0,
    "max": 96.4,
    "score_distribution": {
      "90-100": 3,
      "75-89": 12,
      "60-74": 7,
      "40-59": 2,
      "0-39": 1
    }
  },
  "results": [
    {
      "student_name": "Jane Smith",
      "submission_file": "smith-jane-case-analysis.docx",
      "feedback_file": "smith-jane-feedback.docx",
      "raw_total": 82.4,
      "adjusted_total": 82.4,
      "percentage": 82.4,
      "status": "success"
    },
    {
      "student_name": "John Smith",
      "submission_file": "smith-john-case-analysis.pdf",
      "feedback_file": null,
      "raw_total": null,
      "adjusted_total": null,
      "percentage": null,
      "status": "error",
      "error": "File appears corrupted — unable to extract text"
    }
  ],
  "output_files": {
    "feedback_documents": "/path/to/output/feedback/",
    "class_summary": "/path/to/output/class-summary-acme-corp.docx",
    "lessons_to_all": "/path/to/output/lessons-to-all-acme-corp.docx",
    "manifest": "/path/to/output/grading-manifest-acme-corp.json"
  }
}
```

Save as: `grading-manifest-{assignment-slug}.json`

### Phase 7: Final Report

Print a completion summary:

```
BATCH GRADING COMPLETE
======================
Assignment: Case Analysis 3: Acme Corp
Submissions: 25 total, 24 graded, 1 failed
Time elapsed: 14m 32s (avg 35s/submission)

Class Statistics:
  Mean: 74.2 | Median: 76.0 | Std Dev: 12.8
  Range: 38.0 - 96.4

Output Files:
  Feedback docs (24): /path/to/output/feedback/
  Class summary: /path/to/output/class-summary-acme-corp.docx
  Lessons to All: /path/to/output/lessons-to-all-acme-corp.docx
  Manifest: /path/to/output/grading-manifest-acme-corp.json

Attention needed:
  - Taylor, Michael — 38/100
  - Davis, Karen — 52/100
  - smith-john-case-analysis.pdf — GRADING FAILED (corrupted file)
```

## Concurrency and Performance Rules

1. **Parse case and teacher notes ONCE** — shared context across all submissions.
   Never re-parse for each student.
2. **Grade submissions SEQUENTIALLY** — not in parallel. Sequential processing ensures
   consistent scoring calibration. The scorer may implicitly calibrate based on prior
   submissions' quality range.
3. **Save each feedback document IMMEDIATELY** after generation — do not buffer until
   batch completion. This ensures partial results survive interruptions.
4. **Track timing** — record start/end time per submission to estimate remaining time
   and identify anomalously slow submissions.

## Edge Cases

- **Mixed file formats**: Some submissions may be PDF, others DOCX. The
  `student-submission-parser` handles both formats. If an unsupported format is encountered
  (e.g., `.doc`, `.txt`, `.pages`), log an error and skip.
- **Missing submissions**: If a student is on the class roster but has no file in the
  submissions directory, do not create a feedback document. Note the absence in the manifest
  as `"status": "missing"`.
- **Duplicate submissions**: If multiple files appear to be from the same student (matching
  names or near-identical filenames), warn the professor and grade only the most recent
  (by file modification date). Log the duplicate in the manifest.
- **Very large classes (100+ students)**: No functional limit, but warn the professor about
  estimated time (at ~35 seconds per submission, 100 students takes ~58 minutes). Offer to
  process in batches of 25 with intermediate summaries.
- **Network interruption mid-batch**: Since each feedback doc is saved immediately, already-
  graded submissions are safe. The manifest will reflect only completed grades. On restart,
  check which feedback files already exist and offer to resume from where the batch left off.
- **Student names with special characters**: Preserve original names in documents and manifest.
  Sanitize only for filenames (replace accented characters with ASCII equivalents, remove
  apostrophes, replace spaces with hyphens, lowercase).
- **Empty submissions**: A file that exists but contains no extractable text. Score all
  criteria as "No Attempt" (0 points) and generate a minimal feedback document.
- **Identical submissions**: If two submissions have identical content (potential plagiarism),
  flag both in the manifest with `"flag": "identical_content_detected"` and the other
  student's name. Grade both independently but alert the professor.
- **Rubric changes mid-batch**: Do NOT allow rubric modifications after Phase 2. All
  submissions must be scored against the same rubric for fairness.
- **Output directory permissions**: Verify the output directory is writable before starting
  Phase 3. Create subdirectories as needed (`feedback/`, etc.).

## Integration with Other CasesIQ Skills

| Skill | Relationship |
|-------|-------------|
| `case-study-parser` | **Phase 2** — parses the case PDF once for shared context |
| `teacher-notes-parser` | **Phase 2** — parses teacher notes once for shared context |
| `student-submission-parser` | **Phase 3, Step 3a** — parses each student submission |
| `rubric-builder` | **Phase 1** — provides the rubric definition (created beforehand) |
| `rubric-scorer` | **Phase 3, Step 3b** — scores each submission against the rubric |
| `feedback-docx-writer` | **Phase 3, Step 3c** — generates each student's feedback document |
| `case-grader` | **Peer skill** — handles single-submission grading; this skill handles batch |
| `best-practice-generator` | **Optional Phase 2** — can generate a calibration example if none provided |
| `lessons-learned-generator` | **Phase 5 complement** — the Lessons to All document serves a similar purpose at class scale |
