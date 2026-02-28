---
paths:
  - "IDETOOLS/**"
---

# IDETOOLS Quality Standards

## Skill Files (IDETOOLS/skills/)

Every skill directory must contain:
- `SKILL.md` with valid YAML frontmatter (name, description at minimum)
- Copyright stamp: `# ©2026 Brad Scheller` after frontmatter

Recommended SKILL.md frontmatter fields:
- `name`, `description`, `allowed-tools`
- `disable-model-invocation`: true for side-effect commands
- `context`: fork (for commands that should run isolated)

## Agent Files (IDETOOLS/agents/)

Every agent `.md` must have:
- Valid YAML frontmatter with `name`, `description`, `model`
- Copyright stamp after frontmatter
- CRITICAL CONSTRAINTS section as first content heading
- Output Format section at end

## Catalog Maintenance

`IDETOOLS/catalog.md` must stay in sync with `skillpository/index.yaml`.
Run `/skills-audit` after any changes to IDETOOLS/ to verify consistency.
