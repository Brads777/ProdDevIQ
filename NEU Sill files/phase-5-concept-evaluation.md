---
name: phase-5-concept-evaluation
description: Phase 5 of the MKT2700 AI-Augmented Product Development Pipeline. Evaluates concept candidates against the weighted rubric using a multi-model approach — Claude scores first, then Gemini scores independently, then an LLM Council compares and reconciles results. Applies decision thresholds (kill <90%, revise 90-95%, continue >95%). Triggers on "begin phase 5," "evaluate concepts," "concept evaluation," or "score concepts." Requires rubric and research repository as inputs.
---
# ©2026 Brad Scheller

# Phase 5: Concept Evaluation

## Purpose

Rigorously evaluate all researched concepts against the locked rubric using a multi-model approach to reduce single-model bias. Produce final scores with improvement recommendations for concepts in the revise band.

## Prerequisites

Requires:
- `evaluation-rubric.md` from Phase 2 (LOCKED — no changes permitted)
- `research-repository.md` from Phase 4
- `strategic-brief.md` from Phase 1

## Process

### Behavioral Directive: Propose-and-Refine

**Score proactively.** You have the locked rubric, the research evidence, and the strategic context. Do not ask the team how to score — score every concept yourself, present the full results, and ask the team to challenge any scores they disagree with.

For this phase:
1. Read all prior artifacts
2. Score every concept against every criterion with evidence-based justifications
3. Present the complete scorecard and rankings
4. Invite the team to challenge specific scores — but do the work first

### Step 1: Claude Evaluation (Primary)

Immediately score all concepts. Do not ask the team to help score or to walk through criteria one by one. Read the research repository, apply the rubric, and present the complete evaluation for all concepts at once. The team's role is to validate and challenge, not to co-score.

For each concept, score against every rubric criterion:

1. Apply must-have constraints first. If any constraint fails → KILL immediately.
2. For each criterion in the rubric:
   - Review the research evidence for this concept + criterion
   - Assign a score (0-4) based on the level definitions in the rubric
   - Provide a 1-2 sentence justification citing specific evidence
3. Calculate weighted score:
   ```
   Concept Score = Σ(score_i × weight_i) ÷ Σ(4 × weight_i) × 100%
   ```
4. Apply decision threshold:
   - < 90% → KILL
   - 90-95% → REVISE
   - > 95% → CONTINUE

Present results as a structured scorecard:

```markdown
### Concept: [Name]
**Must-Have Constraints:** ✅ All passed / ❌ Failed: [which one]

| # | Criterion | Weight | Score | Weighted | Justification |
|---|-----------|--------|-------|----------|---------------|
| 1 | [name] | [w] | [0-4] | [s×w] | [evidence-based reason] |
| ... | | | | | |
| **TOTAL** | | **[Σw]** | | **[Σs×w]** | |

**Final Score: [X]% ([Σs×w] / [Σ4×w] × 100)**
**Decision: KILL / REVISE / CONTINUE**
```

### Step 2: Gemini Evaluation (Independent — via API)

