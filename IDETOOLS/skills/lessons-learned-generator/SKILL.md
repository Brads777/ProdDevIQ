---
name: lessons-learned-generator
description: Generate comprehensive lessons learned documents from business case studies for student career preparation. Use this skill when a professor needs to create educational takeaways, key insights, career lessons, or transferable skills from a case study. Works with or without teacher notes. Triggers include requests for lessons learned, key takeaways, educational insights, career lessons, or study guides from business cases.
---

# Lessons Learned Generator

Create educational documents that help students connect case insights to future careers. Output is 400 words or less.

## Workflow

1. **Read case materials**: Load case PDF and teacher notes (if available)
2. **Identify themes**: Extract 5-7 key strategic/business themes
3. **Prioritize lessons**: Rank by career applicability and teaching value
4. **Generate document**: Create structured lessons with career applications

## Output Format

```markdown
# Key Lessons Learned from [Case Name]: A Guide for Future Business Leaders

[1-2 sentence introduction explaining case value]

## Lesson #1: [Title - Most Important Lesson]

**Core Insight:** [2-3 sentences explaining the business principle]

**Career Value:** [2-3 sentences explaining how this applies to student careers]

## Lesson #2: [Title]
[Same format]

## Lesson #3: [Title]
[Same format]

[Continue for 5-7 lessons, ordered by significance]

## Conclusion
[2-3 sentences summarizing transferable skills]
```

## Lesson Categories to Consider

| Category | Example Topics |
|----------|---------------|
| Strategic Positioning | Value chain positioning, vertical integration |
| Operational Excellence | Process optimization, quality management |
| Growth Strategy | Market expansion, geographic diversification |
| Financial Management | Capital allocation, risk management |
| Leadership | Change management, stakeholder alignment |
| Industry Analysis | Competitive dynamics, market forces |
| Sustainability | Environmental, social, governance factors |

## Extraction Guidelines

**From Teacher Notes (if available):**
- Teaching objectives
- Discussion questions (convert to lessons)
- Key decision points
- Common student mistakes to address

**From Case Content:**
- Central strategic dilemma
- Industry-specific insights
- Decision frameworks used
- Outcomes and consequences

## Writing Style

- Use active voice
- Write short, direct sentences
- Focus on actionable career advice
- Avoid academic jargon
- Make lessons memorable and specific

## Quality Checklist

- [ ] 400 words or less total
- [ ] 5-7 distinct lessons
- [ ] Each lesson has Core Insight + Career Value
- [ ] Lessons ordered by significance
- [ ] No case-specific details that won't transfer
- [ ] Conclusion ties to career preparation

## Output

Save as: `[CaseName]_Lessons_Learned.docx` or `.md`
