# Product Requirements Document

<!--
  Fill this document in at the start of every new project.
  Use the prompt in templates/context-generation-prompt.md to generate it,
  or fill it in manually using the structure below.
-->

## Project Overview

**Project Name:** [Your project name]
**Description:** [One-sentence description of what this project does]
**Target Users:** [Who will use this — e.g., "developers building REST APIs", "small team leads"]
**Core Problem:** [What pain point does this solve?]

<!-- Example:
  **Project Name:** InvoiceBot
  **Description:** A Slack bot that generates and sends invoices from natural language commands.
  **Target Users:** Freelancers and small agencies who invoice clients monthly.
  **Core Problem:** Creating invoices manually is tedious — users want to type "/invoice Acme Corp $5000 due Jan 30" and have it handled.
-->

---

## Goals

1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | [What the system must do] | Critical / High / Medium / Low |
| FR-02 | [Next requirement] | Critical / High / Medium / Low |

<!-- Example:
  | FR-01 | Users can create invoices via Slack slash command | Critical |
  | FR-02 | Invoices are emailed as PDF to the client | Critical |
  | FR-03 | Users can list unpaid invoices | High |
-->

---

## Non-Functional Requirements

- **Performance:** [Response time targets, throughput expectations]
- **Security:** [Auth method, data protection, compliance needs]
- **Availability:** [Uptime target, disaster recovery]
- **Scalability:** [Expected load, growth projections]

---

## Scope Boundaries

**In scope:**
- [Feature / capability that IS included in this version]

**Out of scope:**
- [Feature / capability that is NOT included — avoids scope creep]

---

## Success Metrics

- [How you know the project succeeded — e.g., "All FR items pass acceptance criteria"]
- [Measurable outcome — e.g., "Invoice generation takes < 3 seconds end-to-end"]
