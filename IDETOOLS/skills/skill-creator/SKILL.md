---
name: skill-creator
description: Interactive guide for creating, reviewing, and iterating on skills that extend Claude's capabilities with specialized knowledge, workflows, or tool integrations. Use when user says "create a skill", "build a skill for X", "help me make a skill", "review this skill", "improve this skill", or wants to update an existing skill. Handles standalone skills, MCP-enhanced workflows, and document/asset creation skills. Do NOT use for general coding tasks unrelated to skill creation.
license: Complete terms in LICENSE.txt
---
# ©2026 Brad Scheller

# Skill Creator

Create effective skills by following these steps in order. Skip steps only when clearly unnecessary.

## Step 1: Understand the Use Case

Identify 2-3 concrete examples of how the skill will be used before writing anything.

Ask the user:
- What tasks should this skill handle?
- What would a user say to trigger it?
- What tools are needed (built-in or MCP)?
- What domain knowledge should be embedded?

Skills fall into three categories:

| Category | Best For | Example |
|----------|----------|---------|
| Document & Asset Creation | Consistent output (docs, apps, designs) | frontend-design, docx, pptx |
| Workflow Automation | Multi-step processes, consistent methodology | skill-creator, sprint-planner |
| MCP Enhancement | Workflow guidance on top of MCP tool access | sentry-code-review |

Conclude when there is a clear sense of functionality and trigger scenarios.

## Step 2: Plan Reusable Contents

For each concrete example, analyze:
1. What code gets rewritten every time? → `scripts/`
2. What reference material is needed? → `references/`
3. What templates/assets are used in output? → `assets/`

Examples:
- PDF rotation → `scripts/rotate_pdf.py`
- Frontend webapp → `assets/hello-world/` boilerplate
- BigQuery queries → `references/schema.md`

## Step 3: Initialize the Skill

For new skills, run the init script:

```bash
python scripts/init_skill.py <skill-name> --path <output-directory>
```

Creates a template skill directory with SKILL.md and example resource dirs. Skip if iterating on an existing skill.

## Step 4: Write the Skill

### Frontmatter (Critical)

The frontmatter is how Claude decides whether to load the skill. This is the most important part.

```yaml
---
name: kebab-case-name
description: What it does. Use when user asks to [specific phrases]. Do NOT use for [exclusions].
---
```

**Field rules:**
- `name`: kebab-case only, max 64 chars, must match folder name
- `description`: max 1024 chars, MUST include WHAT + WHEN (trigger phrases), no XML angle brackets
- Names containing "claude" or "anthropic" are reserved
- All "when to use" info goes in description, NOT in the body (body loads after triggering)

**Good description:**
```
Manages Linear project workflows including sprint planning, task creation,
and status tracking. Use when user mentions "sprint", "Linear tasks",
"project planning", or asks to "create tickets".
```

**Bad description:**
```
Helps with projects.
```

**Optional fields:** `license`, `allowed-tools`, `metadata`, `compatibility` (1-500 chars for environment requirements). Do not include other fields.

### Body

Write instructions for another Claude instance. Include only what Claude doesn't already know.

**Core principle: Claude is already smart.** Only add non-obvious domain knowledge, specific workflows, or procedural steps. Challenge each paragraph: "Does this justify its token cost?" Prefer concise examples over verbose explanations.

**Structure guidelines:**
- Keep body under 500 lines
- Use imperative/infinitive form
- Move detailed docs to `references/` and link clearly
- Keep references one level deep from SKILL.md
- For reference files over 100 lines, include a table of contents

**Match specificity to the task's fragility:**
- **High freedom** (text instructions): Multiple valid approaches, context-dependent
- **Medium freedom** (pseudocode/parameterized scripts): Preferred pattern exists, some variation OK
- **Low freedom** (specific scripts): Fragile operations, consistency critical

**Design patterns** - consult based on need:
- Multi-step processes → see `references/workflows.md`
- Output format and quality standards → see `references/output-patterns.md`

### Progressive Disclosure

Skills use three loading levels:

1. **Metadata** (name + description) - Always in context (~100 words)
2. **SKILL.md body** - Loaded when skill triggers (<5k words)
3. **Bundled resources** - Loaded as needed (unlimited)

When SKILL.md approaches 500 lines, split content into reference files:

**Pattern A: High-level guide with references**
```markdown
## Advanced features
- **Form filling**: See `references/forms.md`
- **API reference**: See `references/api.md`
```

**Pattern B: Domain-specific organization**
```
references/
├── finance.md    # Only loaded for finance queries
├── sales.md      # Only loaded for sales queries
└── product.md    # Only loaded for product queries
```

**Pattern C: Conditional details**
```markdown
For simple edits, modify the XML directly.
**For tracked changes**: See `references/redlining.md`
```

### Skill Anatomy

```
skill-name/
├── SKILL.md          # Required: instructions with YAML frontmatter
├── scripts/          # Optional: executable code (Python/Bash/etc.)
├── references/       # Optional: docs loaded into context as needed
└── assets/           # Optional: files used in output (templates, fonts, icons)
```

**scripts/**: For code that gets rewritten repeatedly or needs deterministic reliability. May be executed without loading into context.

**references/**: Documentation Claude should reference while working. Keeps SKILL.md lean. If files are large (>10k words), include grep search patterns in SKILL.md.

**assets/**: Templates, images, fonts, boilerplate used in output. Not loaded into context.

**Do NOT include:** README.md, CHANGELOG.md, INSTALLATION_GUIDE.md, or any auxiliary documentation. Skills contain only what an AI agent needs to do the job.

### Start with Resources, Then Write SKILL.md

1. Implement `scripts/`, `references/`, and `assets/` files identified in Step 2
2. Test scripts by actually running them
3. Delete any example files from init that aren't needed
4. Write SKILL.md body referencing the resources

## Step 5: Package and Validate

```bash
python scripts/package_skill.py <path/to/skill-folder> [output-directory]
```

Validates frontmatter, naming, and structure, then creates a distributable `.skill` file (zip format).

For validation only:
```bash
python scripts/quick_validate.py <path/to/skill-folder>
```

## Step 6: Test and Iterate

Test three areas:
1. **Triggering** - Does the skill load for relevant queries and NOT for unrelated ones?
2. **Functional** - Does it produce correct outputs with proper error handling?
3. **Performance** - Fewer back-and-forth messages, failed calls, and tokens vs. baseline?

For detailed testing methodology and troubleshooting, see `references/testing-and-troubleshooting.md`.

**Iteration signals:**
- Under-triggering → Add more trigger phrases and keywords to description
- Over-triggering → Add negative triggers ("Do NOT use for..."), be more specific
- Instructions not followed → Make instructions more concise, use scripts for critical validations
- Context bloat → Move detailed content to `references/`, reduce SKILL.md body size
