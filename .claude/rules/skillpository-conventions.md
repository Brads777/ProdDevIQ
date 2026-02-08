---
paths:
  - "skillpository/**"
---

# Skillpository Conventions

## Registry Structure

The skillpository index (`skillpository/index.yaml`) contains entries with:
- `name`: unique identifier (lowercase-hyphenated)
- `type`: skill | agent
- `category`: one of 28 skill categories or 11 agent categories
- `description`: one-line summary
- `source`: path to source file in IDETOOLS/
- `tools`: list of tools the item uses
- `model`: recommended model (sonnet, haiku, opus)

## Naming Rules

- Skills: `{domain}-{action}` (e.g., `react-optimization`, `docker-compose-setup`)
- Agents: `{role}-{specialty}` (e.g., `language-specialist-python`, `security-auditor`)
- No spaces, underscores, or camelCase in names

## Adding New Items

1. Create the skill/agent file in `IDETOOLS/skills/` or `IDETOOLS/agents/`
2. Add entry to `skillpository/index.yaml` in correct category
3. Update `IDETOOLS/catalog.md` with human-readable description
4. Run `/skills-audit` to validate the new entry
