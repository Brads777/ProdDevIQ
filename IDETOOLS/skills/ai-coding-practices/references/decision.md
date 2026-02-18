# Decision Log

<!--
  Record every significant technical or architectural decision here.
  Update this document throughout the project lifecycle.
  Use the prompt in templates/context-generation-prompt.md to generate initial entries,
  then add new decisions as they come up.
-->

## How to Use This Log

For each decision, fill in this template:

```
## D[number]: [Decision Title]

**Context:** [Why this decision was needed — what problem or fork in the road triggered it]

**Options Considered:**
1. **[Option A]** — [Brief description, pros]
2. **[Option B]** — [Brief description, pros]
3. **[Option C]** — [Brief description, pros]

**Decision:** [Which option was chosen]

**Rationale:** [Why this option won over the others]

**Trade-offs:** [What you gave up, risks accepted, things to watch for]
```

---

## D001: [Your First Decision]

**Context:** [Why this decision was needed]

**Options Considered:**
1. **[Option A]** — [Description]
2. **[Option B]** — [Description]

**Decision:** [Chosen option]

**Rationale:** [Why]

**Trade-offs:** [What you gave up]

<!--
  Example of a completed entry:

  ## D001: Database Selection

  **Context:** Need persistent storage for invoice data. Single developer, deployed on one server.

  **Options Considered:**
  1. **PostgreSQL** — Full-featured, great ecosystem, but requires a running server process
  2. **SQLite** — Embedded, zero config, file-based, but limited concurrency
  3. **MongoDB** — Flexible schema, but overkill for structured invoice data

  **Decision:** SQLite

  **Rationale:** Single-user app with no concurrent write pressure. SQLite is zero-config,
  embeds directly in the process, and simplifies deployment. If concurrency becomes an issue
  later, migrating to PostgreSQL via Prisma is straightforward.

  **Trade-offs:** No concurrent write support. Limited to single-server deployment.
  Must migrate if the app becomes multi-user.
-->
