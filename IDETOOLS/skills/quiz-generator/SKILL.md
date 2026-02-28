---
name: quiz-generator
description: >
  Generate quiz questions from case study materials, course content, and learning objectives.
  Supports multiple question types (multiple choice, true/false, short answer, fill-in-blank,
  matching, essay) with configurable difficulty levels and Bloom's taxonomy targeting. Use this
  skill when a professor needs to create quiz questions, build an exam, generate a question bank,
  make a test, or produce assessment items from course materials. Triggers include requests to
  "generate quiz questions", "create a quiz", "build a question bank", "make test questions",
  "generate exam questions", "create assessment questions from this case", "quiz me on chapter 3",
  or any request involving automated question generation from source material. Also triggers when
  a user uploads a case PDF, lecture slides, or teacher notes and asks for questions to be
  generated from them.
---
# ©2026 Brad Scheller

# Quiz Generator

Generate quiz questions from case study materials, course content, and learning objectives.
Supports multiple question types, configurable difficulty levels, Bloom's taxonomy targeting,
and quality validation. Outputs structured JSON for LMS import and Markdown for professor review.

## Required Inputs

1. **Source Material** — at least one of:
   - Case PDF (the case study document)
   - Teacher Notes PDF (instructor guidance with key insights and analysis)
   - Lecture slides (via pptx-reader skill)
   - Specific topic text or chapter content
2. **Question Count** — total number of questions to generate
3. **Question Types** — which types to include and in what proportion (see Question Type Specifications below)
4. **Learning Objectives** — the specific LOs this quiz should assess (referenced by ID, e.g., LO3, LO5)

If any of inputs 1-4 are missing, ask the user before proceeding.

### Optional Inputs

5. **Difficulty Distribution** — percentage split across easy/medium/hard (default: 30% easy, 50% medium, 20% hard)
6. **Bloom's Taxonomy Targets** — which cognitive levels to assess (default: mix of Apply, Analyze, Evaluate)
7. **Topic Focus** — specific chapters, concepts, or case issues to emphasize
8. **Time Limit** — affects question complexity (5-minute pop quiz vs. 30-minute assessment vs. 60-minute midterm)
9. **Point Values** — per-question or per-type point allocation (default: auto-calculated from total points)
10. **Excluded Topics** — concepts or sections to deliberately avoid (e.g., "skip Chapter 7, we haven't covered it yet")

## Question Type Specifications

### Multiple Choice (MC)

- 4 answer options labeled A through D.
- Exactly one correct answer clearly marked.
- **Distractor quality is critical:** each incorrect option must be plausible and represent a common misconception or partial understanding. Never use obviously wrong answers as filler.
- Avoid "All of the above" and "None of the above" — these reduce assessment validity.
- Avoid negative phrasing ("Which of the following is NOT...") unless testing a specific critical-thinking objective.
- Include a **rationale** for the correct answer (visible to the professor only, hidden from students). The rationale should explain why the correct answer is right AND why each distractor is wrong.
- Stem (question text) should be a complete question or statement, not a sentence fragment.

### True/False (TF)

- A clear declarative statement that is definitively true or false.
- Include an **explanation** for the correct answer.
- Avoid double negatives ("It is not true that X is not Y").
- Maintain approximately 50/50 true/false split across all TF questions in the quiz.
- Avoid trivially obvious statements — the statement should require understanding the material.

### Short Answer (SA)

- A clear question expecting a 2-3 sentence response.
- Include a **model answer** that demonstrates what a full-credit response looks like.
- Include a **grading rubric** listing 3-5 key points to look for, each worth partial credit.
- Specify the approximate word count expectation (e.g., "Answer in 50-75 words").

### Fill-in-the-Blank (FIB)

- A complete sentence with one key term or concept removed and replaced with a blank.
- The removed term should be a vocabulary word, framework name, or specific concept — not a generic word.
- Include the **correct answer** and a list of **acceptable synonyms** (e.g., "competitive advantage" also accepts "sustainable competitive advantage").
- Provide surrounding context so the blank is unambiguous.

