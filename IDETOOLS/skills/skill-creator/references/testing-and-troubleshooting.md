# Testing and Troubleshooting

## Contents

1. [Testing Approach](#testing-approach)
2. [Success Criteria](#success-criteria)
3. [Troubleshooting](#troubleshooting)
4. [Distribution](#distribution)

---

## Testing Approach

Choose rigor based on your needs: manual testing in Claude.ai for fast iteration, scripted testing in Claude Code for repeatability, or programmatic testing via the skills API for systematic evaluation.

**Pro tip:** Iterate on a single challenging task until Claude succeeds, then extract the winning approach into the skill. Once you have a working foundation, expand to multiple test cases.

### 1. Triggering Tests

Ensure the skill loads at the right times.

```
Should trigger:
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"
- "Initialize a ProjectHub project for Q4 planning"

Should NOT trigger:
- "What's the weather in San Francisco?"
- "Help me write Python code"
- "Create a spreadsheet" (unless the skill handles sheets)
```

**Debug tip:** Ask Claude "When would you use the [skill name] skill?" Claude will quote the description back. Adjust based on what's missing.

### 2. Functional Tests

Verify correct outputs.

```
Test: Create project with 5 tasks
Given: Project name "Q4 Planning", 5 task descriptions
When: Skill executes workflow
Then:
  - Project created in ProjectHub
  - 5 tasks created with correct properties
  - All tasks linked to project
  - No API errors
```

### 3. Performance Comparison

Prove the skill improves results vs. baseline.

```
Without skill:
- 15 back-and-forth messages
- 3 failed API calls requiring retry
- 12,000 tokens consumed

With skill:
- 2 clarifying questions only
- 0 failed API calls
- 6,000 tokens consumed
```

## Success Criteria

Aspirational targets - rough benchmarks rather than precise thresholds.

**Quantitative:**
- Skill triggers on ~90% of relevant queries (test 10-20 queries)
- Completes workflow in target number of tool calls
- 0 failed API calls per workflow

**Qualitative:**
- Users don't need to prompt Claude about next steps
- Workflows complete without user correction
- Consistent results across sessions
- New users accomplish tasks on first try

## Troubleshooting

### Skill Won't Upload

**"Could not find SKILL.md in uploaded folder"**
- Rename to exactly `SKILL.md` (case-sensitive)
- Verify: `ls -la` should show `SKILL.md`

**"Invalid frontmatter"**
Common mistakes:
```yaml
# Wrong - missing delimiters
name: my-skill
description: Does things

# Wrong - unclosed quotes
---
name: my-skill
description: "Does things
---

# Correct
---
name: my-skill
description: Does things
---
```

**"Invalid skill name"**
```yaml
# Wrong
name: My Cool Skill

# Correct
name: my-cool-skill
```

### Skill Doesn't Trigger

Revise the `description` field. Checklist:
- Is it too generic? ("Helps with projects" won't work)
- Does it include trigger phrases users would actually say?
- Does it mention relevant file types if applicable?
- Are technical terms spelled out?

### Skill Triggers Too Often

1. **Add negative triggers:**
```yaml
description: Advanced data analysis for CSV files. Use for statistical
  modeling, regression, clustering. Do NOT use for simple data exploration.
```

2. **Be more specific:**
```yaml
# Too broad
description: Processes documents

# Better
description: Processes PDF legal documents for contract review
```

3. **Clarify scope:**
```yaml
description: PayFlow payment processing for e-commerce. Use specifically
  for online payment workflows, not for general financial queries.
```

### MCP Connection Issues

Skill loads but MCP calls fail:
1. Verify MCP server is connected (Settings > Extensions)
2. Check API keys are valid and not expired
3. Test MCP independently: "Use [Service] MCP to fetch my projects"
4. Verify skill references correct MCP tool names (case-sensitive)

### Instructions Not Followed

Common causes and fixes:
1. **Too verbose** → Use bullet points, move detail to `references/`
2. **Critical info buried** → Put important instructions at the top, use `## Critical` headers
3. **Ambiguous language:**
```markdown
# Bad
Make sure to validate things properly

# Good
CRITICAL: Before calling create_project, verify:
- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
```
4. **For critical validations** → Bundle a script instead of relying on language instructions

### Large Context Issues

Skill seems slow or responses degraded:
1. **Optimize SKILL.md** → Move detailed docs to `references/`, keep body under 500 lines
2. **Reduce enabled skills** → If 20+ skills enabled, recommend selective enablement
3. **Check for duplication** → Info should live in either SKILL.md OR references, not both

## Distribution

### Current Model

**Individual users:**
1. Download skill folder
2. Zip the folder
3. Upload to Claude.ai via Settings > Capabilities > Skills
4. Or place in Claude Code skills directory

**Organizations:**
- Admins can deploy skills workspace-wide
- Automatic updates and centralized management

### Recommended Approach

1. **Host on GitHub** - Public repo, clear README (separate from skill folder), example usage with screenshots
2. **Document with MCP** - Link skill from MCP documentation, explain combined value
3. **Create installation guide** - Step-by-step for download, install, enable, and test

### Positioning

Focus on outcomes, not features:
```
Good: "Set up complete project workspaces in seconds instead of 30 minutes"
Bad: "A folder containing YAML frontmatter and Markdown instructions"
```
