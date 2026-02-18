---
name: research-pipeline
description: >-
  6-phase structured research framework for product, academic, market, or
  technology research. Use when the user wants to research a topic, validate
  an idea, or conduct landscape analysis. Do NOT use for quick lookups.
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch
context: fork
---
# ©2026 Brad Scheller

# Research Pipeline

A structured 6-phase research framework that guides any research inquiry through systematic validation. Adaptable for product research, academic studies, market analysis, policy evaluation, and scientific investigation.

## Quick Start

When the user provides a research topic:

1. Create a research folder for the inquiry
2. Run through applicable validation phases sequentially
3. Conduct web searches for relevant data and prior work
4. Document findings at each phase
5. Generate the final research document

### Trigger

The user says something like:
- "Research this topic: [question or idea]"
- "Validate this idea: [description]"
- "Conduct landscape analysis on [topic]"

## Research Phases

### Phase 1: Problem/Question Definition

**Objective:** Clearly articulate the problem, question, or need the research addresses.

**Actions:**
- Clarify the core question or problem being investigated
- Identify the target audience, stakeholders, or affected population
- Search for evidence that this question/problem is significant
- Assess scope and boundaries of the inquiry

**Pass if:** Clear question defined, significance established, scope is manageable.
**Fail if:** Problem is hypothetical with no evidence, too vague, or already solved.

See `references/01-problem-definition.md` for the full template and criteria.

### Phase 2: Landscape Analysis

**Objective:** Research and analyze all current knowledge, solutions, or approaches.

**Actions:**
- Search for existing work, solutions, or prior research
- Analyze current approaches and their strengths/weaknesses
- Document the state of knowledge in this area
- Identify gaps, contradictions, or unexplored territory

**Pass if:** Landscape is understood, gaps or opportunities identified, direction is justified.
**Fail if:** No existing work found, or existing approaches fully address the problem.

See `references/02-landscape-analysis.md` for the full template and criteria.

### Phase 3: Feasibility Assessment

**Objective:** Assess whether the proposed approach is viable.

**Actions:**
- Identify required resources, methods, or capabilities
- Assess availability and maturity of needed approaches
- Outline high-level methodology or approach
- Identify risks and constraints

**Pass if:** Approach is viable, resources are available, risks are manageable.
**Fail if:** Requires capabilities that don't exist or unrealistic resources.

See `references/03-feasibility.md` for the full template and criteria.

### Phase 4: Differentiation/Contribution Analysis

**Objective:** Define the unique contribution or value of this research.

**Actions:**
- Define the unique contribution or value
- Compare against existing work or alternatives
- Identify what makes this approach distinctive
- Clarify who benefits and how

**Pass if:** Clear contribution articulated, differentiation established.
**Fail if:** Differentiation is vague or doesn't matter to the audience.

See `references/04-differentiation.md` for the full template and criteria.

### Phase 5: Implementation/Methodology Path

**Objective:** Define a concrete path from idea to execution.

**Actions:**
- Define initial scope or minimum viable approach
- Outline execution phases or methodology steps
- Estimate resource and time requirements
- Plan validation or evaluation strategy

**Pass if:** Path forward is clear, scope is achievable, validation defined.
**Fail if:** Scope too large, no way to validate, critical risks unmitigated.

See `references/05-implementation.md` for the full template and criteria.

### Phase 6: Synthesis

**Objective:** Compile all findings into a comprehensive, actionable document.

**Actions:**
- Compile all findings into final document
- Summarize key insights and conclusions
- Provide actionable recommendations or next steps
- Document sources and methodology

**Output:** Complete research document.

See `references/06-synthesis.md` for the full template and document structure.

## Phase Customization

This is a framework, not a rigid process. Adapt phases to your domain:

- **Rename phases** to match domain terminology (e.g., "Literature Review" instead of "Landscape Analysis")
- **Skip Phase 4** for exploratory research without a specific solution
- **Merge Phases 2 and 3** when landscape analysis naturally includes feasibility
- **Skip Phase 5** for pure research inquiries without implementation
- **Start at Phase 2** if the problem is already well-established
- **Insert additional phases** where needed (Ethics Review, Regulatory Analysis, Pilot Study Design)

## Handling Phase Failures

If any phase reveals critical problems:

1. Stop and explain the issue
2. Document the finding in the phase file
3. Provide options:
   - **Refine:** Adjust the research question or approach and retry
   - **Pivot:** Explore a related but different direction
   - **Conclude:** Accept findings as the research outcome (negative results are still results)

## Domain Adaptation Examples

| Domain | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|--------|---------|---------|---------|---------|---------|---------|
| Product/Startup | Problem validation | Competitive analysis | Technical feasibility | Value proposition | MVP planning | Investment summary |
| Academic | Research question | Literature review | Methodological feasibility | Field contribution | Research design | Research proposal |
| Market Research | Market question | Industry landscape | Data availability | Strategic insights | Execution plan | Intelligence report |
| Policy | Policy problem | Policy landscape | Implementation feasibility | Policy innovation | Implementation roadmap | Policy brief |
| Scientific | Hypothesis | Prior research | Experimental feasibility | Scientific contribution | Experimental design | Research summary |

## Research Principles

1. **Evidence-Based:** Every claim backed by research, data, or clear reasoning
2. **Honest Assessment:** Document weaknesses and limitations, not just strengths
3. **Specific Focus:** Research the concrete topic, not generic concepts
4. **Critical Analysis:** Challenge assumptions, find gaps, stress-test conclusions
5. **Actionable Output:** Final document provides clear insights and next steps

## Commands

- `"Research this topic: [description]"` — Start full research process
- `"Continue research on [topic]"` — Resume incomplete research
- `"Re-run phase [N] for [topic]"` — Redo a specific phase
- `"Show research status"` — List all research projects and their current phase
