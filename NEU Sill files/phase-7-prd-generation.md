---
name: phase-7-prd-generation
description: Phase 7 of the MKT2700 AI-Augmented Product Development Pipeline. Generates a comprehensive, evidence-based Product Requirements Document (PRD) from all prior phase artifacts. 10 sections in logical narrative flow, with evaluation evidence woven throughout. Produces MKT2700-branded Word/PDF and Markdown outputs. Triggers on "begin phase 7," "generate PRD," "product requirements document," or "create PRD." Requires all prior phase artifacts.
---

# ©2026 Brad Scheller

# Phase 7: PRD Generation

## Purpose

Synthesize all artifacts from Phases 1-6 into a professional, evidence-based Product Requirements Document. The PRD is the team's final deliverable — a forward-looking document that justifies the selected concept with hard evidence and provides a detailed implementation plan.

## Prerequisites

Requires ALL prior artifacts:
- `strategic-brief.md` (Phase 1)
- `evaluation-rubric.md` (Phase 2)
- `concept-candidates.md` (Phase 3)
- `research-repository.md` (Phase 4)
- `evaluation-results.md` (Phase 5)
- `refined-concept.md` (Phase 6)

If any artifact is missing, stop and instruct the student to complete the prior phase first.

## Behavioral Directive: Draft-First

**Generate the full PRD draft without waiting for input.** You have all 6 prior artifacts. The team's role at this stage is editorial review, not content generation.

Process:
1. Read all 6 prior artifacts completely
2. Draft all 10 PRD sections in one pass, pulling evidence and citations from the research repository
3. Present the complete draft to the team
4. Iterate based on their feedback — but deliver a complete first draft before asking any questions

Do NOT ask the team section-by-section what to include. The artifacts already contain everything needed. Write the PRD, then refine.

## PRD Section Order (Logical Flow)

The document follows a narrative arc: what's the problem → who has it → why we're positioned to solve it → what the solution is → how we'll build it → what could go wrong → how we'll measure success → what's the plan.

---

### Section 1: Executive Summary

**Source artifacts:** All phases (synthesis)

Content:
- Product name and one-line description
- Concept overview: what it is, who it's for, why it matters
- Strategic rationale: why THIS product for THIS company (from Phase 1 + Phase 5 rubric score)
- Target market summary with key market size figure
- Final evaluation score and how many concepts were considered (e.g., "Selected from 30+ evaluated concepts with a reconciled rubric score of 97.2%")
- 3-5 key success metrics (previewing Section 9)

**Evaluation evidence woven in:** Final reconciled rubric score, number of concepts evaluated, selection methodology (Claude + Gemini + LLM Council).

**Citation minimum:** 3+ sources supporting market opportunity claims.

---

### Section 2: Problem Statement

**Source artifacts:** Phase 3 (discovery evidence), Phase 4 (research dossiers)

Content:
- Detailed problem description grounded in evidence, not assumptions
- Customer pain points with direct evidence (quotes, survey data, engagement metrics from Reddit/YouTube/X/Skool discovery)
- Current solutions and their specific limitations (competitor weaknesses from Phase 4)
- Market size: TAM, SAM, SOM with sourced data from at least 2 independent sources
- Market trends supporting this opportunity (from PESTEL technological + social factors)
- Evidence of demand intensity: how many sources independently confirmed this pain point

**Citation minimum:** 5+ unique, credible sources from Phase 4 research. Market size data from 2+ independent sources.

---

### Section 3: Strategic Context

**Source artifacts:** Phase 1 (strategic brief)

Content:
- Company situation summary (condensed from Phase 1 interview)
- PESTEL highlights — only the 2-3 most impactful macro forces
- Porter's Five Forces summary — competitive intensity assessment
- SWOT matrix (full table from Phase 1)
- VRIO analysis — which resources create sustainable advantage
- Competitive positioning map and Blue Ocean disruption opportunity
- Why this product was selected over alternatives (reference evaluation methodology without a full evidence section)

**Evaluation evidence woven in:** Brief mention of multi-model evaluation process and how strategic fit scored on the rubric.

**Citation minimum:** 2+ sources for competitive landscape claims.

---

### Section 4: Target Users

**Source artifacts:** Phase 4 (customer validation research), Phase 6 (KANO interview insights)

