# Workflow Patterns

Use these patterns when skills involve multi-step processes, branching logic, or coordination across tools.

## Contents

1. [Sequential Workflow Orchestration](#pattern-1-sequential-workflow-orchestration)
2. [Multi-MCP Coordination](#pattern-2-multi-mcp-coordination)
3. [Iterative Refinement](#pattern-3-iterative-refinement)
4. [Context-Aware Tool Selection](#pattern-4-context-aware-tool-selection)
5. [Domain-Specific Intelligence](#pattern-5-domain-specific-intelligence)
6. [Conditional Workflows](#conditional-workflows)

---

## Pattern 1: Sequential Workflow Orchestration

**Use when:** Users need multi-step processes in a specific order.

```markdown
## Workflow: Onboard New Customer

### Step 1: Create Account
Call MCP tool: `create_customer`
Parameters: name, email, company

### Step 2: Setup Payment
Call MCP tool: `setup_payment_method`
Wait for: payment method verification

### Step 3: Create Subscription
Call MCP tool: `create_subscription`
Parameters: plan_id, customer_id (from Step 1)

### Step 4: Send Welcome Email
Call MCP tool: `send_email`
Template: welcome_email_template
```

**Key techniques:**
- Explicit step ordering with dependencies between steps
- Validation at each stage before proceeding
- Rollback instructions for failures
- Data passing between steps (e.g., customer_id from Step 1 used in Step 3)

**Overview pattern** - Give Claude a map of the process at the top of SKILL.md:

```markdown
Filling a PDF form involves these steps:
1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

## Pattern 2: Multi-MCP Coordination

**Use when:** Workflows span multiple services.

```markdown
## Design-to-Development Handoff

### Phase 1: Design Export (Figma MCP)
1. Export design assets from Figma
2. Generate design specifications
3. Create asset manifest

### Phase 2: Asset Storage (Drive MCP)
1. Create project folder in Drive
2. Upload all assets
3. Generate shareable links

### Phase 3: Task Creation (Linear MCP)
1. Create development tasks
2. Attach asset links to tasks
3. Assign to engineering team

### Phase 4: Notification (Slack MCP)
1. Post handoff summary to #engineering
2. Include asset links and task references
```

**Key techniques:**
- Clear phase separation between MCPs
- Data passing between phases (asset links from Phase 2 used in Phase 3)
- Validation before moving to next phase
- Centralized error handling across all phases

## Pattern 3: Iterative Refinement

**Use when:** Output quality improves with iteration.

```markdown
## Iterative Report Creation

### Initial Draft
1. Fetch data via MCP
2. Generate first draft report
3. Save to temporary file

### Quality Check
1. Run validation script: `scripts/check_report.py`
2. Identify issues:
   - Missing sections
   - Inconsistent formatting
   - Data validation errors

### Refinement Loop
1. Address each identified issue
2. Regenerate affected sections
3. Re-validate
4. Repeat until quality threshold met

### Finalization
1. Apply final formatting
2. Generate summary
3. Save final version
```

**Key techniques:**
- Explicit quality criteria defined upfront
- Validation scripts for deterministic checks
- Clear exit conditions to prevent infinite loops
- Separation of draft, review, and finalize stages

## Pattern 4: Context-Aware Tool Selection

**Use when:** Same outcome can be achieved with different tools depending on context.

```markdown
## Smart File Storage

### Decision Tree
1. Check file type and size
2. Determine best storage location:
   - Large files (>10MB): Use cloud storage MCP
   - Collaborative docs: Use Notion/Docs MCP
   - Code files: Use GitHub MCP
   - Temporary files: Use local storage

### Execute Storage
Based on decision:
- Call appropriate MCP tool
- Apply service-specific metadata
- Generate access link

### Provide Context to User
Explain why that storage was chosen
```

**Key techniques:**
- Clear decision criteria with specific thresholds
- Fallback options when primary choice unavailable
- Transparency about choices made

## Pattern 5: Domain-Specific Intelligence

**Use when:** The skill adds specialized knowledge beyond tool access.

```markdown
## Payment Processing with Compliance

### Before Processing (Compliance Check)
1. Fetch transaction details via MCP
2. Apply compliance rules:
   - Check sanctions lists
   - Verify jurisdiction allowances
   - Assess risk level
3. Document compliance decision

### Processing
IF compliance passed:
- Call payment processing MCP tool
- Apply appropriate fraud checks
- Process transaction
ELSE:
- Flag for review
- Create compliance case

### Audit Trail
- Log all compliance checks
- Record processing decisions
- Generate audit report
```

**Key techniques:**
- Domain expertise embedded in decision logic
- Compliance/validation before action
- Comprehensive documentation and audit trails
- Clear governance rules

## Conditional Workflows

For tasks with branching logic, guide Claude through decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```

Use conditional workflows within any pattern above when the path depends on user input or data state.