### Matching (MATCH)

- Left column: 6-10 items (terms, concepts, names).
- Right column: definitions, descriptions, or associations.
- Include 1-2 **extra distractors** in the right column to prevent elimination by process of exclusion.
- Items in the right column should be similar in length and structure to avoid visual hints.
- Randomize the order of both columns.

### Essay (ESSAY)

- An open-ended prompt requiring critical thinking, synthesis, or application.
- Include a **model answer outline** (not a full essay, but the key arguments and structure).
- Include a **grading rubric** with point allocation by concept:
  - Identification of key issues (X points)
  - Application of relevant frameworks (X points)
  - Quality of analysis and reasoning (X points)
  - Writing clarity and organization (X points)
- Specify expected length (e.g., "500-750 words" or "2-3 paragraphs").

## Question Generation Workflow

### Step 1: Analyze Source Material

1. Read all provided source documents.
2. Extract key concepts, facts, frameworks, definitions, and analytical conclusions.
3. Map extracted content to the specified learning objectives. If a learning objective has no supporting content in the source material, warn the professor: "LO[X] cannot be assessed — no relevant content found in the provided materials."
4. Identify the Bloom's taxonomy level naturally suited to each concept:
   - **Remember:** definitions, dates, names, facts
   - **Understand:** explanations, summaries, comparisons
   - **Apply:** using frameworks on new scenarios, calculations
   - **Analyze:** breaking down arguments, identifying causes, comparing alternatives
   - **Evaluate:** judging effectiveness, recommending courses of action
   - **Create:** synthesizing new solutions, designing strategies

### Step 2: Plan Question Distribution

1. Calculate the target count for each question type based on the requested proportions.
2. Calculate the target count for each difficulty level based on the requested distribution.
3. Map learning objectives to questions — every specified LO must be assessed by at least one question.
4. Map Bloom's levels to question types:
   - MC and TF naturally test Remember, Understand, Apply
   - SA and FIB naturally test Understand, Apply
   - MATCH naturally tests Remember, Understand
   - ESSAY naturally tests Analyze, Evaluate, Create
5. If the requested Bloom's levels and question types conflict (e.g., "all multiple choice but target Create level"), warn the professor and suggest adjustments.

### Step 3: Generate Questions

For each planned question:

1. Select the relevant source content segment.
2. Draft the question at the target difficulty and Bloom's level.
3. For MC questions, generate the correct answer first, then craft three plausible distractors.
4. Write the rationale/explanation.
5. Tag the question with its metadata: type, difficulty, Bloom's level, learning objective, source reference.

### Step 4: Quality Validation

Run the following checks on the complete question set:

1. **No duplicate questions** — no two questions should test the same fact in the same way. Similar questions testing the same concept from different angles are acceptable.
2. **Answer distribution for MC** — correct answers should be roughly evenly distributed across A, B, C, D (within +/- 1 of perfect distribution for sets of 8+ MC questions).
3. **Difficulty distribution** — verify the actual easy/medium/hard split matches the requested percentages (within +/- 10%).
4. **Learning objective coverage** — every specified LO is assessed by at least one question. Flag any LOs with only one question (single point of failure for assessment).
5. **Source material fidelity** — no question requires information not present in the provided source material. This is critical: if a question references a fact, that fact must appear in the source documents.
6. **Answer key completeness** — every question has a marked correct answer, rationale, and point value.
7. **TF balance** — true/false questions are approximately 50/50 (within +/- 1 for sets of 6+ TF questions).
8. **Reading level** — question stems should be clear and unambiguous. Flag any question with a stem longer than 50 words for professor review.

### Step 5: Format Output

Generate both JSON (for LMS import) and Markdown (for professor review/editing).

---

## Output Format

### JSON (for LMS Import)

