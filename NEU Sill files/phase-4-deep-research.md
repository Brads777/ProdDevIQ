---
name: phase-4-deep-research
description: Phase 4 of the MKT2700 AI-Augmented Product Development Pipeline. Orchestrates deep research using NotebookLM Deep Research and Perplexity Pro in parallel. Generates research questions, manages follow-up chains, and builds a comprehensive research repository for each concept. Supports NotebookLM MCP Server for automation. Triggers on "begin phase 4," "deep research," "research concepts," or "start research." Requires concept-candidates.md from Phase 3.
---
# ©2026 Brad Scheller

# Phase 4: Deep Research

## Purpose

Conduct deep, structured research on each surviving concept candidate using NotebookLM Deep Research and Perplexity Pro in parallel. Build a comprehensive evidence base for rubric evaluation in Phase 5.

## Prerequisites

Requires:
- `concept-candidates.md` from Phase 3
- `evaluation-rubric.md` from Phase 2 (to align research with rubric criteria)
- `strategic-brief.md` from Phase 1

## Tool Setup

### NotebookLM
- The team's Discovery Notebook (created in Phase 3) serves as the master source reference
- Create separate per-concept research notebooks for each Tier 1 concept (top 10)
- Manually add relevant sources from the Discovery Notebook into each concept-specific notebook
- Create shared notebooks for Tier 2 concepts (group by theme)

### NotebookLM MCP Server (Optional — Claude Code only)
If using Claude Code with MCP:
```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "npx",
      "args": ["notebooklm-mcp@latest"]
    }
  }
}
```
Uses [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp). Requires Chrome and a one-time Google login. Install with: `claude mcp add notebooklm npx notebooklm-mcp@latest`

This enables automated notebook creation and source management.

### Perplexity Pro
- Use the Pro tier for deep research with source citations
- Run queries in parallel with NotebookLM

## Process

### Behavioral Directive: Propose-and-Refine

**Do NOT ask the team what to research.** You have the concept candidates ranked from Phase 3, the rubric criteria from Phase 2, and the strategic context from Phase 1. Use them.

For every step in this phase:
1. Read the prior artifacts — they tell you which concepts to prioritize and what criteria to research against
2. Propose research questions, priorities, and notebook structures
3. Present your research plan and let the team adjust — don't wait for them to tell you what to investigate

### Step 1: Generate Research Questions per Concept

For each Tier 1 concept from Phase 3, auto-generate research questions mapped to every rubric criterion from Phase 2. Present the full research plan to the team: "Here are the research questions I'll investigate for each concept, organized by rubric criteria. Adjust if needed, then I'll begin."

For each concept, generate questions mapped to rubric criteria:

**Market Validation Questions:**
- "What is the total addressable market for [concept]?"
- "Who are the current competitors in [concept space] and what are their weaknesses?"
- "What pricing models exist for similar products?"

**Technical Feasibility Questions:**
- "What technologies are required to build [concept]?"
- "What are the main technical challenges in implementing [concept]?"
- "Are there open-source frameworks or APIs that could accelerate development?"

**Customer Validation Questions:**
- "What evidence exists that customers would pay for [concept]?"
- "What are the primary objections or barriers to adoption?"
- "How do customers currently solve this problem (workarounds)?"

**Strategic Alignment Questions:**
- "How does [concept] align with [company's] core competencies?"
- "What resources would be needed beyond what the company currently has?"
- "What partnerships or acquisitions might be needed?"

Generate 8-12 questions per Tier 1 concept, 4-6 per Tier 2 concept.

### Step 2: Deploy Research Queries

**NotebookLM Deep Research Track:**
For each concept notebook:
1. Add initial sources (URLs from Phase 3 discovery)
2. Run Deep Research with the generated questions
3. **CRITICAL: Follow EVERY suggested follow-up question.** NotebookLM's follow-ups often surface the deepest insights.
4. Save all Deep Research responses as new sources in the notebook
5. Repeat follow-up chain until no new questions are suggested

**Perplexity Pro Track (parallel):**
1. Run the same core questions in Perplexity Pro
2. Follow every suggested follow-up question
3. Save full Perplexity chat threads
4. Load Perplexity results into NotebookLM as sources (copy-paste or save as PDF and upload)

### Step 3: Cross-Reference & Consolidate

After both tracks complete for each concept:

1. Compare NotebookLM and Perplexity findings for consistency
2. Flag contradictions or conflicting data
3. Identify strongest evidence (cited sources, data points, expert quotes)
4. Map findings to specific rubric criteria
5. Note gaps where evidence is insufficient for scoring

### Step 4: Research Quality Check

For each concept, verify:
- [ ] At least 5 unique, credible sources cited
- [ ] Market size data from at least 2 independent sources
- [ ] Competitor analysis covers at least 3 competitors
- [ ] Customer evidence includes direct quotes or survey data
- [ ] Technical feasibility assessed with specific technology stack
- [ ] All NotebookLM follow-up questions were pursued
- [ ] All Perplexity follow-up questions were pursued

## Output: Research Repository Artifact

Save as `research-repository.md`:

```markdown
# Research Repository: [Company Name]

## Research Summary
- Concepts researched (Tier 1): [N]
- Concepts researched (Tier 2): [N]
- Total sources collected: [N]
- NotebookLM notebooks created: [N]

## Concept Research Dossiers

### Concept 1: [Name]

#### Market Evidence
- TAM/SAM/SOM: [data with sources]
- Growth rate: [data]
- Customer willingness to pay: [evidence]

#### Competitive Landscape
- Competitor 1: [name] — Strengths: [X], Weaknesses: [Y]
- Competitor 2: ...
- Key gap: [what no competitor does well]

#### Technical Assessment
- Required stack: [technologies]
- Build complexity: [Low/Medium/High]
- Key technical risks: [list]

#### Customer Validation
- Pain point intensity: [evidence]
- Current workarounds: [what people do now]
- Switching barriers: [what would prevent adoption]

#### Rubric Criteria Mapping
| Criterion | Preliminary Score (0-4) | Evidence Summary |
|-----------|------------------------|------------------|
| [criterion 1] | [score] | [brief evidence] |
| ... | ... | ... |

#### Research Gaps
- [What couldn't be determined and why]

#### Sources
1. [Source with URL]
2. ...

---
[Repeat for each concept]
```

## Handoff

1. Save the research repository artifact.
2. Verify all research quality checks pass.
3. Instruct: "Phase 4 complete. You now have deep research on all concepts. Open a new chat and say 'Begin Phase 5 — Concept Evaluation.' Bring your rubric, research repository, and progress tracker."
4. Remind: "Phase 5 will use both Claude AND Gemini to evaluate concepts independently, then an LLM Council to compare results."