**Prerequisite:** Students must obtain a free API key from [Google AI Studio](https://aistudio.google.com/apikey). See the Deployment Guide for setup instructions.

Use the Gemini API to run an independent evaluation of each concept. This ensures the second evaluation is truly independent — no shared context with Claude.

```python
# Requires: pip install google-genai
from google import genai
import os

# Configure client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def evaluate_concept_gemini(rubric_text, concept_name, research_dossier):
    """Evaluate a single concept against the rubric using Gemini."""
    prompt = f"""You are an independent evaluator for a product development project.
Score the following concept against every criterion in the rubric on a 0-4 scale.

RUBRIC (with scoring level definitions):
{rubric_text}

CONCEPT: {concept_name}
RESEARCH EVIDENCE:
{research_dossier}

For EACH criterion, provide:
1. Score (0-4) based on the level definitions in the rubric
2. One-sentence justification citing specific evidence
3. Confidence level (High/Medium/Low)
4. Any evidence gaps that affect your scoring

Then calculate the final weighted score as:
Σ(score × weight) ÷ Σ(4 × weight) × 100%

Format as a markdown scorecard table."""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text

# Run evaluation for each surviving concept
rubric = open("evaluation-rubric.md").read()
research = open("research-repository.md").read()

# Evaluate each concept (extract concept sections from research repository)
result = evaluate_concept_gemini(rubric, "Concept Name", research)
print(result)
```

**Setup checklist:**
- [ ] API key obtained from [Google AI Studio](https://aistudio.google.com/apikey) (free tier)
- [ ] Environment variable set: `export GEMINI_API_KEY="your-key-here"`
- [ ] Python package installed: `pip install google-genai`
- [ ] Test connection: run the verification script from the Deployment Guide

**For Claude Code users:** This evaluation can be delegated as a sub-agent task, running Gemini evaluation in parallel across all concepts.

**Fallback (if API issues):** If the API is unavailable, students may paste the evaluation prompt directly into [Google AI Studio](https://aistudio.google.com/) as a manual alternative.

## LLM Council Checkpoint: Concept Scoring

> **Note:** The `llm_council.py` script automates the Step 2 Gemini evaluation above. Use the script instead of writing custom code — it handles the API call, prompt formatting, and output file generation for you.

This phase uses the LLM Council for scoring reconciliation. See `llm-council-protocol.md` for the full protocol.

**Checkpoint:** Concept Scoring
**When to run:** After Claude completes Step 1 scoring for each concept.
**Command (per concept):**
```bash
python scripts/llm_council.py --checkpoint scoring \
  --input research-repository.md \
  --rubric evaluation-rubric.md \
  --concept "Concept Name"
```
**What happens next:** Paste each `council-scoring.md` into Claude and say: "Here is Gemini's independent scoring for [Concept Name]. Run the LLM Council reconciliation protocol." The reconciled scores become the official evaluation used in Steps 4-5.

### Step 3: LLM Council Reconciliation

The LLM Council is a structured debate between AI models to resolve scoring disagreements. For the complete LLM Council protocol including the Python helper script, see `llm-council-protocol.md`. Here's how to run it:

**3a. Score Comparison Matrix**

Create a side-by-side comparison table for each concept:

```markdown
| Criterion | Claude Score | Gemini Score | Delta | Agreement? |
|-----------|--------------|--------------|-------|------------|
| [name] | [0-4] | [0-4] | [diff] | Agree / Diverge |
| ... | | | | |
```

Mark as "Agree" if within 1 point, "Diverge" if 2+ points apart.

**3b. Divergence Resolution (for each criterion with 2+ point gap)**

**Method 1 — Cross-Examination (Claude.ai / Claude Code):**

1. Present Claude with Gemini's position:
   ```
   Gemini scored [criterion] at [score] because: "[Gemini's justification]"
   Your score was [score] because: "[Claude's justification]"

   Review both positions and the underlying evidence. Provide a reconciled score
   with reasoning that addresses both perspectives.
   ```

2. Then do the reverse in Gemini — present Claude's position and ask for reconciliation.

3. If the models converge to within 1 point, use the average (rounded to nearest integer).

**Method 2 — Third-Model Tiebreak:**

If Claude and Gemini can't converge after cross-examination, use a third model (Perplexity, or a fresh Claude/Gemini session with no prior context) as a blind evaluator:

```
Score this product concept criterion on a 0-4 scale based solely on the evidence provided.

CRITERION DEFINITION:
[paste rubric criterion with level definitions]

EVIDENCE:
[paste relevant research evidence]

Provide:
1. Score (0-4)
2. Justification citing specific evidence
3. Confidence level (High/Medium/Low)
```

Give the third model ONLY the rubric criterion definition and evidence — do NOT reveal the other models' scores.

**3c. Final Reconciled Score**

For each criterion, apply this logic:

- **Agreed criteria (within 1 point):** Use the average, rounded to nearest integer
- **Resolved divergences (cross-examination):** Use the reconciled score from the model that updated its position
- **Unresolved divergences (tiebreak needed):** Use the third-model score and FLAG this criterion as a risk item for Section 8 (Risks & Mitigations) of the PRD in Phase 7

**3d. Confidence Assessment**

Rate each criterion's final score confidence:

- **High:** Both models agreed within 1 point initially
- **Medium:** Models diverged but reconciled through cross-examination
- **Low:** Required third-model tiebreak — this represents genuine uncertainty about the evidence

Include confidence ratings in the final scorecard:

```markdown
| # | Criterion | Weight | Final Score | Weighted | Confidence | Notes |
|---|-----------|--------|-------------|----------|------------|-------|
| 1 | [name] | [w] | [0-4] | [s×w] | High/Medium/Low | [reconciliation method] |
```

The final reconciled score becomes the official evaluation.

### Step 4: Improvement Analysis (Revise Band)

For concepts scoring 90-95% (REVISE band):

1. Identify the 3-5 criteria with the lowest scores relative to their weights
2. For each, calculate: "If this criterion improved by 1 point, the overall score would increase by X%"
3. Rank improvement opportunities by score impact
4. Provide specific, actionable suggestions for how to improve each criterion

```markdown
### Improvement Roadmap: [Concept Name]
Current Score: [X]%

| Priority | Criterion | Current | Target | Score Impact | Suggested Improvement |
|----------|-----------|---------|--------|-------------|----------------------|
| 1 | [name] | 2 | 3 | +2.3% | [specific action] |
| 2 | [name] | 1 | 3 | +1.8% | [specific action] |
| ... | | | | | |

**Projected Score if All Improvements Made: [Y]%**
```

### Step 5: Final Rankings

Produce the final ranked list:

```markdown
## Final Evaluation Results

### CONTINUE (>95%)
1. [Concept] — [Score]% ✅
2. ...

### REVISE (90-95%)
3. [Concept] — [Score]% ⚠️ (see improvement roadmap)
4. ...

### KILL (<90%)
5. [Concept] — [Score]% ❌
6. ...

### Recommendation
Based on evaluation, the team should advance [Concept X] as the primary concept
and consider [Concept Y] as an alternative if improvements are made.
```

## Output: Evaluation Results Artifact

Save as `evaluation-results.md`:

```markdown
# Concept Evaluation Results: [Company Name]

## Evaluation Summary
- Concepts evaluated: [N]
- CONTINUE (>95%): [N]
- REVISE (90-95%): [N]
- KILL (<90%): [N]

## Detailed Scorecards
[Full scorecards for each concept — Claude, Gemini, and reconciled]

## Model Agreement Analysis
[Summary of where Claude and Gemini agreed/diverged]

## Improvement Roadmaps
[For each REVISE-band concept]

## Final Rankings
[Ordered list with decisions]

## Selected Concept for Phase 6: [Name]
Justification: [why this concept advances]
```

## Handoff

1. Save the evaluation results artifact.
2. Confirm the team's selected concept (should be highest-scoring CONTINUE concept).
3. Instruct: "Open a new chat and say 'Begin Phase 6 — Refinement.' Bring your evaluation results and the research dossier for your selected concept."
