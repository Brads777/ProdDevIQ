---
name: phase-1-strategic-foundation
description: Phase 1 of the MKT2700 AI-Augmented Product Development Pipeline. Conducts a structured interview to define the team's company, industry, and strategic situation, then performs comprehensive strategic analysis (PESTEL, SWOT, VRIO, Porter's 5 Forces, market positioning, positioning disruption). Triggers on "begin phase 1," "strategic foundation," "company definition," or "start project." Outputs a Strategic Brief artifact.
---

# ©2026 Brad Scheller

# Phase 1: Strategic Foundation

## Purpose

Interview the student team to define their company and competitive situation, then conduct a comprehensive strategic analysis that informs every subsequent phase. The output is a Strategic Brief artifact that becomes the foundation for rubric creation, concept discovery, and evaluation.

## Interview Flow

Conduct this as a structured interview. Ask ONE question at a time. Be conversational but thorough.

### Part A: Company Definition (5-7 questions)

1. **Company identity:** "What company are you working with? Is it an existing company or a startup you're creating?"
2. **Industry & market:** "What industry and market segment does this company operate in? Who are the primary customers?"
3. **Strategy type:** "What's the company's growth strategy? Are you looking to: disrupt an existing market, build a platform, create something licensable, build a digital product/service, or develop a physical product?"
4. **Distribution:** "How does the company currently reach customers (or plan to)? Direct, retail, online, B2B, etc.?"
5. **Competitive position:** "Where does the company sit relative to competitors? Market leader, challenger, niche player, or new entrant?"
6. **Resources & constraints:** "What resources does the company have available — budget range, team size, technical capabilities, existing infrastructure?"
7. **Timeline & urgency:** "What's the target timeline for bringing a new product to market? Any regulatory or seasonal constraints?"

### Part B: Self-Assessment (4-5 questions)

8. **Culture readiness:** "How would you rate the company's culture around innovation? Are they risk-tolerant or risk-averse? Do they have a track record of launching new products?"
9. **Technical capability:** "What are the company's core technical strengths? Where are the gaps?"
10. **Market access:** "Does the company have existing distribution channels, customer relationships, or brand recognition that could accelerate a new product?"
11. **Team expertise:** "What domain expertise does the team bring? Any blind spots you're aware of?"
12. **Implementation capacity:** "Realistically, can this company build, launch, and support a new product? What would need to change?"

## Strategic Analysis Framework

After completing the interview, perform these analyses using the interview data plus web research where needed. Present each as a clearly structured section.

## Parallel Research (Run Alongside Interview)

**CRITICAL:** While conducting the interview, simultaneously run parallel research queries in Perplexity Pro and Gemini. The results will enrich the strategic analysis frameworks below.

### Research Areas to Cover
- **Industry trends and emerging forces** — technology shifts, consumer behavior evolution, regulatory changes
- **Key influence factors** — what's driving change in this industry right now
- **Competitor landscape and market positioning** — who's competing, how, and where
- **Market sizing data** — TAM, SAM, SOM estimates where available
- **Recent product launches and failures** — what's worked, what hasn't, and why

### Perplexity Pro Query Templates

Run ALL of these queries. Follow EVERY follow-up question Perplexity suggests.

1. **Industry trends:** "What are the major trends shaping the [INDUSTRY] industry in 2026? Include technology shifts, regulatory changes, and consumer behavior patterns."

2. **Disruption forces:** "What emerging technologies or business models are disrupting [INDUSTRY] right now? Who are the key disruptors and what advantages do they have?"

3. **Competitor analysis:** "Who are the top 5-10 players in [SPECIFIC MARKET SEGMENT]? How do they differentiate themselves? What are their positioning strategies?"

4. **Market sizing:** "What is the current market size for [PRODUCT CATEGORY/MARKET SEGMENT]? What's the projected growth rate through 2028?"

5. **Recent launches:** "What are the most significant product launches in [INDUSTRY] over the past 18 months? Which succeeded and which failed, and why?"

### Gemini Query Templates

Run ALL of these queries in Gemini as well. Compare results with Perplexity findings.

1. **Regulatory landscape:** "What regulatory changes are affecting [INDUSTRY] in 2026? What compliance requirements should new products consider?"

2. **Consumer behavior:** "How has consumer behavior changed in [MARKET SEGMENT] over the past 3 years? What unmet needs are emerging?"

3. **Competitive dynamics:** "Analyze the competitive intensity in [INDUSTRY]. Which companies are gaining market share and what strategies are they using?"

