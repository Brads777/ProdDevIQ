# Architecture Document

<!--
  Fill this document in after the PRD is complete.
  Use the prompt in templates/context-generation-prompt.md to generate it,
  or fill it in manually using the structure below.
-->

## System Overview

<!--
  Draw a simple text-based diagram of your system components.
  Example:

  ┌──────────┐     ┌──────────────┐     ┌────────────┐
  │  Slack    │────▶│  Bot Server  │────▶│  Database   │
  │  Client   │◀────│  (Express)   │◀────│  (SQLite)   │
  └──────────┘     └──────┬───────┘     └────────────┘
                          │
                   ┌──────┴───────┐
                   │  Email API   │
                   │  (SendGrid)  │
                   └──────────────┘
-->

```
[Your system diagram here]
```

---

## Tech Stack

- **Runtime:** [e.g., Node.js 20 + TypeScript]
- **Framework:** [e.g., Express.js, Next.js, FastAPI]
- **Database:** [e.g., PostgreSQL + Prisma, SQLite, MongoDB]
- **Auth:** [e.g., JWT, OAuth2, API keys]
- **Testing:** [e.g., Vitest, Jest, pytest]
- **Other:** [Any other key tools — message queues, caches, etc.]

---

## Data Models

<!--
  List each entity with its fields. Example:

  ### Invoice
  ```
  id          UUID (PK)
  client      VARCHAR(200)
  amount      DECIMAL(10,2)
  due_date    DATE
  status      ENUM('draft', 'sent', 'paid', 'overdue')
  created_by  UUID (FK -> User)
  created_at  TIMESTAMP
  ```
-->

### [Entity Name]
```
[field]     [type] [constraints]
```

---

## File Structure

<!--
  Map out your source code layout. Example:

  src/
  ├── server.ts
  ├── routes/
  │   ├── invoices.ts
  │   └── auth.ts
  ├── services/
  │   ├── invoice.service.ts
  │   └── email.service.ts
  └── utils/
      └── errors.ts
-->

```
[Your file structure here]
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| [GET/POST/etc.] | [/path] | [Required/None] | [What it does] |

<!-- Example:
  | POST | /invoices | API key | Create a new invoice |
  | GET  | /invoices | API key | List all invoices    |
-->

---

## Key Design Decisions

<!--
  Brief notes on major choices. Full details go in decision.md.
  Example:
  - **SQLite over PostgreSQL:** Single-user app, no need for a server-based DB
  - **SendGrid over SES:** Simpler API, built-in template support
-->

- **[Choice]:** [One-line rationale]