Content:
- Primary user persona: demographics, behaviors, goals, frustrations, technology comfort
- Secondary user persona(s) if applicable
- Needs hierarchy derived from KANO interview (what they expect vs. what delights them)
- User journey map: current state (with pain points) vs. desired state (with product)
- Jobs-to-be-done framework: functional, emotional, and social jobs
- Evidence of persona accuracy: quotes, survey data, behavioral data from research

**Citation minimum:** 3+ sources backing persona characteristics. At least 2 direct customer quotes or behavioral data points.

---

### Section 5: Product Vision

**Source artifacts:** Phase 5 (selected concept rationale), Phase 6 (SCAMPER refinements)

Content:
- Product vision statement (1-2 sentences — aspirational but specific)
- How the concept directly addresses the opportunity identified in Problem Statement
- Core value proposition: what's different, what's better, why customers switch
- SCAMPER improvements applied (from Phase 6) and how they strengthened the concept
- In-scope vs. out-of-scope boundary (from KANO: Indifferent and Reverse features are explicitly out of scope, with justification)

**Citation minimum:** None required — this section is synthesis, not evidence.

---

### Section 6: Feature Specifications (KANO-Classified)

**Source artifacts:** Phase 6 (KANO classification + morphological chart)

Present features organized by KANO category with full specifications:

**Must-Be Features (P0 — MVP Requirements)**
| Feature | Description | Acceptance Criteria | Source Evidence |
|---------|-------------|-------------------|----------------|
| [feature] | [detail] | [specific, testable criteria] | [Phase 4 research reference] |

**Performance Features (P1)**
| Feature | Description | Metric | Target Level | Source Evidence |
|---------|-------------|--------|-------------|----------------|
| [feature] | [detail] | [what to measure] | [specific target] | [reference] |

