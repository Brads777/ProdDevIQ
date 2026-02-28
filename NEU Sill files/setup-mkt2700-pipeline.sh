#!/bin/bash
# ============================================================================
# MKT2700 AI-Augmented Product Development Pipeline — Setup Script
# ============================================================================
# 
# This script sets up your complete 7-phase product development pipeline.
# 
# USAGE:
#   bash setup-mkt2700-pipeline.sh
#
# WHAT IT DOES:
#   1. Creates a 'mkt2700-pipeline/' directory in your current folder
#   2. Installs 9 AI skill files (orchestrator + 7 phases + deployment guide)
#   3. Creates a progress tracker (plan.md)
#   4. Creates a README with quick-start instructions
#
# AFTER RUNNING:
#   Option A (Claude.ai Project — Recommended):
#     1. Go to claude.ai → Projects → New Project
#     2. Name: "MKT2700 Semester Project"
#     3. Project Instructions: paste contents of skills/orchestrator.md
#     4. Project Knowledge: upload all files from skills/ folder
#     5. New chat → "Start project"
#
#   Option B (Claude Code):
#     1. cd mkt2700-pipeline
#     2. claude
#     3. Say: "Read the orchestrator skill and start Phase 1"
#
# ============================================================================

set -e

echo ""
echo "  ╔══════════════════════════════════════════════════════════════╗"
echo "  ║                                                              ║"
echo "  ║   🧭  MKT2700 AI Product Development Pipeline               ║"
echo "  ║       Setup Script v1.0                                      ║"
echo "  ║                                                              ║"
echo "  ╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if directory already exists
if [ -d "mkt2700-pipeline" ]; then
    echo "⚠️  Directory 'mkt2700-pipeline/' already exists."
    read -p "   Overwrite? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "   Cancelled. No changes made."
        exit 0
    fi
    rm -rf mkt2700-pipeline
fi

echo "📦 Extracting pipeline files..."

# Extract the embedded archive
ARCHIVE_START=$(awk '/^__ARCHIVE_BELOW__$/{print NR + 1; exit 0; }' "$0")
tail -n +$ARCHIVE_START "$0" | base64 -d | tar xz

echo ""
echo "✅ Pipeline installed successfully!"
echo ""
echo "📁 Files created:"
echo ""
echo "   mkt2700-pipeline/"
echo "   ├── README.md                              ← Start here"
echo "   ├── plan.md                                ← Your progress tracker"
echo "   └── skills/"
echo "       ├── orchestrator.md                    ← Master coordinator"
echo "       ├── phase-1-strategic-foundation.md    ← Company + strategy"
echo "       ├── phase-2-rubric-creation.md         ← Evaluation criteria"
echo "       ├── phase-3-concept-discovery.md       ← AI concept search"
echo "       ├── phase-4-deep-research.md           ← NotebookLM + Perplexity"
echo "       ├── phase-5-concept-evaluation.md      ← Multi-model scoring"
echo "       ├── phase-6-refinement-specification.md← SCAMPER + KANO"
echo "       ├── phase-7-prd-generation.md          ← Final PRD"
echo "       └── DEPLOYMENT.md                      ← Detailed setup guide"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "   OPTION A — Claude.ai Project (Recommended for most students):"
echo "   ──────────────────────────────────────────────────────────────"
echo "   1. Go to claude.ai → Projects → Create New Project"
echo "   2. Name it: 'MKT2700 Semester Project'"
echo "   3. Project Instructions → paste: skills/orchestrator.md"
echo "   4. Project Knowledge → upload ALL files from skills/ folder"
echo "   5. Start new chat → type: 'Start project'"
echo ""
echo "   OPTION B — Claude Code:"
echo "   ──────────────────────────────────────────────────────────────"
echo "   1. cd mkt2700-pipeline"
echo "   2. claude"
echo "   3. Say: 'Read the orchestrator skill and start Phase 1'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 EXTERNAL TOOLS YOU'LL ALSO NEED:"
echo "   • Perplexity Pro  → perplexity.ai    (Phases 3-4)"
echo "   • NotebookLM      → notebooklm.google.com  (Phase 4)"
echo "   • Google AI Studio → aistudio.google.com    (Phase 5)"
echo ""
echo "🧭 Good luck with your semester project!"
echo ""

exit 0

__ARCHIVE_BELOW__
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
HAAYAQA=
