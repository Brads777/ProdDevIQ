# Context Generation Prompt

Use this prompt at the start of any new project to generate the four core documentation files. Replace the placeholder sections with your project details.

---

## Prompt

```
I need you to create comprehensive project documentation for the following project. Generate four documents in the `docs/` directory.

PROJECT IDEA:
[Describe your project here — what it does, who it's for, and the core problem it solves]

TECH STACK:
[List your languages, frameworks, databases, and key dependencies]

KEY CONSTRAINTS:
[Any deadlines, performance requirements, platform targets, or business rules]

---

Generate these four documents:

### 1. `docs/PRD.md` — Product Requirements Document
- Project overview and goals
- Target users and use cases
- Functional requirements broken into numbered items
- Non-functional requirements (performance, security, accessibility)
- Scope boundaries (what is explicitly out of scope)
- Success metrics

### 2. `docs/architecture.md` — Architecture Document
- System architecture overview with component diagram (text-based)
- Data models and schemas
- File/folder structure
- API endpoints and contracts
- Third-party integrations
- Infrastructure and deployment notes

### 3. `docs/decision.md` — Decision Log
- For each architectural or technical decision:
  - Decision title
  - Context (why this decision was needed)
  - Options considered
  - Decision made and rationale
  - Consequences and trade-offs
- This document should be updated throughout the project lifecycle

### 4. `docs/features.json` — Feature Tracker
Use this exact JSON schema for token efficiency:

{
  "features": [
    {
      "id": "F001",
      "name": "Feature name",
      "description": "What this feature does",
      "priority": "high|medium|low",
      "dependencies": ["F000"],
      "acceptance_criteria": [
        "Criterion 1",
        "Criterion 2"
      ],
      "passes": false,
      "notes": ""
    }
  ]
}

Include ALL features identified from the PRD. Set all "passes" to false initially.
Order features by dependency (features with no dependencies first).
```

---

## Usage

1. Copy the prompt above
2. Fill in the PROJECT IDEA, TECH STACK, and KEY CONSTRAINTS sections
3. Run it in Claude Code at the start of your project
4. Review and refine the generated documents
5. Reference these documents in all future implementation prompts