4. **Technology adoption:** "What technologies are [INDUSTRY] companies investing in? Which have demonstrated ROI and which are still experimental?"

5. **Supply chain and distribution:** "What are the current challenges and innovations in [INDUSTRY] supply chains and distribution models?"

**INSTRUCTION:** Run ALL queries above for both tools. Follow EVERY follow-up question they generate. Synthesize findings into the strategic analysis frameworks below, especially PESTEL, Porter's Five Forces, and Positioning Disruption Analysis.

### 1. PESTEL Analysis
Analyze macro-environment forces affecting the company's industry:
- **P**olitical — regulations, trade policy, government stability
- **E**conomic — growth rates, inflation, consumer spending, interest rates
- **S**ocial — demographics, cultural trends, consumer behavior shifts
- **T**echnological — emerging tech, disruption potential, R&D trends
- **E**nvironmental — sustainability pressures, resource scarcity, climate impact
- **L**egal — IP protection, compliance requirements, liability landscape

### 2. Porter's Five Forces
Assess competitive intensity:
- Threat of new entrants
- Bargaining power of suppliers
- Bargaining power of buyers
- Threat of substitutes
- Competitive rivalry

### 3. SWOT Synthesis
Combine internal assessment with external analysis:
- **Strengths** — from self-assessment (capabilities, resources, expertise)
- **Weaknesses** — from self-assessment (gaps, constraints, culture barriers)
- **Opportunities** — from PESTEL + Porter's (market gaps, trends, underserved needs)
- **Threats** — from PESTEL + Porter's (competitive pressure, regulatory risk, disruption)

### 4. VRIO Analysis
Evaluate key resources for sustainable competitive advantage:
- **V**aluable — Does the resource help exploit opportunities or neutralize threats?
- **R**are — Do few competitors possess it?
- **I**mitable — Is it costly for competitors to imitate?
- **O**rganized — Is the company organized to capture value from this resource?

### 5. Market Positioning Framework
Map the current competitive landscape:
- Identify the 2-3 dimensions competitors currently compete on (price, quality, features, speed, customization, etc.)
- Plot where major competitors sit on these dimensions
- Identify the company's current or intended position

### 6. Positioning Disruption Analysis (Blue Ocean)
Identify opportunities to redefine competitive dimensions:
- Which dimensions can be **eliminated** (competitors compete on them but customers don't care)?
- Which can be **reduced** (industry over-delivers on these)?
- Which can be **raised** (underserved but high value)?
- Which can be **created** (new dimensions no one competes on yet)?

## Output: Strategic Brief Artifact

Compile all analysis into a single artifact named `strategic-brief.md`:

```markdown
# Strategic Brief: [Company Name]

## Company Profile
- Name: [name]
- Industry: [industry]
- Type: [startup / existing]
- Strategy: [disrupt / platform / license / digital / physical]
- Competitive Position: [leader / challenger / niche / entrant]
- Key Resources: [summary]
- Key Constraints: [summary]

## Self-Assessment Summary
- Innovation Culture: [rating + notes]
- Technical Capability: [rating + notes]
- Market Access: [rating + notes]
- Implementation Capacity: [rating + notes]

## PESTEL Analysis
[structured output]

## Porter's Five Forces
[structured output]

## SWOT Matrix
| Strengths | Weaknesses |
|-----------|------------|
| ... | ... |
| **Opportunities** | **Threats** |
| ... | ... |

## VRIO Analysis
| Resource | V | R | I | O | Competitive Implication |
|----------|---|---|---|---|------------------------|
| ... | ✓/✗ | ✓/✗ | ✓/✗ | ✓/✗ | [sustained/temporary/parity] |

## Market Positioning Map
[Current competitive dimensions and player positions]

## Positioning Disruption Opportunities
- Eliminate: [dimensions]
- Reduce: [dimensions]
- Raise: [dimensions]
- Create: [dimensions]

## Strategic Recommendation
[Portfolio strategy recommendation: what types of products to pursue and why, based on all analysis above]

## Implications for Rubric Design
[Key criteria that MUST appear in Phase 2 rubric based on this analysis]
```

## Handoff

After generating the Strategic Brief:
1. Save the artifact.
2. Instruct the student: "Phase 1 complete. Your Strategic Brief is saved. Open a new chat in this Project and say 'Begin Phase 2.' Paste your progress tracker."
3. Update the progress tracker to mark Phase 1 complete.
