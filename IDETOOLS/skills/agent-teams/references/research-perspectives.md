# Research Perspectives

## Pattern Name

Advocate / Critic / Analyst — structured debate from multiple angles for better decisions.

## When to Use

- Making an architectural or technology decision with significant consequences
- Evaluating a proposal, RFC, or design doc that needs rigorous review
- Comparing multiple approaches where bias toward the first idea is a risk
- Any decision where "what could go wrong" matters as much as "what could go right"
- Team retrospectives or post-mortems where multiple viewpoints improve understanding

## Team Structure

| Agent | Role | Mode | Files |
|-------|------|------|-------|
| **lead** | Frames the question, spawns perspectives, synthesizes decision | Delegate mode | Owns: `decision.md` |
| **advocate** | Argues FOR the proposal/approach — finds every reason it should succeed | Read + write report | Owns: `perspective-advocate.md` |
| **critic** | Argues AGAINST — finds every risk, flaw, and failure mode | Read + write report | Owns: `perspective-critic.md` |
| **analyst** | Neutral comparison — weighs trade-offs, finds middle ground, identifies missing info | Read + write report | Owns: `perspective-analyst.md` |

## Task Dependency Graph

```
Task 1: Advocate perspective           (advocate)
Task 2: Critic perspective             (critic)        ← all parallel
Task 3: Analyst perspective            (analyst)

Task 4: Synthesize into decision       (lead, blocked by 1+2+3)
```

**Key constraint**: Agents do NOT read each other's reports until all three are complete. This prevents anchoring and groupthink.

## Example Prompt

```
Create a team called "decision-[TOPIC]" to evaluate: [DECISION OR PROPOSAL].

Context:
[BACKGROUND — what problem we're solving, constraints, current state]

The question:
[SPECIFIC DECISION — e.g., "Should we migrate from REST to GraphQL?" or "Should we adopt microservices?"]

Team:
- "advocate": Argue FOR [PROPOSAL]. Find every benefit, success story, and reason this is the right choice. Consider: developer experience, performance, scalability, maintainability, ecosystem. Write perspective-advocate.md.
- "critic": Argue AGAINST [PROPOSAL]. Find every risk, cost, failure mode, and hidden complexity. Consider: migration cost, team learning curve, operational complexity, lock-in, edge cases. Write perspective-critic.md.
- "analyst": Neutral analysis. Compare [PROPOSAL] against [ALTERNATIVES]. Identify trade-offs, unknowns, and criteria that should drive the decision. Write perspective-analyst.md.

IMPORTANT: Do not read each other's reports until all three are complete.

After all perspectives are written, I'll synthesize into a decision document.
```

## File Ownership Plan

```
lead:      decision.md (written after synthesis)
advocate:  perspective-advocate.md
critic:    perspective-critic.md
analyst:   perspective-analyst.md
```

- Each agent writes ONLY their own report
- No agent reads another's report during investigation (prevents anchoring)
- The lead synthesizes all three reports into the final decision

## What to Watch For

- **Unconstructive critic**: Require concrete failure scenarios with likelihood and impact, not just "this is bad."
- **Analyst bias**: Analyst report should present criteria and trade-offs, not a recommendation.
- **Premature reading**: Enforce "no reading each other's reports until all complete" — anchoring kills the pattern.

## Customization

- **Scale**: Advocate + critic (2 agents) for simple yes/no. Add "pragmatist" or "ops" perspectives for complex decisions.
- **Adversarial round**: After initial reports, have advocate and critic write rebuttals to each other.
