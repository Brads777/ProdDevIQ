# ©2026 Brad Scheller
# setup-dev.ps1 — One-click dev environment setup for GODMODEDEV
$ErrorActionPreference = 'Stop'

Write-Host "GODMODEDEV Dev Environment Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check prerequisites
$checks = @(
    @{ Name = "Node.js"; Cmd = "node --version" },
    @{ Name = "npm"; Cmd = "npm --version" },
    @{ Name = "Git"; Cmd = "git --version" },
    @{ Name = "Docker"; Cmd = "docker --version" },
    @{ Name = "GitHub CLI"; Cmd = "gh --version" }
)

foreach ($check in $checks) {
    try {
        $version = Invoke-Expression $check.Cmd 2>&1 | Select-Object -First 1
        Write-Host "  [OK] $($check.Name): $version" -ForegroundColor Green
    } catch {
        Write-Host "  [MISSING] $($check.Name)" -ForegroundColor Red
    }
}

# Check Claude Code
try {
    $ccVersion = claude --version 2>&1 | Select-Object -First 1
    Write-Host "  [OK] Claude Code: $ccVersion" -ForegroundColor Green
} catch {
    Write-Host "  [MISSING] Claude Code CLI — install with: npm install -g @anthropic-ai/claude-code" -ForegroundColor Yellow
}

# Check skill symlinks
$skillsPath = "$env:USERPROFILE\.claude\skills"
if (Test-Path $skillsPath) {
    $skillCount = (Get-ChildItem $skillsPath -Directory).Count
    Write-Host "  [OK] Skills installed: $skillCount" -ForegroundColor Green
} else {
    Write-Host "  [WARN] No skills directory at $skillsPath" -ForegroundColor Yellow
}

# Check agents
$agentsPath = "$env:USERPROFILE\.claude\agents"
if (Test-Path $agentsPath) {
    $agentCount = (Get-ChildItem $agentsPath -Filter "*.md").Count
    Write-Host "  [OK] Home agents: $agentCount" -ForegroundColor Green
} else {
    Write-Host "  [WARN] No home agents directory" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete. Run 'claude' to start." -ForegroundColor Cyan
