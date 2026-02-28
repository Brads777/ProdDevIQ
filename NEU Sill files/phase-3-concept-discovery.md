---
name: phase-3-concept-discovery
description: Phase 3 of the MKT2700 AI-Augmented Product Development Pipeline. Conducts RAG-based concept discovery across YouTube, Reddit, X, and Skool communities using Claude web search, plus generates parallel query sets for Gemini Deep Research and Perplexity Pro. Ranks up to 40 concept candidates. Triggers on "begin phase 3," "concept discovery," "find concepts," or "RAG search." Requires Phase 1 Strategic Brief and Phase 2 Rubric as inputs.
---

# ©2026 Brad Scheller

# Phase 3: Concept Discovery

## Purpose

Discover up to 40 product concept candidates by mining social platforms, industry sources, and community discussions for underserved pain points and opportunities aligned with the team's strategic situation.

## Prerequisites

Requires:
- `strategic-brief.md` from Phase 1
- `evaluation-rubric.md` from Phase 2

## Process

### Behavioral Directive: Propose-and-Refine

**Do NOT re-ask questions that Phase 1 already answered.** The Strategic Brief contains the team's industry, capabilities, constraints, competitive analysis, and strategic direction. Use it.

For every step in this phase:
1. Read the relevant prior artifact(s)
2. Propose outputs based on what you already know
3. Present proposals with your reasoning
4. Ask the team to validate, adjust, or fill gaps — not to start from scratch

### Step 1: Generate Search Strategy

**Before generating searches, review the Strategic Brief for identified pain points, competitive gaps, and market opportunities.** Propose an initial batch of 8-10 concept seeds derived directly from Phase 1 findings:
- Gaps in competitor coverage (from Porter's Five Forces and competitive analysis)
- Unaddressed PESTEL forces (regulatory gaps, technological shifts, social trends)
- VRIO-based advantages (unique capabilities your team can leverage)
- SWOT-identified opportunities (market openings already flagged)

**Present these concept seeds to the team for validation, then expand discovery through platform research.**

Using the Strategic Brief and rubric criteria, create a targeted search plan:

1. **Pain point queries** — What problems are people complaining about in this space?
2. **Trend queries** — What emerging needs are being discussed?
3. **Gap queries** — Where are existing solutions failing?
4. **Innovation queries** — What creative solutions are people hacking together?
5. **Adjacent market queries** — What solutions from related industries could transfer?

For each query category, generate 5-8 specific search strings optimized for each platform.

### Step 2: Platform-Specific Discovery

#### YouTube
Search for: complaint videos, review videos with negative feedback, "I wish..." comments, tutorial videos where users describe workarounds, industry analysis channels.

Use web search to find relevant YouTube content. Extract:
- Pain points mentioned in titles and descriptions
- High-engagement complaint themes
- DIY solutions people are building

#### Reddit
Search subreddits relevant to the industry. Look for:
- "What's your biggest frustration with..." posts
- Feature request threads
- Comparison discussions where all options fall short
- "I switched from X because..." posts

#### X (Twitter)
Search for:
- Industry hashtags + complaint keywords
- Viral threads about product failures
- Customer service complaint patterns
- "Someone should build..." tweets

#### Skool Communities
Search for:
- Community discussions about unmet needs
- Course creators discussing market gaps
- Engagement-heavy posts about pain points

### Step 3: Generate Parallel Research Queries

Create formatted query sets for the team to run in parallel tools:

**For Gemini Deep Research (via AI Studio):**
```
Query 1: "What are the top 10 underserved customer needs in [industry] as of 2025-2026?"
Query 2: "What product categories in [industry] have the highest customer dissatisfaction?"
Query 3: "What emerging technologies could disrupt [specific market segment]?"
Query 4: [3-5 more queries tailored to strategic brief findings]
```

**For Perplexity Pro:**
```
Query 1: "What are the most-discussed pain points in [industry] forums and communities?"
Query 2: "What failed products in [industry] had the right idea but wrong execution?"
Query 3: "What are customers in [market segment] willing to pay more for?"
Query 4: [3-5 more tailored queries]
```

Instruct students: "Run ALL of these queries. Follow EVERY follow-up question that Perplexity and Gemini suggest. The follow-up questions often surface the most valuable insights."

### Step 4: Synthesize & Rank Candidates

As results come in from all sources, compile into concept candidates. For each concept:

```markdown
### Concept [N]: [Name]
- **Source:** [YouTube / Reddit / X / Skool / Gemini / Perplexity]
- **Pain Point:** [What problem does this solve?]
- **Evidence of Demand:** [Links, engagement metrics, quote snippets]
- **Preliminary Fit:** [Quick assessment against top 3 rubric criteria]
- **Uniqueness:** [How different from existing solutions?]
- **Initial Viability:** [High / Medium / Low based on strategic brief]
```

Rank all candidates by:
1. Evidence of demand (volume + intensity of pain)
2. Strategic fit (alignment with company capabilities from Phase 1)
3. Competitive gap (how underserved is this currently?)

### Step 5: Initial Filtering

Apply must-have constraints from the rubric as a first pass:
- Remove any concept that fails a must-have constraint
- Flag concepts that are borderline on constraints

Target: 30-40 surviving concepts for Phase 4 deep research.

### Step 6: Create Discovery Notebook

Create a NotebookLM "Discovery Notebook" for the project:

1. **Load ALL discovery sources** found during Steps 2-4:
   - YouTube videos (complaint videos, reviews, tutorials)
   - Reddit threads (frustration posts, feature requests, comparisons)
   - X posts (complaint patterns, viral threads, "someone should build" tweets)
   - Skool community discussions
   - Research reports from Gemini Deep Research
   - Perplexity Pro findings

2. **Organize by concept tier** using notebook sections or tags:
   - Tier 1 sources (top 10 concepts)
   - Tier 2 sources (concepts 11-25)
   - Tier 3 sources (concepts 26-40)

3. **Make it the master reference** for Phase 4 deep research — all source material in one place

4. **If using Claude Code with NotebookLM MCP**, sources can be added automatically via the MCP server

This Discovery Notebook becomes your central knowledge base for all subsequent research phases.

## Output: Concept Candidates Artifact

Save as `concept-candidates.md`:

```markdown
# Concept Candidates: [Company Name]

## Discovery Summary
- Total concepts identified: [N]
- Concepts passing must-have constraints: [N]
- Sources: YouTube ([N]), Reddit ([N]), X ([N]), Skool ([N]), Gemini ([N]), Perplexity ([N])

## Ranked Concept Candidates

### Tier 1: High Priority (top 10)
[Detailed entries with full evidence]

### Tier 2: Medium Priority (11-25)
[Entries with key evidence]

### Tier 3: Lower Priority (26-40)
[Brief entries]

## Eliminated Concepts
[Concepts that failed must-have constraints, with reason]

## Search Queries Used
[Full list of queries by platform for documentation]

## Parallel Research Status
- [ ] Gemini Deep Research queries completed
- [ ] Perplexity Pro queries completed
- [ ] All follow-up questions pursued
- [ ] Results integrated into candidate list
- [ ] Discovery Notebook created with all sources loaded
```

## Handoff

1. Save the artifact.
2. Instruct: "Before moving to Phase 4, make sure ALL Gemini and Perplexity queries are complete and follow-up questions answered. Then open a new chat and say 'Begin Phase 4.'"
3. Remind: "Your Discovery Notebook is already set up. In Phase 4, you'll create separate per-concept research notebooks and manually add the relevant sources from the Discovery Notebook."
