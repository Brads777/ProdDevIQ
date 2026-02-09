---
name: mkt2700-pipeline-deployment-guide
description: Deployment instructions for the MKT2700 AI-Augmented Product Development Pipeline skill system. Covers setup for both Claude.ai Projects and Claude Code.
---

# ©2026 Brad Scheller

# MKT2700 Pipeline — Deployment Guide

## Quick Start

### Option A: Claude.ai Project Setup

1. **Create a new Claude.ai Project** called "MKT2700 Semester Project"
2. **Set Project Instructions** — paste the contents of `skills/orchestrator.md`
3. **Add to Project Knowledge** — upload all remaining skill files (9 files, excluding `orchestrator.md` and `DEPLOYMENT.md`):
   - `skills/phase-1-strategic-foundation.md`
   - `skills/phase-2-rubric-creation.md`
   - `skills/phase-3-concept-discovery.md`
   - `skills/phase-4-deep-research.md`
   - `skills/phase-5-concept-evaluation.md`
   - `skills/phase-6-refinement-specification.md`
   - `skills/phase-7-prd-generation.md`
   - `skills/llm-council-protocol.md`
   - `skills/prd-presentation-SKILL.md`
4. **Start a new chat** and say: "Start project"
5. Follow the orchestrator's guidance through each phase
6. When prompted, open new chats within the same Project for each phase

### Option B: Claude Code Setup

```bash
# 1. Install Claude Code (if not already installed)
npm install -g @anthropic-ai/claude-code

# 2. Create project directory
mkdir mkt2700-project && cd mkt2700-project

# 3. Copy all skill files into the project
cp -r /path/to/mkt2700-pipeline/* .

# 4. Initialize the project
echo "# MKT2700 Semester Project" > plan.md
echo "## Status: Phase 1 — Not Started" >> plan.md

# 5. Start Claude Code
claude

# 6. Say: "Read the orchestrator skill and start Phase 1"
```

#### NotebookLM MCP Server (Auto-Configured)

The package ships with `.claude/mcp.json` pre-configured for the NotebookLM MCP server. When students run `claude` from the ProdDevIQ directory, it will automatically connect to NotebookLM (requires Node.js/npm and Chrome for a one-time Google login).

Uses [PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp). Students who prefer to use NotebookLM manually in the browser can ignore this — the pipeline works without it.

#### Gemini API Setup (Required — for LLM Council Checkpoints)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or sign in with a Google account
3. Generate an API key (free tier available)
4. Set the environment variable:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```
5. Install the Python client:
   ```bash
   pip install google-genai
   ```
6. Verify:
   ```python
   from google import genai
   import os
   client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
   response = client.models.generate_content(
       model="gemini-2.0-flash",
       contents="Hello, Gemini!"
   )
   print(response.text)
   ```

## Pipeline Overview

```
Phase 1: Strategic Foundation
    ↓ (Strategic Brief)
Phase 2: Rubric Creation
    ↓ (Locked Evaluation Rubric)
Phase 3: Concept Discovery
    ↓ (30-40 Concept Candidates)
Phase 4: Deep Research
    ↓ (Research Repository)        ← Gate: NotebookLM notebooks complete?
Phase 5: Concept Evaluation
    ↓ (Scored + Ranked Concepts)   ← Gate: <90% kill, 90-95% revise, >95% continue
Phase 6: Refinement & Specification
    ↓ (SCAMPER + KANO Classified)  ← Gate: All 5 KANO categories complete?
Phase 7: PRD Generation
    ↓ (Final PRD — .md + .docx)
```

## Artifacts Produced

| Phase | Artifact File | Description |
|-------|--------------|-------------|
| 1 | `strategic-brief.md` | Company profile + PESTEL/SWOT/VRIO/Porter's analysis |
| 2 | `evaluation-rubric.md` | Weighted criteria with 0-4 level definitions |
| 3 | `concept-candidates.md` | Ranked list of 30-40 concept candidates |
| 4 | `research-repository.md` | Deep research dossiers per concept |
| 5 | `evaluation-results.md` | Multi-model scored evaluations + rankings |
| 6 | `refined-concept.md` | SCAMPER refinements + KANO classification |
| 7 | `product-requirements-document.md` | Full PRD with all 10 sections |

## Parallel Tool Requirements

Students need accounts for:
- **Claude.ai** (Pro or Team) — latest Opus model access required
- **Google NotebookLM** — free with Google account
- **Perplexity Pro** — paid tier for deep research
- **Google AI Studio** — free Gemini API access (required for LLM Council multi-model evaluation)

## Timeline

| Day | Milestone |
|-----|-----------|
| Feb 10 | Pipeline walkthrough video; begin Phase 1 |
| Feb 11 | Complete Phase 1 + 2; begin Phase 3 discovery |
| Feb 12 | Complete Phase 3; begin Phase 4 deep research |
| Feb 13 | Complete Phase 4 + 5; select final concept |
| Feb 14 | Complete Phase 6; begin Phase 7 PRD |
| Sunday, February 15, 2026 (extended deadline: Tuesday, February 17, no penalty) | Finalize and submit PRD + all artifacts |