```json
{
  "quizTitle": "Week 3 Quiz: Industry Analysis",
  "courseCode": "MGT 6100",
  "timeLimit": 15,
  "totalPoints": 20,
  "questionCount": 10,
  "difficultyDistribution": {"easy": 3, "medium": 5, "hard": 2},
  "bloomsDistribution": {"Apply": 4, "Analyze": 4, "Evaluate": 2},
  "questions": [
    {
      "number": 1,
      "type": "multiple_choice",
      "difficulty": "medium",
      "bloomsLevel": "Apply",
      "points": 2,
      "learningObjective": "LO3",
      "sourceReference": "Case: Southwest Airlines, pp. 4-6",
      "stem": "Based on the Southwest Airlines case, which of Porter's Five Forces poses the greatest threat to the company's competitive advantage?",
      "options": [
        {"label": "A", "text": "Threat of new entrants", "correct": false},
        {"label": "B", "text": "Bargaining power of suppliers", "correct": true},
        {"label": "C", "text": "Threat of substitutes", "correct": false},
        {"label": "D", "text": "Bargaining power of buyers", "correct": false}
      ],
      "rationale": "Southwest's fleet is 100% Boeing 737, creating extreme dependence on a single aircraft supplier. This gives Boeing significant leverage in negotiations. (A) is incorrect because airline industry barriers to entry are high (capital, slots, regulation). (C) is incorrect because substitutes like driving or rail only compete on short routes. (D) is incorrect because individual buyers have minimal power given the commodity nature of air travel.",
      "tags": ["porters-five-forces", "supplier-power", "competitive-analysis"]
    },
    {
      "number": 2,
      "type": "true_false",
      "difficulty": "easy",
      "bloomsLevel": "Understand",
      "points": 1,
      "learningObjective": "LO2",
      "sourceReference": "Textbook Ch. 3, p. 78",
      "stem": "A firm operating in an industry with high barriers to entry and low supplier power is likely to earn above-average returns.",
      "correctAnswer": true,
      "explanation": "High barriers to entry protect incumbents from new competition, and low supplier power means input costs are manageable. Together, these conditions favor profitability according to the Five Forces framework.",
      "tags": ["industry-analysis", "profitability"]
    },
    {
      "number": 3,
      "type": "short_answer",
      "difficulty": "hard",
      "bloomsLevel": "Evaluate",
      "points": 4,
      "learningObjective": "LO5",
      "sourceReference": "Case: Southwest Airlines, pp. 8-12",
      "stem": "Evaluate whether Southwest Airlines' decision to maintain a single aircraft type (Boeing 737) strengthens or weakens their competitive position. Justify your answer with evidence from the case.",
      "modelAnswer": "The single-type fleet is a double-edged sword. It strengthens Southwest's position through lower maintenance costs, simplified training, and operational flexibility (crew interchangeability). However, it weakens their position by creating supplier dependency on Boeing and limiting route options to 737-compatible distances. On balance, the operational efficiencies outweigh the supplier risk because Southwest has negotiated favorable long-term contracts.",
      "rubric": [
        {"criterion": "Identifies both strengths and weaknesses", "points": 1},
        {"criterion": "Cites specific evidence from the case", "points": 1},
        {"criterion": "Reaches a reasoned conclusion", "points": 1},
        {"criterion": "Demonstrates understanding of competitive strategy concepts", "points": 1}
      ],
      "expectedLength": "75-100 words",
      "tags": ["competitive-advantage", "operations-strategy", "evaluation"]
    }
  ]
}
```

### Markdown (for Professor Review)

```markdown
# Week 3 Quiz: Industry Analysis
**Course:** MGT 6100 | **Time Limit:** 15 minutes | **Total Points:** 20

---

**Q1.** (MC, 2 pts, Medium, LO3)
Based on the Southwest Airlines case, which of Porter's Five Forces poses the greatest
threat to the company's competitive advantage?

A. Threat of new entrants
B. **Bargaining power of suppliers** <<<
C. Threat of substitutes
D. Bargaining power of buyers

> *Rationale:* Southwest's fleet is 100% Boeing 737, creating extreme dependence on a
> single aircraft supplier...

---

**Q2.** (TF, 1 pt, Easy, LO2)
A firm operating in an industry with high barriers to entry and low supplier power is
likely to earn above-average returns.

**Answer:** True

> *Explanation:* High barriers to entry protect incumbents from new competition...

---

**Q3.** (SA, 4 pts, Hard, LO5)
Evaluate whether Southwest Airlines' decision to maintain a single aircraft type
strengthens or weakens their competitive position. Justify your answer with evidence
from the case. *(75-100 words)*

> *Model Answer:* The single-type fleet is a double-edged sword...
> *Rubric:* Strengths + weaknesses (1pt), Case evidence (1pt), Reasoned conclusion (1pt),
> Strategy concepts (1pt)
```

