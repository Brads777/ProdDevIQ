---
name: best-practice-generator
description: Generate exemplary case analysis documents that serve as grading benchmarks for business school case studies. Use this skill when a professor needs to create a model answer, best practice example, or A-grade reference analysis for a case study. Triggers include requests for best practice analysis, model answer, exemplary submission, grading benchmark, or A-grade example for any business case.
---

# Best Practice Case Analysis Generator

Generate comprehensive, A-grade case analysis documents following the standard memo format with all required analytical frameworks.

## Workflow

1. **Read case materials**: Load case PDF and teacher notes PDF
2. **Extract key elements**: Identify protagonist, central problem, management questions, and required goals from teacher notes
3. **Define decision criteria**: Derive weighted criteria from stated goals
4. **Analyze alternatives**: Evaluate all viable options using frameworks
5. **Generate document**: Create complete memo with all exhibits

## Required Document Structure

### Memo Header (Always Include)
```
[Case Name]
TO:     [Protagonist Name and Title]
FROM:   Strategic Management Consultant
DATE:   [Current Date]
SUBJECT: [Specific Topic from Case]
CC:     [Other Key Stakeholders]
```

**CRITICAL**: Always include FROM line.

### Section Order
1. Key Issues/Introduction
2. Recommendations (bullet points only, no rationale)
3. Decision Criteria (with weights linked to goals)
4. Analysis (discuss all alternatives for all issues)
5. Conclusion
6. Exhibits (A through I/J as applicable)

## Required Exhibits (All Need Impact Summaries)

| Exhibit | Content | Required |
|---------|---------|----------|
| A | Guiding Questions with Responses | Yes |
| B | Key Issues and Management Questions | Yes |
| C | Decision Criteria and Weights Table | Yes |
| D | Decision Matrix (weighted scoring) | Yes |
| E | Pros and Cons List | Yes |
| F | SWOT Analysis | Yes |
| G | PESTEL Analysis | Yes |
| H | Five Forces Analysis | Yes |
| I | VRIO Analysis | If strategy course |
| J | CLV Analysis | If customer segment data available |

## Impact Summary Format

End each exhibit with:
> **Impact Summary—[Exhibit Name]**: [2-3 sentences connecting findings to recommendations]

## Critical Rules

**DO:**
- Link decision criteria directly to goals stated in Introduction
- Use weighted scoring in decision matrices
- Discuss ALL viable alternatives in Analysis section
- Include specific case data and quantification
- Write in active voice with short sentences

**DO NOT:**
- Include rationale in Recommendations section
- Repeat case background management already knows
- Use "I believe," "I think," or "in my opinion"
- Recommend "further study"
- Add cover page

## Output

See references/template.md for detailed section formatting.
Save as: `[CaseName]_Best_Practice_Analysis.docx`
