---
name: phase-6-refinement-specification
description: Phase 6 of the MKT2700 AI-Augmented Product Development Pipeline. Refines the selected concept using SCAMPER method and morphological chart, decomposes into components, then conducts a KANO model interview to classify all features across 5 categories (Must-Be, Performance, Excitement, Indifferent, Reverse). Triggers on "begin phase 6," "refine concept," "SCAMPER," "KANO," "morphological chart," or "specification." Requires evaluation-results.md and research dossier for selected concept.
---

# ©2026 Brad Scheller

# Phase 6: Refinement & Specification

## Purpose

Take the selected concept from Phase 5 and refine it through systematic creativity methods, decompose it into components, and classify all features using the full KANO model. This phase transforms a scored concept into a fully specified product architecture ready for PRD generation.

## Prerequisites

Requires:
- `evaluation-results.md` from Phase 5 (selected concept + its research dossier)
- `evaluation-rubric.md` from Phase 2
- `strategic-brief.md` from Phase 1

## Process

### Behavioral Directive: Propose-and-Refine

**Do NOT ask the team to brainstorm from scratch.** You have the winning concept's research dossier, the evaluation scores (including weak areas), and the strategic context. Use them to drive SCAMPER and KANO proactively.

For every step in this phase:
1. Read the evaluation results — the scores reveal which dimensions need strengthening
2. Propose SCAMPER refinements targeted at the concept's weakest rubric scores
3. Propose KANO classifications based on competitive research and customer evidence from Phase 4
4. Present everything for team validation — they refine your proposals, not generate from scratch

### Part A: SCAMPER Refinement

Review the winning concept's evaluation scores. Identify the 2-3 lowest-scoring rubric criteria. Apply SCAMPER prompts specifically targeted at strengthening those weak areas. Present your SCAMPER proposals with rationale: "Your concept scored lowest on [criterion]. Here's how each SCAMPER prompt could address that gap..."

Apply each SCAMPER prompt to the selected concept. For each, generate 2-3 specific ideas:

**S — Substitute**
"What components, materials, processes, or approaches could be replaced with alternatives?"
- What if we substituted [current approach] with [alternative]?
- What technology could replace the current solution method?

**C — Combine**
"What features, functions, or products could be merged?"
- Could this product combine with [adjacent product] for added value?
- What if we bundled [feature A] with [feature B]?

**A — Adapt**
"What else is like this? What ideas from other industries could be borrowed?"
- How did [other industry] solve a similar problem?
- What existing product could be adapted for this market?

**M — Modify (Magnify/Minimize)**
"What could be made larger, smaller, more frequent, stronger, or weaker?"
- What if we dramatically simplified [complex feature]?
- What if we 10x'd [key value proposition]?

**P — Put to Other Uses**
"How could this be used differently? By different users? In different contexts?"
- What adjacent markets could benefit?
- What other problems does this architecture solve?

**E — Eliminate**
"What could be removed without losing core value?"
- What features do competitors include that customers don't actually need?
- What complexity can be stripped away?

**R — Reverse (Rearrange)**
"What if the order, layout, or sequence were changed?"
- What if customers did [step X] before [step Y]?
- What if the pricing model were inverted?

After generating all SCAMPER ideas, rank them by:
1. Impact on rubric score (would this improve low-scoring criteria?)
2. Feasibility given company capabilities
3. Differentiation from competitors

Select the top improvements to integrate into the refined concept.

### Part B: Morphological Chart (Combination Table)

Decompose the concept into functional components, then explore alternative implementations for each:

```markdown
| Component | Option A | Option B | Option C | Selected |
|-----------|----------|----------|----------|----------|
| User Interface | Mobile app | Web app | CLI tool | [choice] |
| Data Storage | Cloud DB | Local | Hybrid | [choice] |
| Authentication | OAuth | Email/Pass | Biometric | [choice] |
| Core Algorithm | ML-based | Rule-based | Hybrid | [choice] |
| Delivery | SaaS | On-premise | API | [choice] |
| Monetization | Subscription | Freemium | One-time | [choice] |
| ... | ... | ... | ... | ... |
```

For each component:
1. List 2-4 implementation options
2. Evaluate each option against rubric criteria
3. Research how similar products implemented this component
4. Select the best option with justification

The completed chart defines the product architecture.

### Part C: Component Deep Dive

For each selected component implementation:
1. How has this been done in similar products? (cite specific examples)
2. What are the known risks or failure modes?
3. What dependencies does this component have on other components?
4. What would it take to build this? (technology, skills, timeline, cost estimate)

### Part D: KANO Model Feature Classification

Using the research repository's customer evidence and competitive analysis, propose an initial KANO classification for every feature. Present your classification with reasoning: "Based on [evidence], I've classified [feature] as [Must-Be/Performance/Excitement] because [reason]. Do you agree or want to reclassify?"