**Excitement Features (P2 — Differentiators)**
| Feature | Description | Expected Impact | Differentiation Value |
|---------|-------------|----------------|----------------------|
| [feature] | [detail] | [user delight factor] | [why competitors don't have this] |

**Explicitly Excluded (KANO Indifferent + Reverse)**
| Feature | Category | Reason for Exclusion |
|---------|----------|---------------------|
| [feature] | Indifferent / Reverse | [evidence-based justification] |

**Citation minimum:** Each Must-Be and Performance feature must reference at least 1 source from Phase 4 research or Phase 6 KANO interviews confirming demand.

---

### Section 7: Architecture Overview

**Source artifacts:** Phase 6 (morphological chart + component deep dive)

Content:
- System architecture overview: components and how they interact (diagram description or table)
- Morphological chart selections with justification for each component choice
- Technology stack: specific technologies/frameworks selected and why
- Integration points and external dependencies
- Data model overview (if applicable)
- Component specifications from Phase 6 deep dive:
  - Implementation approach
  - Precedent (how similar products built this)
  - Dependencies on other components
  - Build complexity rating (Low/Medium/High)

**Citation minimum:** 2+ precedent references (how other products implemented similar architectures).

---

### Section 8: Risks & Mitigations

**Source artifacts:** All phases (synthesis)

Content:
- Risk assessment table covering all major categories:

| Risk | Category | Likelihood | Impact | Source | Mitigation Strategy |
|------|----------|-----------|--------|--------|-------------------|
| [risk] | Technical / Market / Execution / Financial | H/M/L | H/M/L | [which phase revealed this] | [specific action] |

Risk categories:
- **Technical risks:** From Phase 6 component analysis (build complexity, unproven tech choices)
- **Market risks:** From Phase 4 competitive analysis (competitor response, market timing)
- **Execution risks:** From Phase 1 self-assessment (team capability gaps, resource constraints)
- **Financial risks:** From Phase 1 resource constraints + Phase 6 build estimates

**Evaluation evidence woven in:** Flag criteria where Claude and Gemini disagreed by 2+ points in Phase 5 — these represent areas of genuine uncertainty that become risks.

**Citation minimum:** Each market and competitive risk must reference a specific Phase 4 research finding.

---

### Section 9: Success Metrics

**Source artifacts:** Phase 2 (rubric criteria), Phase 4 (market research), Phase 6 (KANO + specs)

Content:
- Metrics tied directly to rubric criteria — show how each high-weight criterion maps to a measurable KPI
- Organized by time horizon:

**Launch Metrics (Day 1-30)**
| KPI | Target | Measurement Method | Rubric Criterion |
|-----|--------|-------------------|-----------------|
| [metric] | [specific number] | [how to measure] | [which rubric criterion this validates] |

**Growth Metrics (Month 2-6)**
| KPI | Target | Measurement Method | Rubric Criterion |
|-----|--------|-------------------|-----------------|

**Scale Metrics (Month 6-12)**
| KPI | Target | Measurement Method | Rubric Criterion |
|-----|--------|-------------------|-----------------|

- Unit economics: customer acquisition cost, lifetime value, payback period (estimates with assumptions stated)
- Customer satisfaction targets: NPS or CSAT goals tied to KANO Must-Be and Performance feature delivery

**Citation minimum:** Market benchmarks for targets must reference 2+ sources (e.g., "Industry average NPS for SaaS products is 36 [source]").

---

### Section 10: Implementation Roadmap

**Source artifacts:** Phase 1 (resources/constraints), Phase 6 (component specs + build estimates)

Content:
- **Phase 1: MVP (Must-Be features)**
  - Sprint-by-sprint or week-by-week breakdown
  - Specific resource assignments (who builds what, based on team skills from Phase 1)
  - Dependencies between components (from morphological chart)
  - Milestone: MVP feature-complete date
  - Estimated cost for this phase

- **Phase 2: Performance Features**
  - Sprint/week breakdown
  - Resource assignments
  - Dependencies on MVP components
  - Milestone: V1 launch date
  - Estimated cost

- **Phase 3: Excitement Features + Scale**
  - Sprint/week breakdown
  - Resource assignments (may include new hires or partners)
  - Milestone: V2 / growth phase
  - Estimated cost

- **Resource allocation table:**
| Resource | Phase 1 (MVP) | Phase 2 (V1) | Phase 3 (V2) |
|----------|--------------|-------------|-------------|
| [role/person] | [allocation %] | [allocation %] | [allocation %] |

- **Critical path:** Which components/features block others? What's the longest dependency chain?
- **Total estimated timeline:** Start to MVP, MVP to V1, V1 to V2
- **Total estimated budget:** Broken down by phase with assumptions

**Citation minimum:** None required — this is planning, not evidence. But resource constraints must align with Phase 1 self-assessment.

---

## Generation Process

1. **Load all 6 prior artifacts** into context. If running in Claude.ai, ask the student to paste each one. If running in Claude Code, read them from the project directory.
2. **Generate the complete PRD** in one pass across all 10 sections. Do NOT stop between sections for review — produce the full draft.
3. **Run the quality checklist** (below) against the draft.
4. **Present the complete draft** to the student for review.
5. **Iterate** based on feedback until the student approves.
6. **Generate outputs:**
   - Save `product-requirements-document.md` (Markdown version)
   - Generate `product-requirements-document.docx` (branded Word version)

## Citation Minimums Summary

| Section | Minimum Sources |
|---------|----------------|
| 1. Executive Summary | 3 |
| 2. Problem Statement | 5 (+ 2 independent for market size) |
| 3. Strategic Context | 2 |
| 4. Target Users | 3 (+ 2 direct quotes) |
| 5. Product Vision | 0 (synthesis) |
| 6. Feature Specifications | 1 per Must-Be and Performance feature |
| 7. Architecture Overview | 2 precedent references |
| 8. Risks & Mitigations | 1 per market/competitive risk |
| 9. Success Metrics | 2 benchmark sources |
| 10. Implementation Roadmap | 0 (planning) |

**Total minimum across document: ~25+ unique cited sources**

## Quality Checklist

Before finalizing, verify:
- [ ] All 10 sections complete and substantive
- [ ] Citation minimums met for each section
- [ ] Evaluation evidence woven into Sections 1, 3, and 8 (not a standalone section)
- [ ] KANO classifications consistent between Phase 6 artifact and Section 6
- [ ] Implementation Roadmap has specific sprint/week estimates, not just "Phase 1, Phase 2"
- [ ] Resource assignments reference actual team capabilities from Phase 1
- [ ] Risks include Phase 5 model disagreement areas
- [ ] Success metrics explicitly link KPIs to rubric criteria
- [ ] All market claims have source citations
- [ ] Indifferent and Reverse features are explicitly listed as out-of-scope with justification
- [ ] Total word count is 3,000-6,000 words (comprehensive but not padded)

## LLM Council Checkpoint: PRD Review

This phase includes an LLM Council checkpoint. See `llm-council-protocol.md` for the full protocol.

**Checkpoint:** PRD Review
**When to run:** After the complete PRD draft is generated, before final formatting and submission.
**Command:**
```bash
python scripts/llm_council.py --checkpoint prd-review \
  --input product-requirements-document.md
```
**What happens next:** Paste `council-prd-review.md` into Claude and say: "Here is Gemini's independent PRD review. Run the LLM Council reconciliation protocol." Address all Critical issues before submission. Minor issues should be fixed if time allows.

**Rule:** Any section flagged by EITHER model (Claude or Gemini) gets reviewed. Better to over-flag than miss an issue the grader will find.

## Word Document Generation (MKT2700 Branded)

### Brand Constants

```javascript
// MKT2700 Colors
const NAVY = "1B365D";
const GOLD = "C4A35A";
const CREAM = "F5F3EE";
const WHITE = "FFFFFF";
const GRAY = "5A5A5A";
const DARK_NAVY = "0F1F38";
const LIGHT_GOLD = "F5F0E4";

// Typography
const HEADER_FONT = "Georgia";
const BODY_FONT = "Arial";

// Footer
const FOOTER = "MKT2700 Product Design & Development • Northeastern University • Spring 2026";
```

### Document Formatting

- **Cover page:** Navy background, product name in white Georgia 36pt, team name in gold Georgia 24pt, gold accent bar, course info in white Arial 11pt
- **Section headings (H1):** Georgia 24pt, navy (#1B365D), gold underline bar
- **Sub-headings (H2):** Georgia 18pt, navy
- **Body text:** Arial 11pt, dark gray (#5A5A5A), 1.15 line spacing
- **Tables:** Navy header row with white text, alternating cream/white row backgrounds, 0.5pt gray borders
- **Page margins:** 1 inch all sides
- **Page numbers:** Bottom right, Arial 9pt, gray
- **Footer:** Course info on every page, Arial 9pt, gray
- **Table of Contents:** Auto-generated after cover page
- **Citations:** Inline as numbered references [1], [2], etc. with a References section at the end

### Generation Method

If running in Claude.ai:
1. Generate the complete PRD as a markdown artifact
2. Copy the markdown into Google Docs or Microsoft Word
3. Apply MKT2700 brand styling (colors, fonts, headers per the Brand Constants above)
4. Export as .docx or .pdf

If running in Claude Code:
1. Generate the Markdown version first
2. Use pandoc or python-docx to convert to branded .docx
3. Apply styling via template or programmatic formatting

## Final Deliverable Checklist

Before submission, the team should have:
- [ ] `product-requirements-document.md` (Markdown for build phase)
- [ ] `product-requirements-document.docx` or `.pdf` (branded for submission)
- [ ] `strategic-brief.md` (Phase 1)
- [ ] `evaluation-rubric.md` (Phase 2)
- [ ] `concept-candidates.md` showing 30+ concepts (Phase 3)
- [ ] `research-repository.md` (Phase 4)
- [ ] `evaluation-results.md` with multi-model scores (Phase 5)
- [ ] `refined-concept.md` with KANO classification (Phase 6)
- [ ] Progress Tracker showing all phases complete
- [ ] `council-rubric.md` (Phase 2 LLM Council output)
- [ ] `council-scoring.md` (Phase 5 LLM Council output)
- [ ] `council-kano.md` (Phase 6 LLM Council output)
- [ ] `council-prd-review.md` (Phase 7 LLM Council output)

**Due: Sunday, February 15, 2026 (extended deadline: Tuesday, February 17, no penalty)**

## Handoff

After generating and reviewing the PRD:
1. Save both output formats.
2. Run the quality checklist — flag any failures.
3. Instruct: "Your PRD is complete. Review each section carefully before submission. Check that all cited sources are accurate and all market claims are supported. Submit both the .docx/.pdf and .md versions along with all Phase 1-6 artifacts by February 15."
