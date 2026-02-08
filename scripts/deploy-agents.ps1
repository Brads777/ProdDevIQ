# ©2026 Brad Scheller
# deploy-agents.ps1 — Deploy agent templates to current project's .claude/agents/
$ErrorActionPreference = 'Stop'

param(
    [string]$ProjectPath = (Get-Location).Path
)

$templatePath = "$env:USERPROFILE\.agents\skills\unified-orchestrator\templates\agents"
$targetPath = Join-Path $ProjectPath ".claude\agents"

if (-not (Test-Path $templatePath)) {
    Write-Host "ERROR: Agent templates not found at $templatePath" -ForegroundColor Red
    exit 1
}

# Create target directory
if (-not (Test-Path $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    Write-Host "Created $targetPath" -ForegroundColor Yellow
}

# Copy agents
$agents = Get-ChildItem $templatePath -Filter "*.md"
foreach ($agent in $agents) {
    Copy-Item $agent.FullName -Destination $targetPath -Force
    Write-Host "  Deployed: $($agent.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Deployed $($agents.Count) agents to $targetPath" -ForegroundColor Cyan
Write-Host "Restart Claude Code for agents to appear in /agents menu." -ForegroundColor Yellow
