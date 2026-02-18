# User Story Template

Use this template to define user stories BEFORE implementation begins.
Stories guide both the implementation and the testing process.

---

## Prompt to Generate User Stories

```
Based on the features defined in `docs/features.json` and the requirements in `docs/PRD.md`, generate user stories for each feature.

Write each story as a separate markdown file inside `user-stories/`.
Use this naming convention: `US-{feature_id}-{short_name}.md`

Each story must follow this format:

# US-{id}: {Title}

## Feature
{Which feature this story covers, referencing features.json ID}

## Priority
{critical | high | medium | low}

## User Story
As a {role}, I want to {action}, so that {benefit}.

## Optimal Path
1. {Step-by-step description of the happy path}
2. {What the user does}
3. {What the system responds with}

## Edge Cases
- {Edge case 1: description and expected behavior}
- {Edge case 2: description and expected behavior}
- {Edge case 3: description and expected behavior}

## Acceptance Criteria
- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] {Criterion 3}

## Test Notes
{Any specific testing instructions, environment requirements, or data setup needed}
```

---

## Implementation Prompt

After stories are generated, use this prompt to implement them:

```
Implement the user stories in `user-stories/` one by one, in priority order (critical first).

For each story:
1. Read the story file
2. Implement the optimal path first
3. Then handle all listed edge cases
4. Verify against every acceptance criterion
5. Mark criteria as checked in the story file
6. Update `docs/features.json` — set "passes" to true only when ALL criteria pass

Do NOT skip edge cases. Do NOT mark a story as done until all criteria are met.
```
