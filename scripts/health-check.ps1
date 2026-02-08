# ©2026 Brad Scheller
# health-check.ps1 — Validate GODMODEDEV project configuration
$ErrorActionPreference = 'Stop'

param(
    [string]$ProjectPath = (Get-Location).Path
)

Write-Host "GODMODEDEV Health Check" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "Project: $ProjectPath"
Write-Host ""

$issues = 0

# Check CLAUDE.md
if (Test-Path (Join-Path $ProjectPath "CLAUDE.md")) {
    Write-Host "  [OK] CLAUDE.md exists" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] CLAUDE.md missing" -ForegroundColor Red
    $issues++
}

# Check .claude directory
$claudeDir = Join-Path $ProjectPath ".claude"
if (Test-Path $claudeDir) {
    Write-Host "  [OK] .claude/ directory exists" -ForegroundColor Green

    # Check settings.json
    if (Test-Path (Join-Path $claudeDir "settings.json")) {
        Write-Host "  [OK] .claude/settings.json exists" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] .claude/settings.json missing" -ForegroundColor Yellow
    }

    # Check rules
    $rulesDir = Join-Path $claudeDir "rules"
    if (Test-Path $rulesDir) {
        $ruleCount = (Get-ChildItem $rulesDir -Filter "*.md").Count
        Write-Host "  [OK] .claude/rules/ has $ruleCount rule files" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] .claude/rules/ missing" -ForegroundColor Yellow
    }

    # Check agents
    $agentsDir = Join-Path $claudeDir "agents"
    if (Test-Path $agentsDir) {
        $agentCount = (Get-ChildItem $agentsDir -Filter "*.md").Count
        Write-Host "  [OK] .claude/agents/ has $agentCount agents" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] .claude/agents/ missing — run /agents-deploy" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [FAIL] .claude/ directory missing" -ForegroundColor Red
    $issues++
}

# Check .mcp.json
if (Test-Path (Join-Path $ProjectPath ".mcp.json")) {
    Write-Host "  [OK] .mcp.json exists" -ForegroundColor Green
} else {
    Write-Host "  [INFO] .mcp.json not present (optional)" -ForegroundColor Gray
}

# Check .orchestrator
$orchDir = Join-Path $ProjectPath ".orchestrator"
if (Test-Path $orchDir) {
    Write-Host "  [OK] .orchestrator/ exists" -ForegroundColor Green
    foreach ($file in @("config.yaml", "status.yaml", "saga-log.yaml")) {
        if (Test-Path (Join-Path $orchDir $file)) {
            Write-Host "  [OK] .orchestrator/$file" -ForegroundColor Green
        } else {
            Write-Host "  [WARN] .orchestrator/$file missing" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  [INFO] .orchestrator/ not initialized — run /init" -ForegroundColor Gray
}

Write-Host ""
if ($issues -eq 0) {
    Write-Host "Health check passed." -ForegroundColor Green
} else {
    Write-Host "Health check found $issues issue(s)." -ForegroundColor Red
}