Conduct a discovery-oriented interview with the team about features and user needs. Then classify across ALL 5 KANO categories.

#### Interview Approach

Do NOT start with "classify these features." Instead, interview to discover:

1. "Thinking about your target user — what would make them furious if the product DIDN'T have it?"
   → These are **Must-Be** candidates

2. "What would make them measurably happier the MORE of it you provide?"
   → These are **Performance** candidates

3. "What would genuinely surprise and delight them — something they wouldn't expect?"
   → These are **Excitement** candidates

4. "What features might your competitors include that your target users genuinely don't care about?"
   → These are **Indifferent** candidates

5. "What features, if included, would actually turn users OFF or make the product worse for them?"
   → These are **Reverse** candidates

After discovering features through conversation, propose classifications and let the team adjust:

```markdown
### KANO Feature Classification

#### Must-Be (Expected — absence causes dissatisfaction, presence doesn't increase satisfaction)
| Feature | Justification | Implementation Priority |
|---------|--------------|----------------------|
| [feature] | Users expect this as baseline | Critical — build first |
| ... | | |

#### Performance (Linear — more is better, directly proportional to satisfaction)
| Feature | Metric | Target Level | Implementation Priority |
|---------|--------|-------------|----------------------|
| [feature] | [speed/quality/quantity] | [target] | High |
| ... | | | |

#### Excitement (Delighters — unexpected features that create disproportionate satisfaction)
| Feature | Why It Delights | Implementation Priority |
|---------|----------------|----------------------|
| [feature] | [explanation] | Medium — after Must-Be |
| ... | | |

#### Indifferent (Users don't care either way — do NOT build these)
| Feature | Why Indifferent | Decision |
|---------|----------------|----------|
| [feature] | [explanation] | Cut from scope |
| ... | | |

#### Reverse (Would hurt satisfaction if included)
| Feature | Why Harmful | Decision |
|---------|------------|----------|
| [feature] | [explanation] | Explicitly exclude |
| ... | | |
```

#### Build Priority Framework
Based on KANO classification:
1. **Must-Be features** → Build ALL of these first. No exceptions.
2. **Performance features** → Build the highest-impact ones next.
3. **Excitement features** → Include 1-2 for differentiation.
4. **Indifferent features** → Cut from scope entirely.
5. **Reverse features** → Explicitly exclude and document why.

## LLM Council Checkpoint: KANO Validation

This phase includes an LLM Council checkpoint. See `llm-council-protocol.md` for the full protocol.

**Checkpoint:** KANO Validation
**When to run:** After Claude classifies all features into KANO categories, before finalizing.
**Command:**
```bash
python scripts/llm_council.py --checkpoint kano \
  --input refined-concept.md \
  --persona target-user-persona.md
```
**Note:** Before running, create `target-user-persona.md` by extracting your target user description from Phase 4's research repository (customer profile, demographics, behaviors, needs). The `--input` is your full refined concept with KANO-classified features.
**What happens next:** Paste `council-kano.md` into Claude and say: "Here is Gemini's independent KANO classification. Run the LLM Council reconciliation protocol."

**Critical:** Must-Be vs. Performance disagreements are high-stakes — they change what goes in the MVP. These MUST be resolved through cross-examination, not left as "Low confidence."

## Output: Refined Concept Artifact

Save as `refined-concept.md`:

```markdown
# Refined Concept: [Concept Name]

## Concept Summary
[2-3 paragraph description of the refined concept]

## SCAMPER Improvements Applied
| Method | Idea | Impact | Integrated? |
|--------|------|--------|------------|
| Substitute | [idea] | [impact] | ✅/❌ |
| ... | | | |

## Product Architecture (Morphological Chart)
| Component | Selected Implementation | Justification |
|-----------|----------------------|---------------|
| [component] | [selection] | [why] |
| ... | | |

## Component Specifications
### [Component 1]
- Implementation: [details]
- Precedent: [how similar products did this]
- Risks: [known risks]
- Dependencies: [other components needed]
- Build estimate: [time/cost/skills]
...

## KANO Feature Classification
### Must-Be Features
[table]
### Performance Features
[table]
### Excitement Features
[table]
### Indifferent (Excluded)
[table]
### Reverse (Explicitly Excluded)
[table]

## Build Priority Sequence
1. [Must-Be features — build first]
2. [Performance features — build next]
3. [Excitement features — include for differentiation]

## Updated Rubric Score
[Re-score the concept after refinements to show improvement]
Previous Score: [X]% → Refined Score: [Y]%
```

## Handoff

1. Save the refined concept artifact.
2. Verify KANO classification covers all features in all 5 categories.
3. Instruct: "Phase 6 complete. Open a new chat and say 'Begin Phase 7 — PRD Generation.' Bring ALL artifacts: Strategic Brief, Rubric, Research Repository, Evaluation Results, and Refined Concept."