---

## Question Bank Mode

When generating large sets (20+ questions), operate in **question bank mode**:

1. Generate more questions than needed (1.5x the requested count).
2. Run quality validation on the full set.
3. Rank questions by quality: clarity of stem, distractor plausibility, alignment with LO and Bloom's level.
4. Select the top N questions (where N is the requested count) while maintaining the distribution targets.
5. Store the surplus questions as alternates — useful for makeup quizzes or future semesters.
6. Tag each question with a unique ID for tracking across quiz versions.

---

## Edge Cases

- **Quantitative cases requiring calculations:** Generate questions that include numerical data and require students to compute ratios, margins, break-even points, or NPV. Provide the expected calculation steps in the rationale. Include the formula in the model answer.
- **Cases with ambiguous "right answers":** Some case analyses have multiple defensible positions. For MC questions, avoid these topics — use them for essay or short-answer questions instead, where the rubric evaluates reasoning quality rather than a single correct answer.
- **No teacher notes provided:** The skill can still generate questions from the case PDF alone, but quality will be lower. Warn the professor: "Without teacher notes, questions will focus on factual recall rather than analytical depth. Provide TN for higher-quality assessment items."
- **Large question banks (50+ questions):** Use question bank mode. Chunk the source material into sections and generate questions per section to ensure coverage breadth. Track which sections have been covered to avoid clustering.
- **Questions spanning multiple cases:** When a quiz covers material from two or more cases, generate questions for each case proportionally to its weight in the course. Include 1-2 cross-case comparison questions (typically essay or short answer) that test synthesis.
- **Regeneration requests:** If the professor rejects specific questions and asks for replacements, generate new questions that cover the same LO and difficulty level without duplicating the rejected stems. Track rejected questions to avoid regenerating similar ones.
- **Time limit constraints:** For a 5-minute pop quiz, limit to 5 MC/TF questions. For a 30-minute quiz, allow a mix of 10-15 questions. For a 60-minute midterm, support 25-40 questions including short answer and essay. Warn if the question count is unrealistic for the time limit (rule of thumb: 1-2 minutes per MC/TF, 3-5 minutes per SA/FIB, 5-8 minutes per MATCH, 15-20 minutes per essay).
- **Accessibility requirements:** Ensure question stems are screen-reader compatible. Avoid questions that depend on visual formatting (e.g., "refer to the diagram below"). If a diagram is necessary, provide alt-text and a textual description.
- **Multi-language courses:** If the course is taught in a language other than English, generate questions in the course language. Maintain all metadata and rubric notes in the same language.

---

## Integration with Other CasesIQ Skills

| Skill | Integration Point |
|-------|-------------------|
| **syllabus-generator** | Quiz schedule and point values appear in the syllabus grading breakdown and course schedule (quiz due dates per week). |
| **course-schedule-builder** | Quiz dates are resolved to actual calendar dates using the date grid. "Quiz on Week 5" becomes "Quiz due Wednesday, February 12, 2026." |
| **case-grader** | The case-grader rubric informs which frameworks and concepts are most important for a given case — the quiz-generator prioritizes questions on those topics. Teacher notes used by case-grader are also primary source material for quiz generation. |
| **pptx-reader** | Reads lecture slide content as source material for question generation. Extracts key points, diagrams (via alt-text), and speaker notes. |
| **docx-generator** | Exports the quiz as a formatted DOCX file (printable exam format) with answer key as a separate document. |
| **roadmap-builder** | The roadmap defines which learning objectives exist and which weeks they map to — this ensures quizzes are aligned with the course progression. |
